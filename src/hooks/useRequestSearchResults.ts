import type { Ref } from 'vue'
import { ref } from 'vue'
import { searchKeyword } from '@/api/search'

interface IOptions {
  pageSize?: number
  page?: number
}

export function useRequestSearchResults(keyword: Ref<string>, options?: IOptions) {
  const { page: _page = 1, pageSize: _pageSize = 20 } = options || {}

  const data = ref<ISong[]>([])
  const loading = ref(false)
  const total = ref(0)
  const page = ref(_page)
  const hasNext = ref(false)
  const pageSize = ref(_pageSize)

  function run(handler?: (v: ISong[]) => ISong[]) {
    const _handler = handler || ((v: ISong[]) => {
      data.value = v
      return v
    })

    return new Promise((resolve) => {
      loading.value = true
      searchKeyword(keyword.value, page.value, pageSize.value).then((res) => {
        console.log('res => ', res)
        const handledData = _handler(res.data.result)

        total.value = res.data.numResults
        // 一般为50页，如果为0 说明是最后一页
        hasNext.value = res.data.next !== 0

        resolve(handledData)
      }).finally(() => {
        loading.value = false
      })
    })
  }

  // 加载更多
  async function loadMore() {
    if (!hasNext.value || loading.value) {
      return
    }
    page.value++
    await run((v) => {
      const filteredData = v.filter(item => !data.value.some(d => d.id === item.id))
      data.value = [...data.value, ...filteredData]
      return data.value
    })
  }

  run()

  return {
    data,
    loading,
    total,
    page,
    pageSize,
    run,
    loadMore,
  }
}
