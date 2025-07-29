<script setup lang="ts">
import type { GlobalTheme, GlobalThemeOverrides } from 'naive-ui'
import { darkTheme, NConfigProvider, NDialogProvider, NMessageProvider, NNotificationProvider, useDialog, useMessage, useNotification, zhCN } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { defineComponent, h, ref, watch } from 'vue'
import { useSystemStore } from '@/stores/systemStore'

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

const NaiveContentProvider = defineComponent({
  setup() {
    window.$message = useMessage()
    window.$dialog = useDialog()
    window.$notification = useNotification()

    return () => h('div', { class: 'main-tools' })
  },
})

// 全局主题配置
const themeOverrides: GlobalThemeOverrides = {
  common: {
    borderRadius: '10px',
  },
  Button: {
    // textColor: '#F86',
  },
  Modal: {
    borderRadius: '10px',
  },
  Card: {
    borderRadius: '10px',
  },
}
</script>

<template>
  <NConfigProvider :theme="theme" :theme-overrides="themeOverrides" :locale="zhCN">
    <NNotificationProvider to="#modals" :max="2">
      <NDialogProvider>
        <NMessageProvider :max="1" placement="bottom">
          <slot />
          <NaiveContentProvider />
        </NMessageProvider>
      </NDialogProvider>
    </NNotificationProvider>
  </NConfigProvider>
</template>
