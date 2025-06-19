export interface ListResponse<T = any> {
  currentPage: number
  isFirstPage: boolean
  isLastPage: boolean
  previousPage: number | null
  nextPage: number | null
  pageCount: number // the number of pages is calculated
  totalCount: number // the total number of results is calculated
  records: T[]
}

export interface BackendResponse<T = any> {
  success: boolean
  code: number
  message: string
  data: T
  error: string[] | null
}
