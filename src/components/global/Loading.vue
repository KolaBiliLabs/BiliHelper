<script setup lang="ts">
import { IntersectingCirclesSpinner } from 'epic-spinners'

withDefaults(defineProps<{
  size?: number
  color?: string
}>(), {
  size: 30,
  color: '#ffffff80',
})
</script>

<template>
  <IntersectingCirclesSpinner
    :animation-duration="1200"
    :size
    :color
  />
</template>
