<script setup lang="ts">
import { HeartIcon } from 'lucide-vue-next'
import { NPopover } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { usePlayStore } from '@/stores/playStore'
import { isInList } from '@/utils/helper'

const { data } = defineProps<{
  data: ISong
}>()

const emit = defineEmits<{
  toggleLike: [song: ISong]
}>()

const playStore = usePlayStore()
const { liked } = storeToRefs(playStore)

function isLicked() {
  return isInList(liked.value, data) !== -1
}

function toggleLike() {
  emit('toggleLike', data)
}
</script>

<template>
  <div
    class="transition-all duration-300 cursor-pointer"
    @dblclick.stop
    @click="toggleLike"
  >
    <NPopover>
      <template #trigger>
        <HeartIcon :class="[{ 'fill-red-500': isLicked() }]" class="num-transition hover:fill-red-500 hover:scale-110" />
      </template>

      添加/移除 我喜欢的歌曲
    </NPopover>
  </div>
</template>
