<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import type { Component } from 'vue'
import type { IPlaylist } from '@/stores/playStore'
import { SEARCH_RESULT_PAGE } from '@constants/pageId'
import { AudioLines, AudioLinesIcon, HeartIcon, HistoryIcon, PlusIcon } from 'lucide-vue-next'
import { NButton, NMenu, NText } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { computed, h, useTemplateRef, watch } from 'vue'
import PlayListMenu from '@/components/menus/PlayListMenu.vue'
import PlaylistModal from '@/components/modals/PlaylistModal.vue'
import { usePlaylistModal } from '@/hooks/usePlaylistModal'
import { usePlayStore } from '@/stores/playStore'
import { useSystemStore } from '@/stores/systemStore'

const systemStore = useSystemStore()
const { selectedMenuKey, currentPage, collapsed } = storeToRefs(systemStore)

const playStore = usePlayStore()
const { defaultPlaylists, customPlaylists } = storeToRefs(playStore)

const { openModal: openPlaylistModal } = usePlaylistModal()
const playListMenuRef = useTemplateRef('playListMenuRef')

function renderMenuLabel(playList: IPlaylist) {
  return () =>
    h('div', {
      maxWidth: '20px',
      onContextmenu(e) {
        playListMenuRef.value?.openDropdown(e, playList)
      },
    }, {
      default: () => playList.name,
    })
}

function renderIcon(icon: Component) {
  return () => h(icon, { class: 'size-4' })
}

function selectedMenu(v: string) {
  currentPage.value = v
}

// 当currentPage 切换时，同步selectedKey
watch(() => currentPage.value, (v) => {
  // 相同则不处理
  if (selectedMenuKey.value === v) {
    return
  }

  if (v === SEARCH_RESULT_PAGE) {
    return
  }
  selectedMenuKey.value = v
})

// 菜单项
const menuOptions = computed<MenuOption[]>(() => [
  {
    type: 'group',
    label: '默认歌单',
    key: 'my-playlist',
    children: [],
    show: !systemStore.collapsed,
    icon: renderIcon(AudioLines),
  },
  ...defaultPlaylists.value.map(item => ({
    label: renderMenuLabel(item),
    key: item.id,
    icon: renderIcon(item.id === 'history' ? HistoryIcon : HeartIcon),
  })),
  {
    type: 'divider',
    key: 'divider',
  },
  {
    type: 'group',
    key: 'user-playlists',
    icon: collapsed ? renderIcon(AudioLines) : undefined,
    label: () =>
      h('div', { class: 'flex items-center' }, [
        h(NText, { depth: 3 }, () => ['创建的歌单']),
        h(NButton, {
          type: 'tertiary',
          secondary: true,
          round: true,
          size: 'tiny',
          class: 'ml-12!',
          renderIcon: renderIcon(PlusIcon),
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
    label: renderMenuLabel(item),
    key: item.id,
    icon: renderIcon(AudioLinesIcon),
  })),
])

/**
 * 打开新建歌单的弹窗或面板
 * 用于触发用户创建新的播放列表的操作
 */
function openCreatePlaylist() {
  openPlaylistModal()
}

/**
 * 创建歌单
 */
function handleCreated({ name, desc }) {
  playStore.createPlaylist(name, desc)
}

/**
 * 更新歌单
 */
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
    <Teleport to="#modals">
      <PlaylistModal @created="handleCreated" @updated="handleUpdated" />
    </Teleport>

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
