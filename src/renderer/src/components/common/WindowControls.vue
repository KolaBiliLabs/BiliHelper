<script setup lang="ts">
import {
  winClose,
  winMax,
  winMin,
} from '@renderer/utils/ipcMainEvent'
</script>

<template>
  <div class="flex items-center space-x-2">
    <!-- 最小化按钮 -->
    <button
      type="button"
      class="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors duration-200 flex items-center justify-center group"
      title="最小化"
      @click="winMin"
    >
      <div class="w-1.5 h-0.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </button>

    <!-- 最大化/还原按钮 -->
    <button
      type="button"
      class="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors duration-200 flex items-center justify-center group"
      title="最大化/还原"
      @click="winMax"
    >
      <div
        class="w-1.5 h-1.5 bg-white rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      />
    </button>

    <!-- 关闭按钮 -->
    <button
      type="button"
      class="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors duration-200 flex items-center justify-center group"
      title="关闭"
      @click="winClose"
    >
      <div class="w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </button>
  </div>
</template>
