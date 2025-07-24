<script setup lang="ts">
import { SlashIcon, SquareIcon, XIcon } from 'lucide-vue-next'
import { NButton } from 'naive-ui'
import { winClose, winMax, winMin } from '@/utils/ipcMainEvent'

function close() {
  winClose()
}

function min() {
  winMin()
}

function max() {
  winMax()
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
