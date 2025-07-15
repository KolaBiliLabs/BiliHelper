import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfoApi } from '@/api/bilibili'

export const useAppStore = defineStore('app', () => {
  // 当前选中的用户
  const currentUser = ref<IUser>({} as IUser)

  // 刷新当前用户信息
  async function refreshCurrentUser() {
    if (!currentUser.value) {
      return
    }

    const { data } = await getUserInfoApi()

    if (!data) {
      return
    }

    const { uname, face } = data
    currentUser.value.face = face
    currentUser.value.uname = uname
  }

  return {
    currentUser,
    refreshCurrentUser,
  }
}, {
  persist: {
    key: '__pinia_appStore',
    storage: localStorage,
  },
})
