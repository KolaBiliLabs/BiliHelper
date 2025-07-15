<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { usePlayStore } from '@/stores/playStore'
import { useSystemStore } from '@/stores/systemStore'
import { formatTime } from '@/utils/dayjs'
import SongList from '../../global/SongList.vue'

const systemStore = useSystemStore()
const { currentPage, showPlayer } = storeToRefs(systemStore)

const playStore = usePlayStore()
const { playlists } = storeToRefs(playStore)

const playList = computed(() => playlists.value.find(v => v.id === currentPage.value)!)

function chooseSong(v) {
  console.log('choose song in Playlist', v)
  playStore.play(v)
  showPlayer.value = true
}
</script>

<template>
  <div>
    <header class="pb-3">
      <h1 class="text-2xl font-bold tracking-wide mb-1">
        {{ playList.name }}
      </h1>
      <template v-if="!playList.isDefault">
        <div class="flex items-center text-sm space-x-2">
          <span class="inline-block">📅</span>
          <span>{{ formatTime(playList.createTime, 'YYYY-MM-DD') }} 创建</span>
        </div>
      </template>
    </header>
    <SongList :data="playList.musics" @choose="chooseSong" />
  </div>
</template>
