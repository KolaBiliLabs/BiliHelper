<script setup lang="ts">
import { NImage, NMarquee, NSpace, NText } from 'naive-ui'
import { ref } from 'vue'
import { usePlayStore } from '@/stores/playStore'
import { useSystemStore } from '@/stores/systemStore'
import Like from '../global/Like.vue'

defineProps<{
  data?: ISong
}>()

const systemStore = useSystemStore()
const playStore = usePlayStore()

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
      <div class="flex items-center gap-2">
        <NMarquee v-if="data" :key="data.title">
          <template #default>
            <div v-html="data.title" />
          </template>
        </NMarquee>

        <Transition name="fade" mode="out-in">
          <Like v-if="data" :data @toggle-like="() => data && playStore.toggleLike(data)" />
        </Transition>
      </div>
      <NText>
        {{ data?.author }}
      </NText>
    </NSpace>
  </div>
</template>
