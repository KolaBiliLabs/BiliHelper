<script setup lang="ts">
import { Button, message } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { getUserInfoApi } from '@/api/bilibili'
import { useAppStore } from '@/stores/appStore'

const isLogin = ref(true)

const appStore = useAppStore()
const { currentUser } = storeToRefs(appStore)

function logout() {
  isLogin.value = false
}

// 进入时，获取用户信息
onMounted(async () => {
  const userInfoResponse = await getUserInfoApi()
  console.log('🚀 ~ onMounted ~ userInfo:', userInfoResponse)
  const { code, data, message } = userInfoResponse

  handleGetUserInfoResponse(code, message)
})

// 处理获取用户信息的响应
function handleGetUserInfoResponse(code: number, msg: string) {
  switch (code) {
    case -101: {
      // -101 代表未登录，弹出提示信息
      message.info(msg)

      // todo: 准备一个弹框，来提供登录的途径

      break
    }
    default: {
      // 其它情况暂不处理
      break
    }
  }
}
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
  </section>
</template>
