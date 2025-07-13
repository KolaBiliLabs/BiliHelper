<script setup lang="ts">
import type { GlobalTheme } from 'naive-ui'
import { darkTheme, NConfigProvider, NDialogProvider, NMessageProvider, NNotificationProvider, zhCN } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useSystemStore } from '@/stores/systemStore'
import { NaiveContentProvider, themeOverrides } from './config'

defineSlots<{
  default: () => void
}>()

const systemStore = useSystemStore()
const { themeType } = storeToRefs(systemStore)

const theme = ref<GlobalTheme | null>(themeType.value === 'dark' ? darkTheme : null)

// 监听主题变化
watch(
  () => themeType.value,
  (v) => {
    theme.value = v === 'dark' ? darkTheme : null
  },
)
</script>

<template>
  <NConfigProvider :theme="theme" :theme-overrides="themeOverrides" :locale="zhCN">
    <NNotificationProvider>
      <NDialogProvider>
        <NMessageProvider :max="1" placement="bottom">
          <slot />
          <NaiveContentProvider />
        </NMessageProvider>
      </NDialogProvider>
    </NNotificationProvider>
  </NConfigProvider>
</template>
