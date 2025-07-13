<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import { NEllipsis, NMenu } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { computed, h } from 'vue'
import { usePlaylistStore } from '@/stores/playlistStore'
import { useSystemStore } from '@/stores/systemStore'

const systemStore = useSystemStore()
const { selectedMenuKey } = storeToRefs(systemStore)

const playlistStore = usePlaylistStore()
const { defaultPlaylists, customPlaylists } = storeToRefs(playlistStore)

function renderMenuRouterLink(label: string) {
  return () =>
    h(NEllipsis, {
      maxWidth: '20px',
    }, {
      default: () => label,
    })
}

// 菜单项
const menuOptions = computed<MenuOption[]>(() => [
  {
    type: 'group',
    label: '默认歌单',
    key: 'my-playlist',
    children: [],
    show: !systemStore.collapsed,
  },
  ...defaultPlaylists.value.map(item => ({
    label: renderMenuRouterLink(item.name),
    key: item.id,
  })),
  {
    type: 'group',
    label: '自定义歌单',
    key: 'custom-playlist',
    children: [],
    show: !systemStore.collapsed,
  },
  ...customPlaylists.value.map(item => ({
    label: renderMenuRouterLink(item.name),
    key: item.id,
  })),
])
</script>

<template>
  <NMenu
    v-model:value="selectedMenuKey"
    class="main-menu"
    :root-indent="32"
    :indent="0"
    :collapsed="systemStore.collapsed"
    :collapsed-width="systemStore.collapsedWidth"
    :collapsed-icon-size="22"
    :options="menuOptions"
  />
</template>

<style lang="scss" scoped>
.main-menu {
  :deep(.n-menu-item) {
    .n-menu-item-content--selected {
      &:before {
        border-left: 3px solid red;
      }
    }
  }
}
</style>
