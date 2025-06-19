<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { useSystemStore } from '@renderer/stores/systemStore'
import { LayoutHeader } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import Search from './Search.vue'
import WindowControls from './WindowControls.vue'

const systemStore = useSystemStore()
const { siderWidth } = storeToRefs(systemStore)

const headerStyle: CSSProperties = {
  padding: 0,
  color: '#fff',
  height: 64,
  backgroundColor: '#7dbcea',
}
</script>

<template>
  <LayoutHeader :style="headerStyle" class="relative flex items-center app-region-drag">
    <div :style="{ flex: `0 0 ${siderWidth}px` }" class="flex items-center justify-center">
      <img src="../../assets/electron.svg" alt="logo" class="w-10 h-10">
    </div>

    <div class="flex-1 flex items-center">
      <Search class="app-region-no-drag" />
    </div>

    <section class="flex-none w-[164px] flex items-center justify-center">
      <WindowControls class="app-region-no-drag" />
    </section>
  </LayoutHeader>
</template>
