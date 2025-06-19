<script setup lang="ts">
import { onMounted, ref } from 'vue'

const isMaximized = ref(false)

// 窗口控制函数
async function minimizeWindow() {
  await window.api.windowControl.minimize()
}

async function maximizeWindow() {
  isMaximized.value = await window.api.windowControl.maximize()
}

async function closeWindow() {
  await window.api.windowControl.close()
}

// 检查窗口状态
async function checkWindowState() {
  isMaximized.value = await window.api.windowControl.isMaximized()
}

onMounted(() => {
  checkWindowState()
})
</script>

<template>
  <div class="window-controls flex items-center space-x-2">
    <!-- 关闭按钮 -->
    <button
      type="button"
      class="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors duration-200 flex items-center justify-center group"
      title="关闭"
      @click="closeWindow"
    >
      <div class="w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </button>

    <!-- 最小化按钮 -->
    <button
      type="button"
      class="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors duration-200 flex items-center justify-center group"
      title="最小化"
      @click="minimizeWindow"
    >
      <div class="w-1.5 h-0.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </button>

    <!-- 最大化/还原按钮 -->
    <button
      type="button"
      class="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors duration-200 flex items-center justify-center group"
      title="最大化/还原"
      @click="maximizeWindow"
    >
      <div
        class="w-1.5 h-1.5 bg-white rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        :class="isMaximized ? 'rounded-sm' : 'rounded-none'"
      />
    </button>
  </div>
</template>

<style scoped>
.window-controls {
  -webkit-app-region: no-drag;
}
</style>
