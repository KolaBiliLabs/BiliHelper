<script setup lang="ts">
import { Menu, MenuItem, SubMenu } from 'ant-design-vue'
import { Heart } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { useSystemStore } from '@/stores/systemStore'

const systemStore = useSystemStore()
const { selectedMenuKey } = storeToRefs(systemStore)
</script>

<template>
  <Menu
    v-model:selected-keys="selectedMenuKey"
    mode="inline"
    class="border-none"
  >
    <MenuItem key="1">
      <template #icon>
        <Heart :size="14" />
      </template>
      我喜欢的音乐
    </MenuItem>
    <MenuItem key="2">
      最近播放
    </MenuItem>
    <SubMenu key="sub1">
      <template #icon>
        it's icon
      </template>
      <template #title>
        创建的歌单 (6)
      </template>
    </submenu>
  </Menu>
</template>

<style scoped>

</style>
