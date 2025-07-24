<script setup lang="ts">
import { NButton } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { getUserInfoApi } from '@/api/bilibili'
import LoginModal from '@/components/modals/LoginModal.vue'
import { useLoginModal } from '@/hooks/useLoginModal'
import { useAppStore } from '@/stores/appStore'

const appStore = useAppStore()

const { openModal } = useLoginModal()

const isLogin = ref(true)

function logout() {
  appStore.clearUserInfo()
  isLogin.value = false
}

function login() {
  openModal()
}

// 进入时，获取用户信息
onMounted(async () => {
  const userInfoResponse = await getUserInfoApi()
  if (userInfoResponse.code === -101) {
    isLogin.value = false
    openModal()
  }
})

function handleSuccess() {
  isLogin.value = true
}
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

    <Teleport to="#modals">
      <LoginModal @success="handleSuccess" />
    </Teleport>
  </section>
</template>
