<script setup lang="ts">
import { ConfigProvider } from 'ant-design-vue'

defineSlots<{
  default: () => void
}>()
</script>

<template>
  <ConfigProvider>
    <slot />
  </ConfigProvider>
</template>

<style scoped>

</style>
