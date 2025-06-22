<script setup lang="ts">
import { useSystemStore } from '@renderer/stores/systemStore'
import { storeToRefs } from 'pinia'
import Search from './Search.vue'
import WindowControls from './WindowControls.vue'

const systemStore = useSystemStore()
const { siderWidth } = storeToRefs(systemStore)
</script>

<template>
  <header class="relative flex items-center p-0 h-[64px] bg-blue-500/50 app-region-drag">
    <div :style="{ flex: `0 0 ${siderWidth}px` }" class="flex items-center justify-center">
      <img src="../../assets/electron.svg" alt="logo" class="w-10 h-10">
    </div>

    <div class="flex-1 flex items-center">
      <Search class="app-region-no-drag" />
    </div>

    <section class="flex-none w-[164px] flex items-center justify-center">
      <WindowControls class="app-region-no-drag" />
    </section>
  </header>
</template>
