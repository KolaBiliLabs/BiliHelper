import { defineStore } from 'pinia'

interface SystemStore {
  selectedMenuKey: string[]
  siderWidth: number
}

export const useSystemStore = defineStore('systemStore', {
  state: (): SystemStore => ({
    selectedMenuKey: [],
    siderWidth: 220,
  }),
  persist: {
    key: '__pinia_systemStore',
    storage: localStorage,
  },
})
