import { searchInstance } from '..'

export function requestSearch(keyword: string) {
  return searchInstance.get('/', {
    params: {
      keyword,
    },
  })
}
