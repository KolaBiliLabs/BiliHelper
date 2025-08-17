import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { HISTORY_PAGE, LIKED_PAGE, PLUGIN_PAGE, SEARCH_RESULT_PAGE } from '@constants/pageId'
import { createRouter, createWebHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: `/${HISTORY_PAGE}`,
  },
  {
    path: `/${HISTORY_PAGE}`,
    name: 'History',
    component: () => import('@/pages/HistoryPage.vue'),
    meta: {
      title: '播放历史',
      pageId: HISTORY_PAGE,
      transition: 'slide',
    },
  },
  {
    path: `/${LIKED_PAGE}`,
    name: 'Liked',
    component: () => import('@/pages/LikePage.vue'),
    meta: {
      title: '我喜欢的音乐',
      pageId: LIKED_PAGE,
      transition: 'slide',
    },
  },
  {
    path: `/${PLUGIN_PAGE}`,
    name: 'Plugin',
    component: () => import('@/pages/PluginPage.vue'),
    meta: {
      title: '插件导入',
      pageId: PLUGIN_PAGE,
      transition: 'slide',
    },
  },
  {
    path: `/${SEARCH_RESULT_PAGE}`,
    name: 'SearchResult',
    component: () => import('@/pages/SearchResultPage.vue'),
    meta: {
      title: '搜索结果',
      pageId: SEARCH_RESULT_PAGE,
      transition: 'fade',
    },
  },
  {
    path: '/playlist/:id',
    name: 'Playlist',
    component: () => import('@/components/pages/playlist/Playlist.vue'),
    meta: {
      title: '歌单',
      transition: 'scale',
    },
  },
  {
    path: '/audio-trim',
    name: 'AudioTrim',
    component: () => import('@/pages/AudioTrimPage.vue'),
    meta: {
      title: '音频裁剪',
      transition: 'scale',
    },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 如果是歌单页面，检查歌单是否存在
  if (to.name === 'Playlist' && to.params.id) {
    // 这里可以添加歌单存在性检查逻辑
    // 如果歌单不存在，可以重定向到历史页面
    next()
  } else {
    next()
  }
})

/**
 * 设置路由
 * @param app 应用实例
 */
export function setupRouter(app: App) {
  app.use(router)
}
