<script setup lang="ts">
import type { ButtonSlots } from 'naive-ui'
import { NButton } from 'naive-ui'
import { h, ref, useAttrs, useSlots } from 'vue'

interface ExposedButtonType extends InstanceType<typeof NButton> {}

defineSlots<ButtonSlots>()
const nButtonRef = ref<InstanceType<typeof NButton>>()

const slots = useSlots()
const attrs = useAttrs()

defineExpose<ExposedButtonType>(new Proxy({}, {
  get(_, key) {
    return nButtonRef.value?.[key]
  },
  has(_, key) {
    return !!nButtonRef.value && key in nButtonRef.value
  },
}) as ExposedButtonType)
</script>

<template>
  <component
    :is="h(NButton, {
      ref: 'nButtonRef',
      style: `width: ${attrs.width ?? 38}px; height: ${attrs.height ?? 38}px; padding: 8px; ${attrs.style}`,
      class: `${attrs.class}`,
      quaternary: true,
      ...attrs,
    }, slots)"
  />
</template>
