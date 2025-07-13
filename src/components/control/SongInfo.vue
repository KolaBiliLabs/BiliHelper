<script setup lang="ts">
import { NEllipsis, NImage, NSkeleton, NSpace, NText } from 'naive-ui'
import { ref } from 'vue'
import { useSystemStore } from '@/stores/systemStore'
import IconI from '../common/IconI.vue'

interface Props {
  data: IBilibiliVideoData
}

defineProps<Props>()

const systemStore = useSystemStore()
const playStore = usePlayStoreWidthOut()

// 用于显示全屏按钮
const isShowOpenFull = ref(false)
</script>

<template>
  <div class="info" select-none @dblclick.stop="systemStore.fullScreen = true">
    <div
      class="info-cover"
      h-full
      @mouseenter="isShowOpenFull = true"
      @mouseleave="isShowOpenFull = false"
      @click="systemStore.fullScreen = true"
    >
      <Transition name="full-fade">
        <div v-if="isShowOpenFull" class="full-mask" flex-center>
          <IconI icon-name="i-mingcute:fullscreen-2-fill" :size="32" />
        </div>
      </Transition>

      <NImage
        :src="data?.pic"
        preview-disabled
        w-full
        h-full
        lazy
      >
        <template #placeholder>
          <NSkeleton />
        </template>
      </NImage>
    </div>

    <NSpace vertical justify="center">
      <div class="song-name">
        <NSkeleton v-if="!data.author" text width="100px" />
        <NEllipsis v-else>
          {{ data?.title }}
        </NEllipsis>
      </div>
      <div class="singer-name">
        <NSkeleton v-if="!data.title" text width="80px" />
        <Transition v-else name="fade" mode="out-in">
          <NText v-if="!systemStore.fullScreen && playStore.playState" :key="playStore.playingLyric">
            {{ playStore.playingLyric.trim() || '...' }}
          </NText>

          <NText v-else>
            {{ data?.tag }}
          </NText>
        </Transition>
      </div>
    </NSpace>
  </div>
</template>

<style scoped lang="scss">
/* 歌曲信息 */
.info {
  padding: 0 10px;
  display: flex;
  align-items: center;

  .info-cover {
    @mixin sizeFull() {
      width: 100%;
      height: 100%;
    }
    width: 60px;
    height: 60px;
    margin-right: 10px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    position: relative;

    .full-mask {
      position: absolute;
      inset: 0;
      height: 100%;
      color: #ffffff80;
      backdrop-filter: blur(10px);
      border-radius: 4px;
    }

    img {
      @include sizeFull();
      object-fit: cover;
    }

    .placeholder {
      @include sizeFull();
      background-color: #eee;
    }
  }

  .song-name {
    font-size: 14px;
    font-weight: bold;
    line-height: 1.5;
  }

  .singer-name {
    font-size: 12px;
    color: #999;
    line-height: 1.5;
  }
}

// full-fade
.full-fade-enter-active,
.full-fade-leave-active {
  transition: all 0.2s ease;
}

.full-fade-enter-from,
.full-fade-leave-to {
  opacity: 0;
  transform: scale(0.85);
}
</style>
