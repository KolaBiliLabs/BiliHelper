<script setup lang="ts">
import { ConfigProvider, theme } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useSystemStore } from '@/stores/systemStore'

defineSlots<{
  default: () => void
}>()

const systemStore = useSystemStore()
const { isDark } = storeToRefs(systemStore)

const antdTheme = computed(() => ({
  algorithm: isDark.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
}))
</script>

<template>
  <ConfigProvider :locale="zhCN" :theme="antdTheme">
    <slot />
  </ConfigProvider>
</template>
