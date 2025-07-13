import { BASE_URL_PREFIX } from '@constants/urls'
import { useAppStore } from '@/stores/appStore'
import { request } from '@/utils/request'
import { getWbi } from './wbi'

/**
 * 获取搜索结果
 * @param {string} keyword 关键词
 */
export async function searchKeyword(keyword: string) {
  const params = {
    keyword,
    search_type: 'video',
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
