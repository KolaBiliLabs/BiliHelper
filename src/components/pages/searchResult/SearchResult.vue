<script setup lang="ts">
import { NDivider } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import SongList from '@/components/pages/searchResult/SongList.vue'
import { useSearchStore } from '@/stores/searchStore'

const searchStore = useSearchStore()
const { currentSearchKeyword, currentSearchResult } = storeToRefs(searchStore)

const loading = ref(false)

function chooseSong(v) {
  console.log(v)
}
</script>

<template>
  <div>
    <header flex items-center>
      <span mr-8 my-4 text-32>
        {{ currentSearchKeyword }}
      </span>
      <span text-22> 的相关搜索 </span>
    </header>

    <NDivider />

    <!-- 歌曲列表 -->
    <SongList :data="currentSearchResult" :loading="loading" @choose="chooseSong" />
  </div>
</template>
