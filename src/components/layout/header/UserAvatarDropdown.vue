<script setup lang="ts">
import { LogInIcon, LogOutIcon, MoonStarIcon, SunIcon } from 'lucide-vue-next'
import { NAvatar, NDropdown, NIcon } from 'naive-ui'
import { computed, h } from 'vue'

interface Props {
  isLoggedIn: boolean
  currentTheme: 'light' | 'dark'
}

const props = defineProps<Props>()
const emit = defineEmits<{
  toggleTheme: []
  updateLoginStatus: [isLogin: boolean]
}>()

// 下拉菜单选项
const dropdownOptions = computed(() => {
  const options = [
    {
      label: props.currentTheme === 'light' ? '切换到暗色主题' : '切换到亮色主题',
      key: 'toggleTheme',
      icon: () => h(NIcon, null, { default: () => (props.currentTheme === 'light' ? h(MoonStarIcon) : h(SunIcon)) }),
    },
    {
      type: 'divider', // 分割线
      key: 'divider-1',
    },
  ]

  if (props.isLoggedIn) {
    options.push({
      label: '登出',
      key: 'logout',
      icon: () => h(NIcon, null, { default: () => h(LogOutIcon) }),
    })
  } else {
    options.push({
      label: '登录',
      key: 'login',
      icon: () => h(NIcon, null, { default: () => h(LogInIcon) }),
    })
  }
  return options
})

// 处理下拉菜单选择
function handleSelect(key: string) {
  if (key === 'toggleTheme') {
    emit('toggleTheme')
    window.$message.success(`主题已切换到 ${props.currentTheme === 'light' ? '暗色' : '亮色'}`)
  } else if (key === 'login') {
    emit('updateLoginStatus', true)
    window.$message.success('您已登录！')
  } else if (key === 'logout') {
    emit('updateLoginStatus', false)
    window.$message.info('您已登出！')
  }
}
</script>

<template>
  <NDropdown :options="dropdownOptions" trigger="click" @select="handleSelect">
    <div class="relative cursor-pointer group">
      <!-- 头像本身 -->
      <NAvatar
        round
        :size="48"
        src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
        fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
        class="z-10 relative"
      />
      <!-- 半透明光环效果 -->
      <div
        class="absolute inset-0 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-sm
               scale-0 group-hover:scale-110 opacity-0 group-hover:opacity-100
               transition-all duration-300 ease-out z-0
               flex items-center justify-center
               "
      >
        <!-- 内部的更亮的光泽效果，模仿液态玻璃的高光 -->
        <div class="w-2/3 h-2/3 rounded-full bg-white/30 dark:bg-white/20 blur-sm" />
      </div>
    </div>
  </NDropdown>
</template>
