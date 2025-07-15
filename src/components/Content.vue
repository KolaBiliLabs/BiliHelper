<script setup lang="ts">
import { SEARCH_RESULT_PAGE } from '@constants/pageId'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { usePlayStore } from '@/stores/playStore'
import { useSystemStore } from '@/stores/systemStore'
import Playlist from './pages/playlist/Playlist.vue'
import SearchResult from './pages/searchResult/SearchResult.vue'

const systemStore = useSystemStore()
const { currentPage, showPlayer } = storeToRefs(systemStore)

const playStore = usePlayStore()
const { playlists } = storeToRefs(playStore)

const pagesMap = new Map([
  [SEARCH_RESULT_PAGE, SearchResult],
])

const showComp = computed(() => {
  // id 为歌单的 id
  const allPlayListId = playlists.value.map(item => item.id)

  // 使用歌单 id 匹配当前展示页面的 key 如果匹配上则直接展示歌单列表
  if (allPlayListId.includes(currentPage.value)) {
    return Playlist
  }

  return pagesMap.get(currentPage.value)
})
</script>

<template>
  <div class="p-4 pl-6" :class="{ 'pb-27': showPlayer }">
    <Transition name="router" mode="out-in">
      <component :is="showComp" />
    </Transition>
  </div>
</template>
