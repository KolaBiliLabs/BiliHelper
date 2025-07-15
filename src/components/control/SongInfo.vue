<script setup lang="ts">
import { NImage, NMarquee, NSpace, NText } from 'naive-ui'
import { ref } from 'vue'
import { useSystemStore } from '@/stores/systemStore'

defineProps<{
  data?: ISong
}>()

const systemStore = useSystemStore()

// 用于显示全屏按钮
const isShowOpenFull = ref(false)

function enableFullscreen() {
  console.log('enable fullscreen')
  // systemStore.fullScreen = true
}
</script>

<template>
  <div class="px-3 flex items-center select-none" @dblclick.stop="systemStore.fullScreen = true">
    <div
      class="flex-none size-15 mr-2 rounded-lg overflow-hidden"
      @mouseenter="isShowOpenFull = true"
      @mouseleave="isShowOpenFull = false"
      @click="enableFullscreen"
    >
      <NImage
        :src="data?.pic || ''"
        preview-disabled
        class="size-full"
        lazy
        object-fit="cover"
      />
    </div>

    <NSpace vertical justify="center">
      <NMarquee v-if="data" :key="data.title">
        <div v-html="data.title" />
      </NMarquee>
      <NText>
        {{ data?.author }}
      </NText>
    </NSpace>
  </div>
</template>
