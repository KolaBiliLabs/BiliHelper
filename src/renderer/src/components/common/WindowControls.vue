<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  minimizeWindow,
  maximizeWindow,
  closeWindow,
  isWindowMaximized
} from '@/utils/windowControl'

const isMaximized = ref(false)

async function handleMinimize() {
  await minimizeWindow()
}

async function handleMaximize() {
  isMaximized.value = await maximizeWindow()
}

async function handleClose() {
  await closeWindow()
}

async function checkWindowState() {
  isMaximized.value = await isWindowMaximized()
}

onMounted(() => {
  checkWindowState()
})
</script>

<template>
  <div class="flex items-center space-x-2">
    <!-- 关闭按钮 -->
    <button
      type="button"
      class="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors duration-200 flex items-center justify-center group"
      title="关闭"
      @click="handleClose"
    >
      <div class="w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </button>

    <!-- 最小化按钮 -->
    <button
      type="button"
      class="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors duration-200 flex items-center justify-center group"
      title="最小化"
      @click="handleMinimize"
    >
      <div class="w-1.5 h-0.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </button>

    <!-- 最大化/还原按钮 -->
    <button
      type="button"
      class="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors duration-200 flex items-center justify-center group"
      title="最大化/还原"
      @click="handleMaximize"
    >
      <div
        class="w-1.5 h-1.5 bg-white rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        :class="isMaximized ? 'rounded-sm' : 'rounded-none'"
      />
    </button>
  </div>
</template>
