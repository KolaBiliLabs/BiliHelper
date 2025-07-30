<script setup lang="ts">
import { WINDOW_CLOSE, WINDOW_MAXIMIZE, WINDOW_MINIMIZE } from '@constants/ipcChannels'
import { SlashIcon, SquareIcon, XIcon } from 'lucide-vue-next'
import { NButton } from 'naive-ui'

function close() {
  window.electron.ipcRenderer.send(WINDOW_CLOSE)
}

function min() {
  window.electron.ipcRenderer.send(WINDOW_MINIMIZE)
}

function max() {
  window.electron.ipcRenderer.send(WINDOW_MAXIMIZE)
}
</script>

<template>
  <div class="mr-4 flex items-center gap-2">
    <NButton
      size="large"
      secondary
      circle
      class="app-region-no-drag"
      @click="min"
    >
      <template #icon>
        <SlashIcon class="size-4" />
      </template>
    </NButton>

    <NButton
      size="large"
      secondary
      circle
      class="app-region-no-drag"
      @click="max"
    >
      <template #icon>
        <SquareIcon class="size-4" />
      </template>
    </NButton>

    <NButton
      size="large"
      secondary
      circle
      class="app-region-no-drag"
      @click="close"
    >
      <template #icon>
        <XIcon class="size-4" />
      </template>
    </NButton>
  </div>
</template>
