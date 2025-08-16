<script setup lang="ts">
import { NLayoutHeader } from 'naive-ui'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSystemStore } from '@/stores/systemStore'
import Search from './search/Search.vue'
import TrafficLights from './TrafficLights.vue'
import UserAvatarDropdown from './UserAvatarDropdown.vue'

const systemStore = useSystemStore()
const { siderWidth, isDark } = storeToRefs(systemStore)

// 根据主题选择 logo
const logoSrc = computed(() => {
  return isDark.value ? '@/assets/logo-icon-dark.svg' : '@/assets/logo-icon.svg'
})
</script>

<template>
  <NLayoutHeader bordered class="flex-none px-0 h-15 flex items-center">
    <div class="flex items-center w-full app-region-drag gap-2">
      <!-- Logo -->
      <div class="flex-none px-3 header-logo flex items-center gap-2" :style="{ width: `${siderWidth}px` }">
        <img :src="logoSrc" alt="KolaBiliHelper" class="w-8 h-8" />
        <span class="font-semibold text-lg text-gray-800 dark:text-gray-200">Kola</span>
      </div>

      <!-- 搜索框 -->
      <Search />

      <div class="flex-1 flex items-center justify-end gap-2">
        <UserAvatarDropdown />
      </div>

      <TrafficLights />
    </div>
  </NLayoutHeader>
</template>

<style scoped>
.header-logo {
  transition: all 0.3s ease;
}

.header-logo:hover {
  transform: scale(1.05);
}
</style>
