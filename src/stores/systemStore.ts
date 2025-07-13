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
}

export const useSystemStore = defineStore('systemStore', {
  state: (): SystemStore => ({
    selectedMenuKey: 'history',
    siderWidth: 220,
    themeType: 'dark',
    searchFocus: false,
    collapsed: false,
    collapsedWidth: 64,
    fullScreen: false,
    currentPage: 'playList',
  }),
  getters: {
    isDark(state) {
      return state.themeType === 'dark'
    },
  },
  persist: {
    key: '__pinia_systemStore',
    storage: localStorage,
  },
})
