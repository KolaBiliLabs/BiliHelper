<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSystemStore } from '@/stores/systemStore'
import LoginOrLogout from './LoginOrLogout.vue'
import Search from './Search.vue'

const systemStore = useSystemStore()
const { siderWidth } = storeToRefs(systemStore)
</script>

<template>
  <div class="flex items-center w-full app-region-drag">
    <!-- Logo -->
    <div class="flex-none" :style="{ width: `${siderWidth}px` }">
      logo
    </div>

    <div class="flex-1 flex-between">
      <!-- 搜索框 -->
      <Search />

      <!-- 用户信息 -->
      <LoginOrLogout />
    </div>
  </div>
</template>
