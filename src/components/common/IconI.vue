<script setup lang="ts">
interface Props {
  size?: number
  iconName: string
}
withDefaults(defineProps<Props>(), {
  size: 15,
})
</script>

<template>
  <div flex-center>
    <div :class="iconName" :style="{ height: `${size}px`, width: `${size}px` }" />
  </div>
</template>
