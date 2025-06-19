<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { useSystemStore } from '@renderer/stores/systemStore'
import { LayoutHeader } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import Search from './Search.vue'
import WindowControls from './WindowControls.vue'

const systemStore = useSystemStore()
const { siderWidth } = storeToRefs(systemStore)

const headerStyle: CSSProperties & { appRegion: 'drag' } = {
  padding: 0,
  color: '#fff',
  height: 64,
  backgroundColor: '#7dbcea',
  appRegion: 'drag',
}
</script>

<template>
  <LayoutHeader :style="headerStyle" class="titleBar flex items-center">
    <div :style="{ flex: `0 0 ${siderWidth}px` }" class="flex items-center justify-center" />

    <div class="flex-1 flex items-center ">
      <Search />
    </div>

    <section class="flex-none w-[164px] flex items-center justify-center">
      <WindowControls />
    </section>
  </LayoutHeader>
</template>

<style scope>
.titleBar {
  height: 120px;
  background-color: #fff;
}
</style>
