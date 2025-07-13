<!-- 音量 -->
<script setup lang="ts">
import { NPopover, NSlider } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { usePlayStoreWidthOut } from '~/store'
import { setVolume } from '~/utils/play'

const playStore = usePlayStoreWidthOut()
const { volume } = storeToRefs(playStore)

let preVolume = 0
// 切换静音
function handleToggleVolume() {
  if (volume.value === 0) {
    playStore.volume = preVolume
  } else {
    preVolume = volume.value
    playStore.volume = 0
  }
  setVolume(playStore.volume)
}

function handleUpdateVolume(value: number) {
  playStore.volume = value
  setVolume(value)
}
</script>

<template>
  <NPopover trigger="hover">
    <template #trigger>
      <NButton circle secondary @click="handleToggleVolume">
        <IconI :icon-name="volume ? 'i-icomoon-free:volume-medium' : 'i-icomoon-free:volume-mute2'" :size="18" />
      </NButton>
    </template>

    <div class="h100 w-25 flex-col-center">
      <NSlider
        v-model:value="volume"
        :tooltip="false"
        :max="1"
        :step="0.01"
        vertical
        @update-value="handleUpdateVolume"
      />
    </div>

    <div class="mt-5 text-12 flex-center select-none">
      {{ (volume * 100).toFixed(0) }}
    </div>
  </NPopover>
</template>
