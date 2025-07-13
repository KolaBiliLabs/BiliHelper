<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'
import { NButton } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useSystemStore } from '@/stores/systemStore'
import { setTheme } from '@/utils/theme'

const systemStore = useSystemStore()
const { isDark } = storeToRefs(systemStore)

function toggleTheme() {
  const newTheme = isDark.value ? 'light' : 'dark'
  setTheme(newTheme)
}
</script>

<template>
  <NButton
    shape="circle"
    class="app-region-no-drag flex-center"
    @click="toggleTheme"
  >
    <template #icon>
      <template v-if="!isDark">
        <Moon />
      </template>
      <template v-else>
        <Sun />
      </template>
    </template>
  </NButton>
</template>

<style scoped>

</style>
