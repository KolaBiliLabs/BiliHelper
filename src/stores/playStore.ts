import { LIKE_STATUS_CHANGE } from '@constants/ipcChannels'
import { HISTORY_PAGE, LIKED_PAGE, PLUGIN_PAGE } from '@constants/pageId'
import { HISTORY_MAX } from '@constants/renderer'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { isInList, isSameSong, lruInsert } from '@/utils/helper'

export type PlaySongMode = 'repeat' | 'repeat-once' | 'shuffle'

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

  // 播放状态
  const isPlaying = ref(false)
  const currentTime = ref(0)

  // 播放模式
  const playSongMode = ref<PlaySongMode>('repeat')
  // 播放速率
  const playRate = ref(1)
  // 播放时长
  const playDuration = ref(0)
  // 播放音量
  const playVolume = ref(1)
  const playVolumeMute = ref(playVolume.value)
  // 播放进度
  const playProgress = ref(0)
  // 加载状态
  const loading = ref(false)

  let player: Howl | null = null

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

      // const firstSong = playQueue.value[0]
      // play(firstSong)
    }
  }

  function setPlayQueue(list: ISong[]) {
    playQueue.value = list
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
    playVolume.value = val
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
    setPlayQueue,

    currentIndex,
    currentSong,
    isPlaying,
    currentTime,
    playDuration,
    playVolume,
    playVolumeMute,
    playProgress,
    loading,

    playSongMode,
    playRate,

    setVolume,
    seek,
    stop,
    clearQueue,
    addToQueue,

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
