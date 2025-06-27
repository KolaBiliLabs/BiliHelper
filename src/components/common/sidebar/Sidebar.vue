<script setup lang="ts">
import { LayoutSider } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { useSystemStore } from '@/stores/systemStore'
import Menu from './Menu.vue'

const systemStore = useSystemStore()
const { siderWidth } = storeToRefs(systemStore)
</script>

<template>
  <LayoutSider
    :width="siderWidth"
    theme="light"
    class="h-screen shadow-md flex-none space-y-2 flex flex-col"
    :style="{ width: `${siderWidth}px` }"
  >
    <div class="flex-none flex-center gap-2 h-[64px] app-region-drag">
      <img src="../../../assets/electron.svg" alt="logo" class="size-10 app-region-no-drag hover:scale-105 transition-all duration-300">
      <span class="text-xl font-semibold">
        EBH Music
      </span>
    </div>

    <Menu class="overflow-auto flex-1 custom-scrollbar" />
  </LayoutSider>
</template>
