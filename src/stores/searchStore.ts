import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchStore = defineStore('search', () => {
  const currentSearchKeyword = ref('')
  const currentSearchResult = ref<IBilibiliVideoData[]>([])

  function clearupSearch() {
    currentSearchKeyword.value = ''
    currentSearchResult.value.length = 0
  }

  return {
    currentSearchKeyword,
    currentSearchResult,
    clearupSearch,
  }
}, {
  persist: {
    key: '__pinia_search',
    storage: localStorage,
  },
})
