<script setup lang="ts">
import { Button } from 'ant-design-vue'
import { Moon, Sun } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { useSystemStore } from '@/stores/systemStore'
import { setTheme } from '@/utils/theme'
import Search from './Search.vue'
import WindowControls from './WindowControls.vue'

const systemStore = useSystemStore()
const { isDark } = storeToRefs(systemStore)

function toggleTheme() {
  const newTheme = isDark.value ? 'light' : 'dark'
  setTheme(newTheme)
}
</script>

<template>
  <header class="relative flex items-center p-4 h-[64px] bg-blue-500/50 app-region-drag">
    <div class="flex-1 flex items-center gap-4">
      <Search class="app-region-no-drag" />

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
    </div>

    <section class="flex-none w-[164px] flex-center">
      <WindowControls class="app-region-no-drag" />
    </section>
  </header>
</template>
