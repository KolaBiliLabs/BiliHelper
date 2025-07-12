<script setup lang="ts">
import { Button, Modal } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { getUserInfoApi } from '@/api/bilibili'
import Qrcode from '@/components/Qrcode.vue'
import { useLoginModal } from '@/hooks/useLoginModal'
import { useAppStore } from '@/stores/appStore'

const isLogin = ref(true)

const appStore = useAppStore()
const { currentUser } = storeToRefs(appStore)

const { isShowModal, openModal, closeModal } = useLoginModal()

function logout() {
  isLogin.value = false
}

// 进入时，获取用户信息
onMounted(async () => {
  const userInfoResponse = await getUserInfoApi()
})
</script>

<template>
  <section class="app-region-no-darg">
    <template v-if="isLogin">
      <Button
        shape="round"
        type="primary"
        @click="logout"
      >
        logout
      </Button>
    </template>
    <template v-else>
      login
    </template>

    <Modal
      v-model:open="isShowModal"
      :mask-closable="false"
      :closable="false"
      :footer="null"
      width="200px"
    >
      <div class="text-center text-slate-500">
        使用 bilibili 客户端扫码
      </div>
      <Qrcode class="mt-2" @success="closeModal" />
      <div class="flex-center mt-2">
        <Button class="w-20" type="primary" @click="closeModal">
          x
        </Button>
      </div>
    </Modal>
  </section>
</template>
