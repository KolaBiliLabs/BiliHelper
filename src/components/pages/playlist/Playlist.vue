<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { usePlaylistStore } from '@/stores/playlistStore'
import { useSystemStore } from '@/stores/systemStore'
import { formatTime } from '@/utils/dayjs'
import SongList from '../searchResult/SongList.vue'

const systemStore = useSystemStore()
const { currentPage } = storeToRefs(systemStore)

const playlistStore = usePlaylistStore()
const { playlists } = storeToRefs(playlistStore)

const playList = computed(() => playlists.value.find(v => v.id === currentPage.value)!)

function chooseSong(v) {
  console.log('choose song in Playlist', v)
}
</script>

<template>
  <div>
    <header class="space-y-1">
      <h1>{{ playList.name }}</h1>
      <template v-if="!playList.isDefault">
        {{ formatTime(playList.createTime, 'YYYY-MM-DD') }} 创建
      </template>
    </header>
    <SongList :data="playList.musics" @choose="chooseSong" />
  </div>
</template>
