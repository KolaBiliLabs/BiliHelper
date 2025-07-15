<script setup lang="ts">
import { ActivityIcon } from 'lucide-vue-next'
import { NCard, NEmpty, NText } from 'naive-ui'
import { storeToRefs } from 'pinia'
import Loading from '@/components/common/Loading.vue'
import { usePlayStore } from '@/stores/playStore'
import { handleThumb } from '@/utils/core'

interface Props {
  data: ISong[]
  loading?: boolean
  disabledHeader?: boolean
}

withDefaults(defineProps<Props>(), {
  disabledHeader: false,
  loading: false,
})
defineEmits<{
  choose: [song: ISong]
}>()

defineSlots<{
  default: () => void
  header: () => void
}>()

const playStore = usePlayStore()
const { currentSong } = storeToRefs(playStore)
</script>

<template>
  <div v-auto-animate class="min-h-[60vh] space-y-4">
    <!-- 歌曲列表 -->
    <template v-if="!loading">
      <NEmpty
        v-if="!data || !data.length"
        class="w-full h-[50vh] flex-center"
      >
        <NText> 暂无数据 </NText>
      </NEmpty>

      <template v-else>
        <NCard
          v-for="item of data"
          :key="item.bvid"
          hoverable
          select-none
          :class="{ active: currentSong.bvid === item.bvid }"
          @dblclick="$emit('choose', item)"
        >
          <div v-auto-animate class="flex items-center h-full gap-2 w-full">
            <!-- 头像 -->
            <div
              class="flex-none size-14 rounded-md overflow-hidden flex-center"
            >
              <img :src="handleThumb(item.pic)" :alt="item.bvid" class="size-full object-cover">
            </div>

            <!-- 介绍 -->
            <div class="flex-1 flex justify-center flex-col pr-4">
              <div class="flex flex-col justify-center">
                <NText class="text-ellipsis" v-html="item.title" />
                <NText depth="3" class="text-slate-200">
                  {{ item.author }}
                </NText>
              </div>
            </div>

            <NText class="w-15 flex-none">
              {{ item.duration }}
            </NText>

            <!-- playing icon -->
            <div v-if="currentSong.bvid === item.bvid" class="px-4 music-playing-indicator">
              <ActivityIcon class="size-4" />
            </div>
          </div>
        </NCard>
      </template>
    </template>

    <!-- loading -->
    <Loading
      v-else
      :size="80"
      class="w-full h-50vw flex-center"
    />
  </div>
</template>

<style scoped lang="scss">
/* 歌列表 */
.n-card {
  $transition: all 0.3s ease-in-out;

  padding: 8px;
  border: 1px solid #ffffff40;
  border-radius: 8px;
  cursor: pointer;
  transition: $transition;
  width: 100%;

  &:hover {
    box-shadow: 0 0 8px #ffffff60;
    border-color: #ffffff60;
  }

  &.active {
    border-color: #ffffff80;
    background-color: #ffffff60;
  }

  &:active {
    transform: scale3d(0.993, 0.993, 1);
  }

  :deep(.n-card__content) {
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.music-playing-indicator {
  animation: pulse 1.2s infinite cubic-bezier(0.65, 0.05, 0.36, 1); /* 动画名称、时长、无限循环、缓动函数 */
}

@keyframes pulse {
  0% {
    transform: scale(0.9); /* 缩小到 80% */
  }
  50% {
    transform: scale(1.1); /* 放大到 120% */
  }
  100% {
    transform: scale(0.9); /* 缩小回 80% */
  }
}
</style>
