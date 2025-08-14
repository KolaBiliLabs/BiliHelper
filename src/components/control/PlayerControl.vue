<script setup lang="ts">
// [ ] 进度条防抖 => 触发阶段修改为为 player 设置，ui阶段无防抖

import { CatIcon, ChevronLeftIcon, ChevronRightIcon, ListIcon, PauseIcon, PlayIcon } from 'lucide-vue-next'
import { NButton, NCard, NSlider } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { usePlayStore } from '@/stores/playStore'
import { useSystemStore } from '@/stores/systemStore'
import Loading from '../global/Loading.vue'
import WithSkeleton from '../global/WithSkeleton.vue'
import SongInfo from './SongInfo.vue'
import Volume from './Volume.vue'

const systemStore = useSystemStore()
const { showPlayer, showPlayQueue } = storeToRefs(systemStore)
const playStore = usePlayStore()
const { isPlaying, currentSong, currentTime, duration, loading } = storeToRefs(playStore)

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
  showPlayQueue.value = true
}

// 播放上一首/下一首
function handlePlayAdjacentOne(type: 'prev' | 'next') {
  type === 'prev' ? playStore.playPrev() : playStore.playNext()
}
// 播放/暂停按钮点击
function handlePlayOrPause() {
  if (!currentSong.value) {
    return
  }

  playStore.pauseOrResume()
}

// 用于格式化当前时间戳
function formatSongTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

/**
 * 切换喜欢
 */
function toggleLike(song: ISong) {
  if (!song) {
    return
  }
  playStore.toggleLike(song)
}
</script>

<template>
  <NCard
    class="control-wrap"
    :class="[{ show: showPlayer && currentSong }]"
    :content-style="{
      padding: 0,
    }"
  >
    <!-- 进度条 -->
    <NSlider
      v-if="showPlayer && currentSong"
      :disabled="loading"
      :value="currentTime"
      :max="duration"
      :format-tooltip=" formatSongTime"
      @update:value="handleUpdateCurrentTime"
    >
      <template #thumb>
        <CatIcon class="size-4 fill-blue-200 scale-3d hover:scale-115 transition duration-300" />
      </template>
    </NSlider>

    <div class="grid grid-cols-3 items-center h-full gap-2.5">
      <!-- 歌曲信息 -->
      <SongInfo :data="currentSong" :loading @toggle-like="toggleLike" />

      <!-- 播放器 -->
      <div class="flex-center h-full gap-3">
        <NButton
          tertiary
          circle
          :disabled="loading"
          @click="handlePlayAdjacentOne('prev')"
        >
          <template #icon>
            <ChevronLeftIcon class="size-4" />
          </template>
        </NButton>
        <NButton
          circle
          secondary
          size="large"
          :disabled="loading"
          @click="handlePlayOrPause"
        >
          <Transition name="fade" mode="out-in">
            <template v-if="loading">
              <Loading :size="30" />
            </template>
            <component :is="isPlaying ? PauseIcon : PlayIcon" v-else class="size-5" />
          </Transition>
        </NButton>
        <NButton
          size="small"
          circle
          tertiary
          :disabled="loading"
          @click="handlePlayAdjacentOne('next')"
        >
          <template #icon>
            <ChevronRightIcon class="size-4" />
          </template>
        </NButton>
      </div>

      <!-- 菜单 -->
      <div class="px-2 flex items-center justify-end h-full gap-3">
        <!-- 歌曲进度 -->
        <WithSkeleton :loading :width="110" :height="25">
          <div class="text-gray-400 flex-center select-none space-x-1">
            <span>{{ formatSongTime(currentTime) }}</span>
            <span>/</span>
            <span>{{ formatSongTime(duration) }}</span>
          </div>
        </WithSkeleton>

        <!-- 音量调节 -->
        <Volume />

        <!-- 播放列表 -->
        <NButton
          circle
          secondary
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
  border-top-left-radius: 0;
  border-top-right-radius: 0;

  .n-slider {
    position: absolute;
    top: -10px;
  }
}
</style>
