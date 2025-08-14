import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getUserInfoApi } from '@/api/bilibili'

export const useUserStore = defineStore('user', () => {
  // 当前用户
  const currentUser = ref<IUser>({} as IUser)

  const isLogin = computed(() => currentUser.value.cookie)

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

  function clearUserInfo() {
    currentUser.value = {} as IUser
  }

  return {
    currentUser,
    isLogin,
    refreshCurrentUser,
    clearUserInfo,
  }
}, {
  persist: {
    key: '__pinia_userStore',
    storage: localStorage,
  },
})
