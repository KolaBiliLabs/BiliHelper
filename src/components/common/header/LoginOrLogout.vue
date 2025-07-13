<script setup lang="ts">
import { NButton, NModal } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { getUserInfoApi } from '@/api/bilibili'
import Qrcode from '@/components/Qrcode.vue'
import { useLoginModal } from '@/hooks/useLoginModal'
import { useAppStore } from '@/stores/appStore'

const isLogin = ref(true)

const appStore = useAppStore()
const { currentUser } = storeToRefs(appStore)

console.log(currentUser.value)

const { isShowModal, openModal, closeModal } = useLoginModal()

function logout() {
  isLogin.value = false
}

// 进入时，获取用户信息
onMounted(async () => {
  const userInfoResponse = await getUserInfoApi()
  if (userInfoResponse.code === -101) {
    openModal()
  }
})
</script>

<template>
  <section class="app-region-no-drag">
    <template v-if="isLogin">
      <NButton
        shape="round"
        type="primary"
        @click="logout"
      >
        logout
      </NButton>
    </template>
    <template v-else>
      <NButton
        shape="round"
        type="primary"
        @click="logout"
      >
        logout
      </NButton>
    </template>

    <NModal
      v-model:open="isShowModal"
      :mask-closable="false"
      :closable="false"
      width="200px"
    >
      <div class="text-center text-slate-500">
        使用 bilibili 客户端扫码
      </div>
      <Qrcode class="mt-2" @success="closeModal" />
      <div class="flex-center mt-2">
        <NButton class="w-20" type="primary" @click="closeModal">
          x
        </NButton>
      </div>
    </NModal>
  </section>
</template>
