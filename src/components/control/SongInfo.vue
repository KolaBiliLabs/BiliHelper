<script setup lang="ts">
import { NImage, NSpace, NText } from 'naive-ui'
import { ref } from 'vue'
import WithSkeleton from '@/components/global/WithSkeleton.vue'
import TextContainer from '../common/TextContainer.vue'
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
      <div class="flex-1 flex items-center gap-2">
        <WithSkeleton
          :loading
          :width="100"
          :height="16"
          transition-name="left"
        >
          <TextContainer :text="data!.custom?.name || data!.title" :speed="15" />
        </WithSkeleton>

        <WithSkeleton
          :loading="loading && !data"
          :width="16"
          :height="16"
          transition-name="left-sm"
        >
          <Like v-if="data" :data="data" @toggle-like="toggleLike" />
        </WithSkeleton>
      </div>

      <WithSkeleton
        :loading
        :width="50"
        :height="16"
        transition-name="left-sm"
      >
        <NText>  {{ data?.author || '未知' }}</NText>
      </WithSkeleton>
    </NSpace>
  </div>
</template>
