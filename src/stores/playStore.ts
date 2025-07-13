import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const usePlayStore = defineStore('play', () => {
  // 播放队列
  const playQueue = ref<IBilibiliVideoData[]>([])
  // 当前播放索引
  const currentIndex = ref<number>(-1)
  // 播放状态
  const playState = ref<'playing' | 'paused' | 'stopped'>('stopped')
  // 播放器显示
  const isShowPlayer = ref(false)

  // 当前歌曲
  const currentSong = computed(() => playQueue.value[currentIndex.value] || null)

  // 播放指定歌曲（可选：插入到队列/直接播放）
  function play(song: IBilibiliVideoData) {
    const idx = playQueue.value.findIndex(item => item.id === song.id)
    if (idx !== -1) {
      currentIndex.value = idx
    } else {
      playQueue.value.push(song)
      currentIndex.value = playQueue.value.length - 1
    }
    playState.value = 'playing'
    isShowPlayer.value = true
  }

  // 播放队列中的指定索引
  function playByIndex(idx: number) {
    if (idx >= 0 && idx < playQueue.value.length) {
      currentIndex.value = idx
      playState.value = 'playing'
      isShowPlayer.value = true
    }
  }

  // 下一首
  function playNext() {
    if (playQueue.value.length === 0)
      return
    if (currentIndex.value < playQueue.value.length - 1) {
      currentIndex.value++
      playState.value = 'playing'
    }
  }

  // 上一首
  function playPrev() {
    if (playQueue.value.length === 0)
      return
    if (currentIndex.value > 0) {
      currentIndex.value--
      playState.value = 'playing'
    }
  }

  // 暂停
  function pause() {
    playState.value = 'paused'
  }

  // 恢复播放
  function resume() {
    if (currentSong.value)
      playState.value = 'playing'
  }

  // 停止
  function stop() {
    playState.value = 'stopped'
    isShowPlayer.value = false
  }

  // 清空队列
  function clearQueue() {
    playQueue.value = []
    currentIndex.value = -1
    playState.value = 'stopped'
  }

  // 添加到队列但不播放
  function addToQueue(song: IBilibiliVideoData) {
    if (!playQueue.value.find(item => item.id === song.id)) {
      playQueue.value.push(song)
    }
  }

  return {
    playQueue,
    currentIndex,
    currentSong,
    playState,
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
