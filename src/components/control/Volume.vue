<!-- 音量 -->
<script setup lang="ts">
import { Volume, Volume1, Volume2, VolumeOff } from 'lucide-vue-next'
import { NButton, NPopover, NSlider } from 'naive-ui'
import { h } from 'vue'

const volume = defineModel<number>('volume', { required: true })

const emit = defineEmits<{
  (e: 'toggleMute'): void
  (e: 'change', volume: number): void
}>()

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

function dragEnd() {
  emit('change', volume.value)
}
</script>

<template>
  <NPopover trigger="hover">
    <template #trigger>
      <NButton circle secondary @click="$emit('toggleMute')">
        <VolumeIcon :volume="volume" />
      </NButton>
    </template>

    <div class="h-25 w-5 flex-col-center">
      <NSlider
        v-model:value="volume"
        :tooltip="false"
        :max="1"
        :step="0.01"
        vertical
        @dragend="() => dragEnd()"
      />
    </div>

    <div class="mt-2 text-xs flex-center select-none">
      {{ (volume * 100).toFixed(0) }}
    </div>
  </NPopover>
</template>
