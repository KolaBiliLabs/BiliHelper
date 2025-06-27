import { defineStore } from 'pinia'

interface SystemStore {
  selectedMenuKey: string[]
  siderWidth: number
  theme: 'light' | 'dark'
}

export const useSystemStore = defineStore('systemStore', {
  state: (): SystemStore => ({
    selectedMenuKey: [],
    siderWidth: 220,
    theme: 'light',
  }),
  getters: {
    isDark(state) {
      return state.theme === 'dark'
    },
  },
  persist: {
    key: '__pinia_systemStore',
    storage: localStorage,
  },
})
