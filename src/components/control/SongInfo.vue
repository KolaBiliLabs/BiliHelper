<script setup lang="ts">
import { NImage, NMarquee, NSpace, NText } from 'naive-ui'
import { ref } from 'vue'
import WithSkeleton from '@/components/global/WithSkeleton.vue'
import Like from '../global/Like.vue'

defineProps<{
  data?: ISong
  loading: boolean
}>()

const emit = defineEmits<{
  toggleLike: [song: ISong]
}>()

// 用于显示全屏按钮
const isShowOpenFull = ref(false)

function enableFullscreen() {
  console.log('enable fullscreen')
  // systemStore.fullScreen = true
}

function toggleLike(song: ISong) {
  emit('toggleLike', song)
}
</script>

<template>
  <div class="px-3 flex items-center select-none">
    <div
      class="flex-none size-15 mr-2 rounded-lg overflow-hidden"
      @mouseenter="isShowOpenFull = true"
      @mouseleave="isShowOpenFull = false"
      @click="enableFullscreen"
    >
      <WithSkeleton :loading :width="60" :height="60">
        <NImage
          :src="data?.pic || ''"
          preview-disabled
          class="size-full"
          lazy
          object-fit="cover"
        />
      </WithSkeleton>
    </div>

    <NSpace vertical justify="center">
      <div class="flex items-center gap-2">
        <WithSkeleton
          :loading
          :width="100"
          :height="16"
          transition-name="left"
        >
          <NMarquee>
            <div><span v-html="data?.title" /></div>
          </NMarquee>
        </WithSkeleton>

        <WithSkeleton
          :loading
          :width="16"
          :height="16"
          transition-name="left-sm"
        >
          <Like :data="data!" @toggle-like="toggleLike" />
        </WithSkeleton>
      </div>

      <WithSkeleton
        :loading
        :width="50"
        :height="16"
        transition-name="left-sm"
      >
        <NText>  {{ data?.author }}</NText>
      </WithSkeleton>
    </NSpace>
  </div>
</template>
