<script setup lang="ts">
import { NDivider } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, watch } from 'vue'
import Pagination from '@/components/global/Pagination.vue'
import SongList from '@/components/global/SongList.vue'
import { useRequestSearchResults } from '@/hooks/useRequestSearchResults'
import { usePlayStore } from '@/stores/playStore'
import { useSearchStore } from '@/stores/searchStore'

const searchStore = useSearchStore()
const { currentSearchKeyword } = storeToRefs(searchStore)

const playStore = usePlayStore()

const { data, loading, total, page, pageSize, run } = useRequestSearchResults(currentSearchKeyword, {
  page: 1,
  pageSize: 20,
})

function pageChange(v: number) {
  page.value = v
}

function toggleLike(song: ISong) {
  playStore.toggleLike(song)
}

watch(currentSearchKeyword, () => {
  if (currentSearchKeyword.value) {
    // 请求该 keyword 对应的歌曲
    run()
  }
})

onBeforeUnmount(() => {
  searchStore.clearupSearch()
  console.log('----- searStore 已清理 -----')
})
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
    />

    <!-- 分页 -->
    <Pagination
      :loading
      :page="page"
      :page-size="pageSize"
      :total-count="total"
      @page-change="pageChange"
    />
  </div>
</template>
