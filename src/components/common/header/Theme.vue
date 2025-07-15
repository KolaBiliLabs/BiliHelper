<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'
import { NButton } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useSystemStore } from '@/stores/systemStore'

const systemStore = useSystemStore()
const { isDark } = storeToRefs(systemStore)
</script>

<template>
  <NButton
    circle
    class="app-region-no-drag flex-center"
    tertiary
    @click="systemStore.toggleTheme"
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
