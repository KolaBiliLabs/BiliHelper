import { LIKE_STATUS_CHANGE, PLAY_STATUS_CHANGE } from '@constants/ipcChannels'
import { HISTORY_PAGE, LIKED_PAGE, PLUGIN_PAGE } from '@constants/pageId'
import { HISTORY_MAX } from '@constants/renderer'
import { Howl } from 'howler'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getVideoDetail } from '@/api/search'
import { isInList, isSameSong, lruInsert } from '@/utils/helper'

export interface IPlaylist {
  id: string
  name: string
  description: string
  musics: ISong[]
  createTime: number
  updateTime: number
  isDefault?: boolean
}

export const usePlayStore = defineStore('play', () => {
  // 历史记录（LRU，最大100条）
  const history = ref<ISong[]>([])

  // 喜欢的音乐
  const liked = ref<ISong[]>([])

  /// 来自插件的歌曲
  const fromPlugin = ref<ISong[]>([])

  // 默认歌单
  const defaultPlaylists = computed<IPlaylist[]>(() => [
    { id: HISTORY_PAGE, name: '最近播放', description: '最近播放的歌曲', musics: history.value, createTime: Date.now(), updateTime: Date.now(), isDefault: true },
    { id: LIKED_PAGE, name: '我喜欢的', description: '我喜欢的歌曲', musics: liked.value, createTime: Date.now(), updateTime: Date.now(), isDefault: true },
    { id: PLUGIN_PAGE, name: '来自插件', description: '从浏览器插件添加的歌曲', musics: fromPlugin.value, createTime: Date.now(), updateTime: Date.now(), isDefault: true },
  ])

  // 其他自定义歌单
  const customPlaylists = ref<IPlaylist[]>([])

  // 所有歌单
  const playlists = computed(() => [...defaultPlaylists.value, ...customPlaylists.value])

  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(1)
  const loading = ref(false)

  let player: Howl | null = null
  let timer: ReturnType<typeof setInterval> | null = null

  // 播放队列
  const playQueue = ref<ISong[]>([])
  // 当前播放索引
  const currentIndex = ref<number>(-1)

  // 当前歌曲
  const currentSong = computed(() => playQueue.value[currentIndex.value] || null)

  /**
   * 切换喜欢状态 （在喜欢列表中）
   * @param song
   */
  function toggleLike(song: ISong) {
    const idx = isInList(liked.value, song)
    if (idx !== -1) {
      liked.value.splice(idx, 1)
    } else {
      liked.value.unshift(song)
    }
    // 同步托盘喜欢状态
    if (currentSong.value && isSameSong(currentSong.value, song)) {
      // idx === -1 表示歌曲不在喜欢列表中，需要同步托盘喜欢状态
      window.electron.ipcRenderer.send(LIKE_STATUS_CHANGE, idx === -1)
    }
  }

  /**
   * @description 添加到历史（LRU）
   * @param song
   */
  function addToHistory(song: ISong) {
    lruInsert(history.value, song, HISTORY_MAX)
  }

  /**
   * @description 添加到插件列表
   */
  function addToPlugin(music: ISong) {
    const idx = isInList(fromPlugin.value, music)
    if (idx !== -1) {
      return
    }
    fromPlugin.value.unshift(music)
  }

  /**
   * 创建歌单
   * @param name
   * @param description
   */
  function createPlaylist(name: string, description: string) {
    const id = `custom_${Date.now()}`
    customPlaylists.value.push({
      id,
      name,
      description,
      musics: [],
      createTime: Date.now(),
      updateTime: Date.now(),
    })
  }

  /**
   * 删除歌单
   * @param id
   */
  function removePlaylist(id: string) {
    const idx = customPlaylists.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      customPlaylists.value.splice(idx, 1)
    }
  }

  /**
   * 添加歌曲到播放列表
   * @param playlistId
   * @param music
   */
  function addMusicToPlaylist(playlistId: string, music: ISong) {
    const playlist = customPlaylists.value.find(p => p.id === playlistId)
    if (playlist) {
      if (isInList(playlist.musics, music) === -1) {
        playlist.musics.push(music)
        playlist.updateTime = Date.now()
      }
    }
  }

  /**
   * 从指定歌单中移除歌曲
   */
  function removeMusicFromPlaylist(playlistId: string, song: ISong) {
    const playlist = [...defaultPlaylists.value, ...customPlaylists.value].find(p => p.id === playlistId)
    if (playlist) {
      const idx = isInList(playlist.musics, song)
      if (idx !== -1) {
        playlist.musics.splice(idx, 1)
        playlist.updateTime = Date.now()
      }
    }
  }

  /**
   * 编辑歌单
   * @param id
   * @param name
   * @param description
   */
  function updatePlaylist(id: string, name: string, description: string) {
    const playlist = customPlaylists.value.find(p => p.id === id)
    if (playlist) {
      playlist.name = name
      playlist.description = description
      playlist.updateTime = Date.now()
    }
  }

  // 播放指定歌曲（可选：插入到队列/直接播放）
  async function play(song: ISong) {
    if (!song) {
      // 提示用户歌曲不存在 当未选择歌曲时，从托盘点击播放相关行为的按钮会导致这个 bug
      window.$message.error('歌曲不存在')
      return
    }
    // [x] cleanup 上一首歌 并初始化状态
    resetPlayerState()

    // 插入到播放队列
    const idx = isInList(playQueue.value, song)
    if (idx !== -1) {
      currentIndex.value = idx
    } else {
      // 插入到第一位
      playQueue.value.unshift(song)
      currentIndex.value = 0
    }

    // 添加到历史记录
    addToHistory(song)

    // 同步托盘喜欢状态
    window.electron.ipcRenderer.send(LIKE_STATUS_CHANGE, isInList(liked.value, song) !== -1)

    // 同步托盘播放状态
    window.electron.ipcRenderer.send(PLAY_STATUS_CHANGE, true)

    try {
      // 停止并卸载上一个音频
      unloadPlayer()

      // 开始获取音频播放地址
      loading.value = true

      // [ ] 增加缓存： 将播放过的歌曲缓存到本地
      // 获取即将播放的歌曲
      const songDetail = await getVideoDetail(song.bvid)

      // 取第一个可用 url
      const url = songDetail.urls?.[0]
      if (!url) {
        console.error('未获取到音频播放地址')
        return
      }

      player = new Howl({
        src: [url],
        html5: true,
        volume: volume.value,
        onend: () => {
          playNext()
        },
        onload() {
          loading.value = false
        },
        onplay: () => {
          loading.value = false
          isPlaying.value = true
          duration.value = player?.duration() || 0
          currentTime.value = player?.seek() as number

          console.log('start playing => ', player?.duration(), player?.seek(), loading.value)

          // 定时刷新 currentTime
          if (timer) {
            clearInterval(timer)
          }
          timer = setInterval(() => {
            if (player && isPlaying.value) {
              currentTime.value = player.seek() as number
            }
          }, 500)
        },
        onpause: () => {
          isPlaying.value = false
          if (timer) {
            clearInterval(timer)
          }
        },
        onstop: () => {
          isPlaying.value = false
          if (timer)
            clearInterval(timer)
        },
        onloaderror: (_id, err) => {
          console.error('音频加载失败', err)
        },
        onplayerror: (_id, err) => {
          console.error('音频播放失败', err)
        },
      })
      player.play()
      isPlaying.value = true
    } catch (error) {
      loading.value = false
      console.error('playStore => play ', error)
      window.$message.error((error as { message: string }).message)
    }
  }

  /// 重置播放器的状态
  function resetPlayerState() {
    if (player) {
      player.seek(0)
      player.stop()
    }
    console.log('cleanup => ')
    currentTime.value = 0
  }

  // 下一首
  function playNext(fromDel: boolean = false) {
    if (playQueue.value.length === 0) {
      // [ ] 当前播放列表为空， ui提示
      return
    }

    if (fromDel) {
      playIndexInQueue(currentIndex.value)
    }

    const nextIndex = currentIndex.value < playQueue.value.length - 1 ? currentIndex.value + 1 : 0
    playIndexInQueue(nextIndex)
  }

  // 上一首
  function playPrev() {
    if (playQueue.value.length === 0) {
      // [ ] 当前播放列表为空，ui提示
      return
    }

    const prevIndex = currentIndex.value > 0 ? currentIndex.value - 1 : playQueue.value.length - 1
    playIndexInQueue(prevIndex)
  }

  // 用于播放 上一曲/下一曲 in queue
  function playIndexInQueue(index: number) {
    // 先暂停当前歌曲
    stop()

    currentIndex.value = index

    const song = playQueue.value[currentIndex.value]
    if (song) {
      play(song)
    }
  }

  // 暂停
  function pause() {
    if (player && isPlaying.value) {
      player.pause()
      isPlaying.value = false
      window.electron.ipcRenderer.send(PLAY_STATUS_CHANGE, false)
      if (timer) {
        clearInterval(timer)
      }
    }
  }

  // 恢复播放
  function resume() {
    if (player && !isPlaying.value) {
      player.play()
      isPlaying.value = true
      window.electron.ipcRenderer.send(PLAY_STATUS_CHANGE, true)
    }
  }

  function pauseOrResume() {
    if (player) {
      if (isPlaying.value) {
        player.pause()
        isPlaying.value = false
        window.electron.ipcRenderer.send(PLAY_STATUS_CHANGE, false)
      } else {
        player.play()
        isPlaying.value = true
        window.electron.ipcRenderer.send(PLAY_STATUS_CHANGE, true)
      }
    }
  }

  /**
   * 播放指定歌单的全部歌曲
   * @param id
   */
  function playAll(id: string) {
    const allPlaylist = [...defaultPlaylists.value, ...customPlaylists.value]
    const playlist = allPlaylist.find(p => p.id === id)

    if (!playlist?.musics.length) {
      window.$message.info('请添加歌曲至当前歌单')
      return
    }

    if (playlist) {
      // 将播放队列替换为指定歌单
      playQueue.value = [...playlist.musics]

      const firstSong = playQueue.value[0]
      play(firstSong)
    }
  }

  // 停止
  function stop() {
    if (player) {
      unloadPlayer()
      if (timer) {
        clearInterval(timer)
      }
    }
    isPlaying.value = false
    window.electron.ipcRenderer.send(PLAY_STATUS_CHANGE, false)
  }

  // 清空队列
  function clearQueue() {
    unloadPlayer()
    playQueue.value = []
    currentIndex.value = -1
    isPlaying.value = false
  }

  // 添加到队列但不播放
  function addToQueue(song: ISong) {
    // [ ]: 这里是否需要修改 index?
    if (!playQueue.value.find(item => item.bvid === song.bvid)) {
      playQueue.value.push(song)
    }
  }

  // 设置音量
  function setVolume(val: number) {
    volume.value = val
    if (player)
      player.volume(val)
  }

  // 拖动进度条
  function seek(time: number) {
    if (player) {
      player.seek(time)
      currentTime.value = time
    }
  }

  function unloadPlayer() {
    if (player) {
      player.stop()
      player.unload()
      player = null
      console.log('🦄 unloadingPlayer => ')
    }
  }

  return {
    history,
    liked,
    fromPlugin,
    defaultPlaylists,
    customPlaylists,
    playlists,
    addToHistory,
    toggleLike,
    addToPlugin,
    createPlaylist,
    removePlaylist,
    addMusicToPlaylist,
    removeMusicFromPlaylist,
    updatePlaylist, // 新增
    playQueue,
    currentIndex,
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    loading,

    setVolume,
    seek,
    play,
    playNext,
    playPrev,
    playIndexInQueue,
    pause,
    resume,
    stop,
    clearQueue,
    addToQueue,
    pauseOrResume,

    playAll,

    hasPlayer() {
      return player !== null
    },
  }
}, {
  persist: {
    key: '__pinia_play',
    storage: localStorage,
  },
})
