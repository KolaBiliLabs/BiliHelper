<script setup lang="ts">
import { NLayoutHeader } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useSystemStore } from '@/stores/systemStore'
import LoginOrLogout from './LoginOrLogout.vue'
import Search from './search/Search.vue'
import Theme from './Theme.vue'

const systemStore = useSystemStore()
const { siderWidth } = storeToRefs(systemStore)
</script>

<template>
  <NLayoutHeader bordered class="px-0 h-15 flex items-center">
    <div class="flex items-center w-full app-region-drag">
      <!-- Logo -->
      <div class="flex-none px-3" :style="{ width: `${siderWidth}px` }">
        logo
      </div>

      <!-- 搜索框 -->
      <Search />

      <div class="flex-1 flex items-center justify-end">
        <!-- 主题切换 -->
        <Theme />

        <!-- 用户信息 -->
        <LoginOrLogout />
      </div>
    </div>
  </NLayoutHeader>
</template>
