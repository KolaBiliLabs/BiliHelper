<script setup lang="ts">
import { SEARCH_RESULT_PAGE } from '@constants/pageId'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { usePlaylistStore } from '@/stores/playlistStore'
import { useSystemStore } from '@/stores/systemStore'
import Playlist from './pages/playlist/Playlist.vue'
import SearchResult from './pages/searchResult/SearchResult.vue'

const systemStore = useSystemStore()
const { currentPage } = storeToRefs(systemStore)

const playlistStore = usePlaylistStore()
const { defaultPlaylists, customPlaylists } = storeToRefs(playlistStore)

const pagesMap = new Map([
  [SEARCH_RESULT_PAGE, SearchResult],
])

const showComp = computed(() => {
  // id 为歌单的 id
  const allPlayListId = [...defaultPlaylists.value.map(item => item.id), ...customPlaylists.value.map(item => item.id)]

  // 使用歌单 id 匹配当前展示页面的 key 如果匹配上则直接展示歌单列表
  if (allPlayListId.includes(currentPage.value)) {
    return Playlist
  }

  return pagesMap.get(currentPage.value)
})
</script>

<template>
  <div class="p-4">
    <component :is="showComp" />
  </div>
</template>
