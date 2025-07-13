import { BASE_URL_PREFIX } from '@constants/urls'
import { useAppStore } from '@/stores/appStore'
import { request } from '@/utils/request'
import { getWbi } from './wbi'

/**
 * 获取搜索结果
 * @param {string} keyword 关键词
 */
export async function searchKeyword(keyword: string, page = 1, page_size = 20): PromiseData<{
  next: number
  numResults: number
  result: IBilibiliVideoData[]
}> {
  const params = {
    keyword,
    search_type: 'video',
    page,
    page_size,
  }
  const { currentUser } = useAppStore()

  const wbi = await getWbi(params)

  console.log('🚀 ~ searchKeyword ~ currentUser:', currentUser, currentUser.cookie)

  return request({
    url: `${BASE_URL_PREFIX}/x/web-interface/wbi/search/type?${wbi}`,
    method: 'GET',
    headers: {
      cookie: currentUser?.cookie,
    },
  })
}

/**
 * 获取搜索结果
 * @param {string} keyword 关键词
 */
export async function searchSuggestion(keyword: string): Promise<{ result: { tag: ISuggestion[] } }> {
  const { currentUser } = useAppStore()

  return request({
    url: `https://s.search.bilibili.com/main/suggest`,
    method: 'GET',
    params: {
      term: keyword,
    },
    headers: {
      cookie: currentUser?.cookie,
    },
  })
}
