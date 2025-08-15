import type { Ref } from 'vue'
import { ref, unref } from 'vue'
import { searchKeyword } from '@/api/search'

interface IOptions {
  pageSize?: number
  page?: number
}

export function useRequestSearchResults(keyword: Ref<string>, options?: IOptions) {
  const { page = 1, pageSize = 20 } = options || {}

  const data = ref<ISong[]>([])
  const loading = ref(false)
  const total = ref(0)
  const _page = ref(page)
  const _pageSize = ref(pageSize)

  async function run() {
    loading.value = true
    const res = await searchKeyword(unref(keyword), _page.value, _pageSize.value)
    data.value = res.data.result
    total.value = res.data.numResults
    loading.value = false
  }

  return {
    data,
    loading,
    total,
    page: _page,
    pageSize: _pageSize,
    run,
  }
}
