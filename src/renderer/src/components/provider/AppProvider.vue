<script setup lang="ts">
import { ConfigProvider } from 'ant-design-vue'

defineSlots<{
  default: () => void
}>()
</script>

<template>
  <ConfigProvider
    :theme="{
      token: {
        colorPrimary: '#1672ff30',
        colorBgBase: '#ffffff30',
      },
    }"
  >
    <slot />
  </ConfigProvider>
</template>
