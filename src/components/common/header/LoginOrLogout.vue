<script setup lang="ts">
import { NButton } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { getUserInfoApi } from '@/api/bilibili'
import { useLoginModal } from '@/hooks/useLoginModal'
import { useAppStore } from '@/stores/appStore'

const appStore = useAppStore()
const { currentUser } = storeToRefs(appStore)

console.log('currentUser.value => ', currentUser.value)

const { isShowModal, openModal } = useLoginModal()

const isLogin = ref(true)

function logout() {
  isLogin.value = false
}

function login() {
  isLogin.value = true
}

// 进入时，获取用户信息
onMounted(async () => {
  const userInfoResponse = await getUserInfoApi()
  if (userInfoResponse.code === -101) {
    console.log('userInfoResponse', userInfoResponse)
    openModal()
    console.log('should open modal', isShowModal.value)
  }
})
</script>

<template>
  <section class="app-region-no-drag px-3">
    <NButton
      v-if="!isLogin"
      shape="round"
      type="primary"
      @click="login"
    >
      login
    </NButton>
    <NButton
      v-else
      shape="round"
      type="primary"
      @click="logout"
    >
      logout
    </NButton>
  </section>
</template>
