<script setup lang="ts">
import { FulfillingBouncingCircleSpinner } from 'epic-spinners'

interface Props {
  size?: number
}
withDefaults(defineProps<Props>(), {
  size: 30,
})
</script>

<template>
  <div flex-center>
    <FulfillingBouncingCircleSpinner :animation-duration="2000" :size="size" />
  </div>
</template>
