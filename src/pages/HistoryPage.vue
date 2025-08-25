<script setup lang="ts">
import { TimerIcon } from 'lucide-vue-next'
import { NButton, NDivider } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SongList from '@/components/global/SongList.vue'
import { usePlayStore } from '@/stores/playStore'
import { useSystemStore } from '@/stores/systemStore'
import { formatTime } from '@/utils/time'

const route = useRoute()
const systemStore = useSystemStore()
const { showPlayer } = storeToRefs(systemStore)

const playStore = usePlayStore()
const { playlists } = storeToRefs(playStore)

const pageId = computed(() => route.meta.pageId)
const playList = computed(() => playlists.value.find(v => v.id === pageId.value))

/**
 * 切换歌曲的喜欢状态
 */
function toggleLike(song: ISong) {
  playStore.toggleLike(song)
}

/**
 * 播放全部歌曲
 */
function playAll() {
  playStore.playAll(pageId.value!)
  showPlayer.value = true
}
</script>

<template>
  <div>
    <header class="flex justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-wide mb-1">
          {{ playList?.name }}
        </h1>
        <template v-if="playList?.description">
          <div class="text-gray-500 text-sm mt-1">
            {{ playList.description }}
          </div>
        </template>
        <template v-if="!playList?.isDefault">
          <div class="flex items-center text-xs text-gray-400 mt-2 space-x-2">
            <TimerIcon class="size-4" />
            <span>{{ formatTime(playList?.createTime || 0, 'YYYY-MM-DD') }} 创建</span>
          </div>
        </template>
      </div>

      <NButton round tertiary @click="playAll">
        播放全部
      </NButton>
    </header>

    <NDivider />

    <SongList
      :data="playList?.musics || []"
      @toggle-like="toggleLike"
    />
  </div>
</template>
