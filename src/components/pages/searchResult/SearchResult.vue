<script setup lang="ts">
import { NDivider } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, ref, watchEffect } from 'vue'
import { searchKeyword } from '@/api/search'
import Pagination from '@/components/global/Pagination.vue'
import SongList from '@/components/global/SongList.vue'
import { usePlayStore } from '@/stores/playStore'
import { useSearchStore } from '@/stores/searchStore'

const searchStore = useSearchStore()
const { currentSearchKeyword, currentSearchResult } = storeToRefs(searchStore)

const playStore = usePlayStore()

const loading = ref(false)
// 分页相关
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

function pageChange(v: number) {
  currentPage.value = v
}

// 选择歌曲
function chooseSong(song: ISong) {
  playStore.addToHistory(song)
}

watchEffect(() => {
  if (currentSearchKeyword.value) {
    // todo  请求该 keyword 对应的歌单
    loading.value = true
    ;(async () => {
      const res = await searchKeyword(currentSearchKeyword.value, currentPage.value, pageSize.value)
      currentSearchResult.value = res.data.result
      // 假设接口返回 total 字段，否则可根据实际返回结构调整
      total.value = res.data.numResults || 0
      loading.value = false
    })()
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
    <SongList :data="currentSearchResult" :loading="loading" @choose="chooseSong" />

    <!-- 分页 -->
    <Pagination
      :loading
      :page="currentPage"
      :page-size="pageSize"
      :total-count="total"
      @page-change="pageChange"
    />
  </div>
</template>
