import { searchInstance } from '..'

export function requestSearch(keyword: string) {
  return searchInstance.Get('/', {
    params: {
      keyword,
    },
  })
}
