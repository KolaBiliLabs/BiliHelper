<script setup lang="ts">
import { Button } from 'ant-design-vue'
import { Moon, Sun } from 'lucide-vue-next'
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
  <Button
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
  </Button>
</template>

<style scoped>

</style>
