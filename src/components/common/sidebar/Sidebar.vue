<script setup lang="ts">
import { NLayoutSider } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useSystemStore } from '@/stores/systemStore'
import Menu from './Menu.vue'

const systemStore = useSystemStore()
const { siderWidth } = storeToRefs(systemStore)
</script>

<template>
  <NLayoutSider
    :collapsed="systemStore.collapsed"
    :collapsed-width="systemStore.collapsedWidth"
    :native-scrollbar="false"
    :width="siderWidth"
    collapse-mode="width"
    show-trigger="bar"
    bordered
    @collapse="systemStore.collapsed = true"
    @expand="systemStore.collapsed = false"
  >
    <div class="sider-all">
      <Menu />
    </div>
  </NLayoutSider>
</template>
