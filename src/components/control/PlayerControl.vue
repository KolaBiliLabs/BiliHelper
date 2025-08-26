<script setup lang="ts">
// [ ] 进度条防抖 => 触发阶段修改为为 player 设置，ui阶段无防抖

import { CatIcon, ChevronLeftIcon, ChevronRightIcon, ListIcon, PauseIcon, PlayIcon, Volume1Icon, Volume2Icon, VolumeIcon, VolumeOffIcon } from 'lucide-vue-next'
import { NCard, NPopover, NSlider, NText } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { computed, h } from 'vue'
import { usePlayStore } from '@/stores/playStore'
import { useSystemStore } from '@/stores/systemStore'
import player from '@/utils/player'
import { calculateCurrentTime, secondsToTime } from '@/utils/time'
import ControlButton from './ControlButton.vue'
import SongInfo from './SongInfo.vue'

const systemStore = useSystemStore()
const { showPlayer, showPlayQueue } = storeToRefs(systemStore)
const playStore = usePlayStore()
const { isPlaying, currentSong, currentTime, playDuration, loading, playVolume, playProgress } = storeToRefs(playStore)

// 用于判断是否存在歌曲数据
const haveSongData = computed(() => currentSong.value !== null)

/**
 * 切换喜欢
 */
function toggleLike(song: ISong) {
  if (!song) {
    return
  }
  playStore.toggleLike(song)
}

/**
 * 进度条拖动结束
 */
function sliderDragend() {
  const seek = calculateCurrentTime(playProgress.value, playDuration.value)
  playStore.isPlaying = true
  // 调整进度
  player.setSeek(seek)
  player.play()
}

/**
 * 音量图标
 */
function RenderVolumeIcon({ volume }: { volume: number }) {
  let _icon = Volume2Icon
  if (volume > 0.5 && volume <= 1) {
    _icon = Volume2Icon
  } else if (volume > 0.15 && volume <= 0.5) {
    _icon = Volume1Icon
  } else if (volume > 0 && volume <= 0.15) {
    _icon = VolumeIcon
  } else {
    _icon = VolumeOffIcon
  }

  return h(_icon, { class: 'size-4' })
}
</script>

<template>
  <NCard
    class="control-wrap"
    :class="[{ show: showPlayer }]"
    :content-style="{
      padding: 0,
    }"
  >
    <!-- 进度条 -->
    <div class="slider">
      <NSlider
        v-model:value="playStore.playProgress"
        :step="0.01"
        :min="0"
        :max="100"
        :tooltip="false"
        :keyboard="false"
        :disabled="loading"
        class="player-slider"
        @dragstart="player.pause(false)"
        @dragend="sliderDragend"
      >
        <template #thumb>
          <CatIcon class="size-4 fill-blue-200 scale-3d hover:scale-115 transition duration-300" />
        </template>
      </NSlider>
    </div>

    <div class="grid grid-cols-3 items-center h-full gap-2.5">
      <!-- 歌曲信息 -->
      <SongInfo :data="currentSong" :loading @toggle-like="toggleLike" />

      <!-- 播放器 -->
      <div class="flex-center h-full gap-3">
        <!-- 上一曲 -->
        <ControlButton v-debounce="() => player.nextOrPrev('prev')" circle>
          <template #icon>
            <ChevronLeftIcon />
          </template>
        </ControlButton>

        <!-- 播放/暂停 -->
        <ControlButton
          :loading="loading"
          type="primary"
          strong
          circle
          width="42"
          height="42"
          :quaternary="false"
          @click.stop="() => player.playOrPause()"
        >
          <template #icon>
            <Transition name="fade" mode="out-in">
              <component
                :is="isPlaying ? PauseIcon : PlayIcon"
                :key="playStore.isPlaying"
                class="size-10"
              />
            </transition>
          </template>
        </ControlButton>

        <!-- 下一曲 -->
        <ControlButton v-debounce="() => player.nextOrPrev('next')" circle>
          <template #icon>
            <ChevronRightIcon class="size-4" />
          </template>
        </ControlButton>
      </div>

      <!-- 菜单 -->
      <div class="px-2 flex items-center justify-end h-full gap-2">
        <!-- 歌曲进度 -->
        <Transition name="fade" mode="out-in">
          <div v-if="haveSongData" :key="currentSong.id" class="text-gray-400 flex-center select-none space-x-1 text-xs">
            <span>{{ secondsToTime(currentTime) }}</span>
            <span>/</span>
            <span>{{ secondsToTime(playDuration) }}</span>
          </div>
        </Transition>

        <!-- 音量调节 -->
        <NPopover :show-arrow="false" style="padding: 0px;">
          <template #trigger>
            <ControlButton @click.stop="() => player.toggleMute()" @wheel="(e: any) => player.setVolume(e)">
              <template #icon>
                <RenderVolumeIcon :volume="playVolume" />
              </template>
            </ControlButton>
          </template>
          <div
            class="flex-col-center w-12 h-40 py-2 rounded-3xl"
            @wheel="e => player.setVolume(e)"
          >
            <NSlider
              v-model:value="playVolume"
              :tooltip="false"
              :min="0"
              :max="1"
              :step="0.01"
              vertical
              @update:value="(val) => player.setVolume(val)"
            />
            <NText class="mt-1 text-xs">
              {{ Math.round(playStore.playVolume * 100) }}%
            </NText>
          </div>
        </NPopover>

        <!-- 播放列表 -->
        <ControlButton @click="showPlayQueue = true">
          <template #icon>
            <ListIcon />
          </template>
        </ControlButton>
      </div>
    </div>
  </NCard>
</template>

<style scoped>
.control-wrap {
  --h: 90px;
  position: fixed;
  left: 0;
  right: 0;
  height: var(--h);
  bottom: calc(-1 * (var(--h) + 10px));
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

.slider {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  max-width: 480px;
  font-size: 12px;
  cursor: pointer;
  .n-slider {
    margin: 6px 8px;
    --n-handle-size: 12px;
    --n-rail-height: 4px;
  }
}
</style>
