<script setup lang="ts">
import { Music2Icon, Pause, Play } from 'lucide-vue-next'
import { NCard, NText } from 'naive-ui'
import { storeToRefs } from 'pinia'
import Loading from '@/components/global/Loading.vue'
import { usePlayStore } from '@/stores/playStore'
import { handleThumb } from '@/utils/core'
import Like from '../global/Like.vue'

const props = defineProps<{
  data: ISong
  index: number
}>()

const emit = defineEmits<{
  toggleLike: [bvid: ISong]
}>()

const playStore = usePlayStore()
const { currentSong, isPlaying, loading } = storeToRefs(playStore)

function toggleLike() {
  emit('toggleLike', props.data)
}
</script>

<template>
  <NCard
    hoverable
    select-none
    :class="{ active: currentSong?.bvid === data.bvid }"
  >
    <div v-auto-animate class="flex items-center h-full gap-2 w-full group">
      <!-- 提示信息 -->
      <div class="w-10 flex-center">
        <Transition name="fade" mode="out-in">
          <Loading v-if="loading && currentSong?.bvid === data.bvid" :size="20" />
          <div v-else class="relative flex-center" @dblclick.stop>
            <NText v-if="currentSong?.bvid !== data.bvid" depth="3" class="num-transition group-hover:opacity-0">
              {{ index + 1 }}
            </NText>
            <Music2Icon v-else class="num-transition size-4 group-hover:opacity-0" />
            <!-- 播放暂停 -->
            <component
              :is="isPlaying ? Pause : Play "
              class="num-transition size-6 absolute opacity-0 scale-75 active:opacity-60 group-hover:opacity-0"
              :class="{ 'group-hover:opacity-100': currentSong?.bvid === data.bvid }"
              @click="playStore.pauseOrResume"
              @dblclick.stop
            />
            <!-- 播放 -->
            <Music2Icon
              class="num-transition size-5 absolute opacity-0 scale-75 active:opacity-60 group-hover:opacity-100"
              :class="{ 'group-hover:hidden': currentSong?.bvid === data.bvid }"
              @click="playStore.play(data)"
            />
          </div>
        </Transition>
      </div>

      <!-- 头像 -->
      <div class="flex-none size-14 rounded-md overflow-hidden flex-center">
        <img :src="handleThumb(data.pic)" :alt="data.bvid" class="size-full object-cover">
      </div>

      <!-- 介绍 -->
      <div class="flex-1 flex justify-center flex-col pr-4">
        <div class="flex flex-col justify-center">
          <NText class="text-ellipsis" v-html="data.title" />
          <NText depth="3" class="text-slate-200">
            {{ data.author }}
          </NText>
        </div>
      </div>

      <Like class="flex-none mr-4" :data @toggle-like="toggleLike" />

      <NText class="text-xs w-15 flex-none">
        {{ data.duration }}
      </NText>
    </div>
  </NCard>
</template>

<style scoped>
.num-transition {
  @apply transition-all duration-300;
}
</style>
