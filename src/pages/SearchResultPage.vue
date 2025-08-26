<script setup lang="ts">
import { NDivider, NEmpty } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, watch } from 'vue'
import SongList from '@/components/global/SongList.vue'
import { useRequestSearchResults } from '@/hooks/useRequestSearchResults'
import { usePlayStore } from '@/stores/playStore'
import { useSearchStore } from '@/stores/searchStore'

const searchStore = useSearchStore()
const { currentSearchKeyword } = storeToRefs(searchStore)

const playStore = usePlayStore()

const { data, page, loading, run, loadMore } = useRequestSearchResults(currentSearchKeyword, {
  page: 1,
  pageSize: 20,
})

watch(currentSearchKeyword, (v) => {
  if (!v) {
    return
  }
  console.log('search keyword => ', v)
  // 请求该 keyword 对应的歌曲
  page.value = 1
  run()
})

function toggleLike(song: ISong) {
  playStore.toggleLike(song)
}

onBeforeUnmount(() => {
  searchStore.clearupSearch()
  console.log('----- searStore 已清理 -----')
})

function handleLoadMore() {
  loadMore()
}
</script>

<template>
  <div>
    <header>
      <div class="flex items-baseline  gap-2">
        <span class="my-4 text-3xl">
          {{ currentSearchKeyword }}
        </span>
        <span class="text-[22px]"> 的相关搜索 </span>
      </div>

      <NDivider />
    </header>

    <!-- 歌曲列表 -->
    <SongList
      :data="data"
      :loading="loading"
      @toggle-like="toggleLike"
      @load-more="handleLoadMore"
    >
      <template #empty>
        <NEmpty description="没有找到相关结果" />
      </template>
    </SongList>
  </div>
</template>
