<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useSystemStore } from '@/stores/systemStore'
import SearchResult from './pages/searchResult/SearchResult.vue'

const systemStore = useSystemStore()
const { currentPage } = storeToRefs(systemStore)

const pagesMap = new Map([
  ['playList', SearchResult],
  ['searchResult', SearchResult],
])

const showComp = computed(() => pagesMap.get(currentPage.value))
</script>

<template>
  <div class="p-4">
    <component :is="showComp" />
  </div>
</template>
