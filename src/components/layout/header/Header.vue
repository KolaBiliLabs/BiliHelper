<script setup lang="ts">
import { NLayoutHeader } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useSystemStore } from '@/stores/systemStore'
import Search from './search/Search.vue'
import TrafficLights from './TrafficLights.vue'
import UserAvatarDropdown from './UserAvatarDropdown.vue'

const systemStore = useSystemStore()
const { siderWidth } = storeToRefs(systemStore)
</script>

<template>
  <NLayoutHeader bordered class="flex-none px-0 h-15 flex items-center">
    <div class="flex items-center w-full app-region-drag gap-2">
      <!-- Logo -->
      <div class="flex-none px-3 header-logo" :style="{ width: `${siderWidth}px` }">
        logo
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
