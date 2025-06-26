<script setup lang="ts">
import { ConfigProvider } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { useSystemStore } from '@/stores/systemStore'

defineSlots<{
  default: () => void
}>()

const systemStore = useSystemStore()
const { isDark } = storeToRefs(systemStore)
</script>

<template>
  <ConfigProvider
    :theme="{
      token: {
        colorPrimary: isDark ? '#1e1e1e' : '#ffffff',
        colorBgBase: isDark ? '#141414' : '#ffffff',
      },
    }"
  >
    <slot />
  </ConfigProvider>
</template>
