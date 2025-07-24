<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import type { Component } from 'vue'
import type { IPlaylist } from '@/stores/playStore'
import { AudioLines, AudioLinesIcon, HeartIcon, HistoryIcon, PlusIcon } from 'lucide-vue-next'
import { NButton, NMenu, NText } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { computed, h, useTemplateRef } from 'vue'
import PlayListMenu from '@/components/menus/PlayListMenu.vue'
import CreatePlaylistModal from '@/components/modals/PlaylistModal.vue'
import { useCreatePlaylistModal } from '@/hooks/usePlaylistModal'
import { usePlayStore } from '@/stores/playStore'
import { useSystemStore } from '@/stores/systemStore'

const systemStore = useSystemStore()
const { selectedMenuKey, currentPage, collapsed } = storeToRefs(systemStore)

const playStore = usePlayStore()
const { defaultPlaylists, customPlaylists } = storeToRefs(playStore)

const { openModal: openCreatePlaylistModal } = useCreatePlaylistModal()
const playListMenuRef = useTemplateRef('playListMenuRef')

function renderMenuLabel(playList: IPlaylist, icon: Component) {
  return () =>
    h('div', {
      maxWidth: '20px',
      onContextmenu(e) {
        playListMenuRef.value?.openDropdown(e, playList.id)
      },
    }, {
      default: () => playList.name,
      icon: () => h(icon, { class: 'size-5' }),
    })
}

function selectedMenu(v: string) {
  currentPage.value = v
}

// 菜单项
const menuOptions = computed<MenuOption[]>(() => [
  {
    type: 'group',
    label: '默认歌单',
    key: 'my-playlist',
    children: [],
    show: !systemStore.collapsed,
    icon: () => h(AudioLines, { class: 'size-4' }),
  },
  ...defaultPlaylists.value.map(item => ({
    label: renderMenuLabel(item, AudioLines),
    key: item.id,
    icon: () => h(item.id === 'history' ? HistoryIcon : HeartIcon, { class: 'size-4' }),
  })),
  {
    type: 'divider',
    key: 'divider',
  },
  {
    type: 'group',
    key: 'user-playlists',
    icon: collapsed ? () => h(AudioLines, { class: 'size-4' }) : undefined,
    label: () =>
      h('div', { class: 'flex items-center' }, [
        h(NText, { depth: 3 }, () => ['创建的歌单']),
        h(NButton, {
          type: 'tertiary',
          secondary: true,
          round: true,
          size: 'small',
          class: 'ml-3!',
          renderIcon: () => h(PlusIcon, { class: 'size-4' }),
          onclick: (event: Event) => {
            event.stopPropagation()
            openCreatePlaylist()
          },
        }),
      ]),
    children: [],
    show: !systemStore.collapsed,
  },
  ...customPlaylists.value.map(item => ({
    label: renderMenuLabel(item, AudioLines),
    key: item.id,
    icon: () => h(AudioLinesIcon, { class: 'size-4' }),
  })),
])

/**
 * 打开新建歌单的弹窗或面板
 * 用于触发用户创建新的播放列表的操作
 */
function openCreatePlaylist() {
  openCreatePlaylistModal()
}

function handleCreated({ name, desc }) {
  playStore.createPlaylist(name, desc)
}

function handleUpdated({ id, name, desc }) {
  playStore.updatePlaylist(id, name, desc)
}
</script>

<template>
  <div>
    <NMenu
      v-model:value="selectedMenuKey"
      class="main-menu"
      :root-indent="32"
      :indent="12"
      :collapsed="systemStore.collapsed"
      :collapsed-width="systemStore.collapsedWidth"
      :collapsed-icon-size="22"
      :options="menuOptions"
      @update:value="selectedMenu"
    />
    <!-- 创建歌单 modal -->
    <CreatePlaylistModal @created="handleCreated" @updated="handleUpdated" />

    <!-- 歌单 右键菜单 -->
    <PlayListMenu ref="playListMenuRef" />
  </div>
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
