<script setup lang="ts">
import { useSystemStore } from '@renderer/stores/systemStore'
import { LayoutSider } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import SiderMenu from './SiderMenu.vue'

const systemStore = useSystemStore()
const { siderWidth } = storeToRefs(systemStore)
</script>

<template>
  <LayoutSider
    :width="siderWidth"
    theme="light"
    class="shadow-md overflow-y-auto custom-scrollbar flex-none"
  >
    <SiderMenu />
  </LayoutSider>
</template>
