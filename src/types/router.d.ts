import type { RouteLocationNormalized } from 'vue-router'

// 扩展 Vue Router 的 RouteMeta 接口
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    pageId?: string
    transition?: 'slide' | 'fade' | 'scale'
    requiresAuth?: boolean
    keepAlive?: boolean
  }
}

// 路由名称联合类型
export type AppRouteName
  = | 'History'
    | 'Liked'
    | 'Plugin'
    | 'SearchResult'
    | 'Playlist'
    | 'AudioTrim'

// 路由参数类型定义
export interface AppRouteParams {
  Playlist: {
    id: string
  }
  // 可以继续添加其他路由的参数类型
}

// 路由查询参数类型定义
export interface AppRouteQuery {
  SearchResult: {
    keyword?: string
    page?: string
    type?: string
  }
  Playlist: {
    name?: string
    sort?: string
  }
  History: {
    page?: string
    filter?: string
  }
  Liked: {
    page?: string
    sort?: string
  }
}

// 页面 ID 类型
export type PageId
= | 'history'
  | 'liked'
  | 'fromPlugin'
  | 'searchResult'
  | 'playlist'
  | 'audioTrim'

// 过渡动画类型
export type TransitionType = 'slide' | 'fade' | 'scale'

// 扩展 useRoute 的返回类型
export interface AppRouteLocationNormalized extends RouteLocationNormalized {
  meta: {
    title?: string
    pageId?: PageId
    transition?: TransitionType
    requiresAuth?: boolean
    keepAlive?: boolean
  }
}
