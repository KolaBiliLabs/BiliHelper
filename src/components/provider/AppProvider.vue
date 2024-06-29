<script setup lang="ts">
import { ConfigProvider, theme } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { storeToRefs } from 'pinia'
import { computed, watch } from 'vue'
import { useSystemStore } from '@/stores/systemStore'

defineSlots<{
  default: () => void
}>()

const systemStore = useSystemStore()
const { isDark } = storeToRefs(systemStore)

const themeToken = computed(() => {
  return isDark.value
    ? {
        colorPrimary: '#bd93f9', // 主色
        colorPrimaryText: '#fcf6f7', // 主色内容色
        colorSuccess: '#51fa7b', // 成功色
        colorWarning: '#f1fa8c', // 警告色
        colorError: '#ff5555', // 错误色
        colorInfo: '#8be9fd', // 信息色
        colorBgBase: '#282a36', // 背景色（Dracula 默认背景）
        colorTextBase: '#f8f8f2', // 主要文本色（Dracula 默认前景）
        borderRadius: 8, // 圆角
        wireframe: true, // 线框风格
      }
    : {
        colorPrimary: '#463aa2', // daisyUI primary
        colorPrimaryText: '#394e6a', // daisyUI primary-content
        colorSuccess: '#36d399', // daisyUI success
        colorWarning: '#fbbd23', // daisyUI warning
        colorError: '#f87272', // daisyUI error
        colorInfo: '#3abff8', // daisyUI info
        colorBgBase: '#ffffff', // daisyUI base-100
        colorTextBase: '#1f2937', // daisyUI base-content
      }
})
const customTheme = computed(() => ({
  algorithm: isDark.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: {
    ...themeToken.value,
    borderRadius: 8, // 保持一致
    wireframe: true,
  },
}))

watch(themeToken, (v) => {
  const root = document.documentElement
  Object.entries(v).forEach(([key, value]) => {
    root.style.setProperty(`--cus-v-${key}`, value)
  })
}, { immediate: true })
</script>

<template>
  <ConfigProvider :locale="zhCN" :theme="customTheme">
    <slot />
  </ConfigProvider>
</template>
