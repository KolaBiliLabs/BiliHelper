import { useRoute } from 'vue-router'
import type { AppRouteName, AppRouteParams, AppRouteQuery } from '@/types/router'

/**
 * 类型安全的 useRoute hook
 * 提供完整的 TypeScript 类型支持
 */
export function useTypedRoute<T extends AppRouteName = AppRouteName>() {
  const route = useRoute()
  
  return {
    // 路由名称，类型安全
    name: route.name as T,
    
    // 路由参数，根据路由名称提供类型
    params: route.params as T extends keyof AppRouteParams 
      ? AppRouteParams[T] 
      : Record<string, string | string[]>,
    
    // 查询参数，根据路由名称提供类型
    query: route.query as T extends keyof AppRouteQuery 
      ? AppRouteQuery[T] 
      : Record<string, string | string[]>,
    
    // 路由元信息
    meta: route.meta,
    
    // 路径
    path: route.path,
    
    // 完整路径
    fullPath: route.fullPath,
    
    // 哈希
    hash: route.hash,
    
    // 原始路由对象
    route,
  }
}

/**
 * 特定路由的 useRoute hook
 * 使用示例: const route = useHistoryRoute()
 */
export function useHistoryRoute() {
  return useTypedRoute<'History'>()
}

export function useLikedRoute() {
  return useTypedRoute<'Liked'>()
}

export function useSearchResultRoute() {
  return useTypedRoute<'SearchResult'>()
}

export function usePlaylistRoute() {
  return useTypedRoute<'Playlist'>()
}

export function usePluginRoute() {
  return useTypedRoute<'Plugin'>()
}

export function useAudioTrimRoute() {
  return useTypedRoute<'AudioTrim'>()
} 
