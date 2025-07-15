<!-- 音量 -->
<script setup lang="ts">
import { Volume, Volume1, Volume2, VolumeOff } from 'lucide-vue-next'
import { NButton, NPopover, NSlider } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { h } from 'vue'
import { usePlayStore } from '@/stores/playStore'

const playStore = usePlayStore()
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
  playStore.setVolume(playStore.volume)
}

function handleUpdateVolume(value: number) {
  playStore.setVolume(value)
}

function VolumeIcon({ volume }: { volume: number }) {
  let _icon = Volume2
  if (volume > 0.5 && volume <= 1) {
    _icon = Volume2
  } else if (volume > 0.15 && volume <= 0.5) {
    _icon = Volume1
  } else if (volume > 0 && volume <= 0.15) {
    _icon = Volume
  } else {
    _icon = VolumeOff
  }

  return h(_icon, { class: 'size-4' })
}
</script>

<template>
  <NPopover trigger="hover">
    <template #trigger>
      <NButton circle secondary @click="handleToggleVolume">
        <VolumeIcon :volume="volume" />
      </NButton>
    </template>

    <div class="h-25 w-5 flex-col-center">
      <NSlider
        :value="volume"
        :tooltip="false"
        :max="1"
        :step="0.01"
        vertical
        @update:value="handleUpdateVolume"
      />
    </div>

    <div class="mt-2 text-xs flex-center select-none">
      {{ (volume * 100).toFixed(0) }}
    </div>
  </NPopover>
</template>
