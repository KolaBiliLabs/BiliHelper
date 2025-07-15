<script setup lang="ts">
import { CatIcon, ChevronLeftIcon, ChevronRightIcon, ListIcon, PauseIcon, PlayIcon } from 'lucide-vue-next'
import { NButton, NCard, NSlider } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { usePlayStore } from '@/stores/playStore'
import { useSystemStore } from '@/stores/systemStore'
import SongInfo from './SongInfo.vue'
import Volume from './Volume.vue'

const systemStore = useSystemStore()
const { showPlayer, showPlaylist } = storeToRefs(systemStore)
const playStore = usePlayStore()
const { isPlaying, currentSong, currentTime, duration } = storeToRefs(playStore)

let seekTimeout: ReturnType<typeof setTimeout> | null = null

// 更新当前时间
function handleUpdateCurrentTime(v: number) {
  if (seekTimeout) {
    clearTimeout(seekTimeout)
  }
  seekTimeout = setTimeout(() => {
    playStore.seek(v)
    console.log('seek v', v)
  }, 200) // 200ms 可根据需要调整
}

// 打开播放列表
function handleOpenPlayList() {
  showPlaylist.value = true
}

// 播放上一首/下一首
function handlePlayAdjacentOne(type: 'prev' | 'next') {
  type === 'prev' ? playStore.playPrev() : playStore.playNext()
}

// 播放/暂停按钮点击
function handlePlayOrPause() {
  if (!currentSong.value)
    return
  if (isPlaying.value) {
    console.log('暂停播放')
    // 暂停播放
    playStore.pause()
  } else {
    playStore.play(currentSong.value)
  }
}

// 用于格式化当前时间戳
function formatSongTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}
</script>

<template>
  <NCard
    class="control-wrap"
    :class="[{ show: showPlayer && !systemStore.fullScreen }]"
    :content-style="{
      padding: 0,
    }"
  >
    <!-- 进度条 -->
    <NSlider
      v-if="showPlayer && !systemStore.fullScreen"
      :value="currentTime"
      :max="duration"
      :format-tooltip=" formatSongTime"
      @update:value="handleUpdateCurrentTime"
    >
      <template #thumb>
        <CatIcon class="size-4 fill-blue-100 scale-3d hover:scale-115 transition duration-300" />
      </template>
    </NSlider>

    <div class="grid grid-cols-3 items-center h-full gap-2.5">
      <!-- 歌曲信息 -->
      <SongInfo :data="currentSong" />

      <!-- 播放器 -->
      <div class="flex-center h-full gap-3">
        <NButton
          tertiary
          size="small"
          circle
          @click="handlePlayAdjacentOne('prev')"
        >
          <ChevronLeftIcon class="size-4" />
        </NButton>
        <NButton
          circle
          secondary
          size="large"
          @click="handlePlayOrPause"
        >
          <component :is="isPlaying ? PauseIcon : PlayIcon" class="size-4" />
        </NButton>
        <NButton
          size="small"
          circle
          tertiary
          @click="handlePlayAdjacentOne('next')"
        >
          <ChevronRightIcon class="size-4" />
        </NButton>
      </div>

      <!-- 菜单 -->
      <div class="px-2 flex items-center justify-end h-full">
        <!-- 歌曲进度 -->
        <div class="text-gray-400 mr-6 flex-center select-none">
          <span class="mx-1">{{ formatSongTime(currentTime) }}</span>
          <span class="mx-1">/</span>
          <span class="mx-1">{{ formatSongTime(duration) }}</span>
        </div>

        <!-- 音量调节 -->
        <Volume />

        <!-- 播放列表 -->
        <NButton
          circle
          secondary
          style="margin-left: 10px"
          @click="handleOpenPlayList"
        >
          <ListIcon class="size-4" />
        </NButton>
      </div>
    </div>
  </NCard>
</template>

<style scoped lang="scss">
.control-wrap {
  $h: 90px;
  position: fixed;
  left: 0;
  right: 0;
  height: $h;
  bottom: -$h;
  z-index: 100;
  transition: bottom 0.3s;

  &.show {
    bottom: 0;
  }
}

.n-card {
  /* position: relative; */

  .n-slider {
    position: absolute;
    top: -10px;
  }
}
</style>
