<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { useSystemStore } from '@renderer/stores/systemStore'
import { LayoutHeader } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import Search from './Search.vue'

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
  <LayoutHeader :style="headerStyle" class="flex items-center">
    <section
      :style="{
        flex: `0 0 ${siderWidth}px`,
      }"
      class="flex items-center justify-center"
    >
      bili helper
    </section>

    <section class="flex-1 flex items-center ">
      <Search />
    </section>

    <section class="flex-none w-[164px] flex items-center justify-center">
      这是按钮区域
    </section>
  </LayoutHeader>
</template>
