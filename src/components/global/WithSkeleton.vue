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
  default: () => any
}>()
</script>

<template>
  <Transition mode="out-in" name="fade">
    <div v-if="loading">
      <NSkeleton
        :height
        :width
        class="size-15"
        round
        animated
      />
    </div>
    <template v-else>
      <slot name="default" />
    </template>
  </Transition>
</template>
