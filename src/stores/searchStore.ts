import { defineStore } from 'pinia'
import { ref, watchEffect } from 'vue'
import { searchKeyword } from '@/api/search'

export const useSearchStore = defineStore('search', () => {
  const currentSearchKeyword = ref('')
  const currentSearchResult = ref<IBilibiliVideoData[]>([])

  const loading = ref(false)

  watchEffect(() => {
    if (currentSearchKeyword.value) {
      // todo  请求该 keyword 对应的歌单

      ;(async () => {
        const res = await searchKeyword(currentSearchKeyword.value)
        console.log(res.data.result)

        currentSearchResult.value = res.data.result
      })()
    }
  })

  function clearupSearch() {
    currentSearchKeyword.value = ''
    currentSearchResult.value.length = 0
  }

  return {
    currentSearchKeyword,
    currentSearchResult,
    loading,
    clearupSearch,
  }
}, {
  persist: {
    key: '__pinia_search',
    storage: localStorage,
  },
})
