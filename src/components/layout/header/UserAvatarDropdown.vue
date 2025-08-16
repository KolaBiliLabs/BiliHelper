<script setup lang="ts">
import type { Component } from 'vue'
import { LogInIcon, LogOutIcon, MoonStarIcon, SunIcon } from 'lucide-vue-next'
import { NAvatar, NDropdown } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { computed, h, onMounted } from 'vue'
// import { getUserInfoApi } from '@/api/bilibili'
import LoginModal from '@/components/modals/LoginModal.vue'
import { useLoginModal } from '@/hooks/useLoginModal'
import { useSystemStore } from '@/stores/systemStore'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const { isLogin } = storeToRefs(userStore)

const systemStore = useSystemStore()
const { isDark } = storeToRefs(systemStore)

const { openModal, closeModal } = useLoginModal()
function logout() {
  userStore.clearUserInfo()
}
// 进入时，获取用户信息
onMounted(async () => {
  // try {
  //   const userInfoResponse = await getUserInfoApi()
  //   if (userInfoResponse.code === -101) {
  //     openModal()
  //     console.log('未登录')
  //   } else {
  //     console.log(' 用户信息 => ', userInfoResponse)
  //   }
  // } catch {
  //   console.log('it gonna be false')
  // }
})

function loginSuccess() {
  closeModal()
  window.$message.success('恭喜您，登录成功')
}

// 下拉菜单选项
const dropdownOptions = computed(() => ([
  {
    label: `${isDark.value ? '亮色' : '暗色'}主题`,
    key: 'toggleTheme',
    icon: renderIcon(isDark.value ? MoonStarIcon : SunIcon),
  },
  {
    type: 'divider', // 分割线
    key: 'divider-1',
  },
  isLogin.value
    ? {
        label: '登出',
        key: 'logout',
        icon: renderIcon(LogOutIcon),
      }
    : {
        label: '登录',
        key: 'login',
        icon: renderIcon(LogInIcon),
      },
]))
function renderIcon(icon: Component) {
  return () => h(icon, { class: 'size-4' })
}
// 处理下拉菜单选择
function handleSelect(key: string) {
  switch (key) {
    case 'toggleTheme':
      systemStore.toggleTheme()
      window.$message.success(`主题已切换到${isDark.value ? '暗色' : '亮色'}`)
      break
    case 'login':
      openModal()
      break
    case 'logout':
      logout()
      window.$message.success('您已退出登录')
      break
    default:
      break
  }
}
</script>

<template>
  <div class="flex-none app-region-no-drag size-9 rounded-full flex-center ring-2 ring-slate-500/50">
    <NDropdown
      :options="dropdownOptions"
      trigger="click"
      size="small"
      @select="handleSelect"
    >
      <!-- 头像本身 -->
      <NAvatar
        round
        :size="36"
        src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
        fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
        class="cursor-pointer"
      />
    </NDropdown>

    <LoginModal @success="loginSuccess" />
  </div>
</template>
