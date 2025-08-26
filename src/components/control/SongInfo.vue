<script setup lang="ts">
import { NImage, NSpace, NText } from 'naive-ui'
import { ref } from 'vue'
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
  <div class="px-3 flex items-center select-none gap-4">
    <div
      class="flex-none size-15 rounded-lg overflow-hidden"
      @mouseenter="isShowOpenFull = true"
      @mouseleave="isShowOpenFull = false"
      @click="enableFullscreen"
    >
      <Transition name="fade" mode="out-in">
        <NImage
          v-if="data"
          :key="data.id"
          :src="data.pic || ''"
          preview-disabled
          class="size-full"
          lazy
          object-fit="cover"
        />
      </Transition>
    </div>

    <Transition name="left-sm" mode="out-in">
      <NSpace
        v-if="data"
        :key="data.id"
        vertical
        justify="center"
      >
        <div class="flex-1 flex items-center gap-2">
          <TextContainer
            :text="data.custom?.name || data.title"
            :speed="0.8"
            class="max-w-50"
          />
          <Like v-if="data" :data="data" @toggle-like="toggleLike" />
        </div>

        <NText :key="data?.id">
          {{ data.artist || data.author || '未知' }}
        </NText>
      </NSpace>
    </Transition>
  </div>
</template>
