import { request } from '@/utils/request'

export function requestSearch(keyword: string) {
  return request.get('/', {
    params: {
      keyword,
    },
  })
}
