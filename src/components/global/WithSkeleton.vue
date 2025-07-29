<script setup lang="ts">
import { NSkeleton } from 'naive-ui'

withDefaults(defineProps<{
  loading: boolean
  width: number
  height: number
  transitionName?: 'fade' | 'up' | 'left' | 'left-sm' | 'full-fade' | 'shrink'
}>(), {
  transitionName: 'fade',
})

defineSlots<{
  default: () => void
}>()
</script>

<template>
  <Transition mode="out-in" name="fade">
    <template v-if="!loading">
      <slot />
    </template>
    <NSkeleton
      v-else
      :height
      :width
      class="size-15"
      round
    />
  </Transition>
</template>
