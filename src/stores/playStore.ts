import { Howl } from 'howler'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getVideoDetail } from '@/api/search'

export interface IPlaylist {
  id: string
  name: string
  musics: ISong[]
  createTime: number
  updateTime: number
  isDefault?: boolean
}

// LRU工具
function lruInsert<T = Record<string, any>>(arr: T[], item: T, max: number, key: keyof T) {
  const idx = arr.findIndex(i => i[key] === item[key])
  if (idx !== -1)
    arr.splice(idx, 1)
  arr.unshift(item)
  if (arr.length > max)
    arr.pop()
}

export const usePlayStore = defineStore('play', () => {
  // 历史记录（LRU，最大100条）
  const history = ref<ISong[]>([])
  const HISTORY_MAX = 100

  // 喜欢的音乐
  const liked = ref<ISong[]>([])

  // 默认歌单
  const defaultPlaylists = computed<IPlaylist[]>(() => [
    { id: 'history', name: '最近播放', musics: history.value, createTime: Date.now(), updateTime: Date.now(), isDefault: true },
    { id: 'liked', name: '我喜欢的', musics: liked.value, createTime: Date.now(), updateTime: Date.now(), isDefault: true },
  ])

  // 其他自定义歌单
  const customPlaylists = ref<IPlaylist[]>([])

  const playlists = computed(() => [...defaultPlaylists.value, ...customPlaylists.value])

  // 添加到历史（LRU）
  function addToHistory(music: ISong) {
    lruInsert(history.value, music, HISTORY_MAX, 'bvid')
  }

  // 添加/移除喜欢
  function toggleLike(music: ISong) {
    const idx = liked.value.findIndex(i => i.bvid === music.bvid)
    if (idx === -1) {
      liked.value.unshift(music)
    } else {
      liked.value.splice(idx, 1)
    }
  }

  // 歌单管理
  function createPlaylist(name: string) {
    const id = `custom_${Date.now()}`
    customPlaylists.value.push({
      id,
      name,
      musics: [],
      createTime: Date.now(),
      updateTime: Date.now(),
    })
  }

  function removePlaylist(id: string) {
    const idx = customPlaylists.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      customPlaylists.value.splice(idx, 1)
    }
  }

  function addMusicToPlaylist(playlistId: string, music: ISong) {
    const playlist = customPlaylists.value.find(p => p.id === playlistId)
    if (playlist) {
      if (!playlist.musics.find(i => i.bvid === music.bvid)) {
        playlist.musics.push(music)
        playlist.updateTime = Date.now()
      }
    }
  }

  function removeMusicFromPlaylist(playlistId: string, musicId: string | number) {
    const playlist = customPlaylists.value.find(p => p.id === playlistId)
    if (playlist) {
      const idx = playlist.musics.findIndex(i => i.bvid === musicId)
      if (idx !== -1) {
        playlist.musics.splice(idx, 1)
        playlist.updateTime = Date.now()
      }
    }
  }

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

  // 播放指定歌曲（可选：插入到队列/直接播放）
  async function play(song: ISong) {
    // [x] cleanup 上一首歌 并初始化状态
    resetPlayerState()

    const idx = playQueue.value.findIndex(item => item.bvid === song.bvid)
    if (idx !== -1) {
      currentIndex.value = idx
    } else {
      // 插入到第一位
      playQueue.value.unshift(song)
      currentIndex.value = 0
    }

    try {
      // 获取音频播放地址
      loading.value = true
      const songDetail = await getVideoDetail(song.bvid)

      // 停止并卸载上一个音频
      if (player) {
        player.unload()
        player = null
      }

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
        onload() {
          // 加载完成后取消loading
          loading.value = false
        },
        onend: () => {
          playNext()
        },
        onplay: () => {
          // 加载完成后取消loading
          loading.value = false

          isPlaying.value = true
          duration.value = player?.duration() || 0
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
    }
  }

  /// 重置播放器的状态
  function resetPlayerState() {
    console.log('cleanup => ')
    currentTime.value = 0
  }

  // 下一首
  function playNext() {
    if (playQueue.value.length === 0) {
      // [ ] 当前播放列表为空， ui提示
      return
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

    if (playQueue.value[currentIndex.value]) {
      play(playQueue.value[currentIndex.value])
    }
  }

  // 暂停
  function pause() {
    if (player && isPlaying.value) {
      player.pause()
      isPlaying.value = false
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
    }
  }

  // 停止
  function stop() {
    if (player) {
      player.stop()
      player.unload()
      player = null
      if (timer)
        clearInterval(timer)
    }
    isPlaying.value = false
  }

  // 清空队列
  function clearQueue() {
    playQueue.value = []
    currentIndex.value = -1
    isPlaying.value = false
  }

  // 添加到队列但不播放
  function addToQueue(song: ISong) {
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

  return {
    history,
    liked,
    defaultPlaylists,
    customPlaylists,
    playlists,
    addToHistory,
    toggleLike,
    createPlaylist,
    removePlaylist,
    addMusicToPlaylist,
    removeMusicFromPlaylist,

    playQueue,
    currentIndex,
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    setVolume,
    seek,
    play,
    playNext,
    playPrev,
    pause,
    resume,
    stop,
    clearQueue,
    addToQueue,

    loading,
  }
}, {
  persist: {
    key: '__pinia_play',
    storage: localStorage,
  },
})
