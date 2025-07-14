import type { Howl } from 'howler'
import { Howler } from 'howler'
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
  const isLoading = ref(false)
  const currentTime = ref(0)
  const currentVolume = ref(50)
  const freeLimit = ref(5)

  let player: Howl

  // 播放队列
  const playQueue = ref<ISong[]>([])
  // 当前播放索引
  const currentIndex = ref<number>(-1)
  // 播放器显示
  const isShowPlayer = ref(false)
  // 当前歌曲
  const currentSong = computed(() => playQueue.value[currentIndex.value] || null)

  // 播放指定歌曲（可选：插入到队列/直接播放）
  async function play(song: ISong) {
    const idx = playQueue.value.findIndex(item => item.bvid === song.bvid)
    if (idx !== -1) {
      currentIndex.value = idx
    } else {
      playQueue.value.push(song)
      currentIndex.value = playQueue.value.length - 1
    }

    // todo: 这里可以将已经获取过的音乐缓存到本地

    const songDetail = await getVideoDetail(song.bvid)
    console.log('🚀 ~ play ~ songDetail:', songDetail)

    isPlaying.value = true
    isShowPlayer.value = true
  }

  // 播放队列中的指定索引
  function playByIndex(idx: number) {
    if (idx >= 0 && idx < playQueue.value.length) {
      currentIndex.value = idx
      isPlaying.value = true
      isShowPlayer.value = true
    }
  }

  // 下一首
  function playNext() {
    if (playQueue.value.length === 0)
      return
    if (currentIndex.value < playQueue.value.length - 1) {
      currentIndex.value++
      isPlaying.value = true
    }
  }

  // 上一首
  function playPrev() {
    if (playQueue.value.length === 0)
      return
    if (currentIndex.value > 0) {
      currentIndex.value--

      isPlaying.value = true
    }
  }

  // 暂停
  function pause() {
    isPlaying.value = false
  }

  // 恢复播放
  function resume() {
    if (currentSong.value)
      isPlaying.value = true
  }

  // 停止
  function stop() {
    isPlaying.value = false
    isShowPlayer.value = false
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
    isShowPlayer,
    play,
    playByIndex,
    playNext,
    playPrev,
    pause,
    resume,
    stop,
    clearQueue,
    addToQueue,
  }
}, {
  persist: {
    key: '__pinia_play',
    storage: localStorage,
  },
})
