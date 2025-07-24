import { HISTORY_PAGE } from '@constants/pageId'
import { defineStore } from 'pinia'

type Theme = 'light' | 'dark'
interface SystemStore {
  // 当前选中的菜单项 => 歌单id
  selectedMenuKey: string
  siderWidth: number
  themeType: Theme
  // 搜索框是否聚焦
  searchFocus: boolean
  collapsed: boolean
  collapsedWidth: number
  fullScreen: boolean
  currentPage: string

  showPlayer: boolean
  showPlayQueue: boolean
}

export const useSystemStore = defineStore('system', {
  state: (): SystemStore => ({
    selectedMenuKey: HISTORY_PAGE,
    siderWidth: 220,
    themeType: 'dark',
    searchFocus: false,
    collapsed: false,
    collapsedWidth: 64,
    fullScreen: false,
    currentPage: HISTORY_PAGE,
    showPlayer: false,
    showPlayQueue: false,
  }),
  getters: {
    isDark(state) {
      return state.themeType === 'dark'
    },
  },
  actions: {
    toggleTheme() {
      const theme = this.$state.themeType === 'dark' ? 'light' : 'dark'
      this.$state.themeType = theme
      document.documentElement.setAttribute('data-theme', theme)
    },
  },
  persist: {
    key: '__pinia_systemStore',
    storage: localStorage,
  },
})
