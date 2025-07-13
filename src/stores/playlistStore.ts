import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface IPlaylist {
  id: string
  name: string
  musics: IBilibiliVideoData[]
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

export const usePlaylistStore = defineStore('playlist', () => {
  // 历史记录（LRU，最大100条）
  const history = ref<IBilibiliVideoData[]>([])
  const HISTORY_MAX = 100

  // 喜欢的音乐
  const liked = ref<IBilibiliVideoData[]>([])

  // 默认歌单
  const defaultPlaylists = ref<IPlaylist[]>([
    { id: 'history', name: '最近播放', musics: history.value, createTime: Date.now(), updateTime: Date.now(), isDefault: true },
    { id: 'liked', name: '我喜欢的', musics: liked.value, createTime: Date.now(), updateTime: Date.now(), isDefault: true },
  ])

  // 其他自定义歌单
  const customPlaylists = ref<IPlaylist[]>([])

  // 添加到历史（LRU）
  function addToHistory(music: IBilibiliVideoData) {
    lruInsert(history.value, music, HISTORY_MAX, 'id')
  }

  // 添加/移除喜欢
  function toggleLike(music: IBilibiliVideoData) {
    const idx = liked.value.findIndex(i => i.id === music.id)
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

  function addMusicToPlaylist(playlistId: string, music: IBilibiliVideoData) {
    const playlist = customPlaylists.value.find(p => p.id === playlistId)
    if (playlist) {
      if (!playlist.musics.find(i => i.id === music.id)) {
        playlist.musics.push(music)
        playlist.updateTime = Date.now()
      }
    }
  }

  function removeMusicFromPlaylist(playlistId: string, musicId: string | number) {
    const playlist = customPlaylists.value.find(p => p.id === playlistId)
    if (playlist) {
      const idx = playlist.musics.findIndex(i => i.id === musicId)
      if (idx !== -1) {
        playlist.musics.splice(idx, 1)
        playlist.updateTime = Date.now()
      }
    }
  }

  return {
    history,
    liked,
    defaultPlaylists,
    customPlaylists,
    addToHistory,
    toggleLike,
    createPlaylist,
    removePlaylist,
    addMusicToPlaylist,
    removeMusicFromPlaylist,
  }
}, {
  persist: {
    key: '__pinia_playlist',
    storage: localStorage,
  },
})
