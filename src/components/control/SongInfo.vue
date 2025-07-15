<script setup lang="ts">
import { FullscreenIcon } from 'lucide-vue-next'
import { NEllipsis, NImage, NSkeleton, NSpace } from 'naive-ui'
import { ref } from 'vue'
import { useSystemStore } from '@/stores/systemStore'

defineProps<{
  data?: ISong
}>()

const systemStore = useSystemStore()

// 用于显示全屏按钮
const isShowOpenFull = ref(false)
</script>

<template>
  <div class="px-3 flex items-center select-none" @dblclick.stop="systemStore.fullScreen = true">
    <div
      class="size-15 mr-2 rounded-lg overflow-hidden cursor-pointer relative"
      @mouseenter="isShowOpenFull = true"
      @mouseleave="isShowOpenFull = false"
      @click="systemStore.fullScreen = true"
    >
      <Transition name="full-fade">
        <div v-if="isShowOpenFull" class="flex-center absolute inset-0 h-full text-white/80 backdrop-blur-2xl rounded-sm">
          <FullscreenIcon class="size-4" />
        </div>
      </Transition>

      <NImage
        :src="data?.pic || ''"
        preview-disabled
        class="size-full"
        lazy
      >
        <template #placeholder>
          <NSkeleton />
        </template>
      </NImage>
    </div>

    <NSpace vertical justify="center">
      <div>
        <NSkeleton v-if="!data" text width="100px" />
        <NEllipsis v-else>
          {{ data?.name }}
        </NEllipsis>
      </div>
      <!--
        <div class="singer-name">
        <NSkeleton v-if="!data.name" text width="80px" />
        <Transition v-else name="fade" mode="out-in">
        <NText v-if="!systemStore.fullScreen && playStore.playState" :key="playStore.playingLyric">
        {{ playStore.playingLyric.trim() || '...' }}
        </NText>
        </Transition>
        </div>
      -->
    </NSpace>
  </div>
</template>
