<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import { NEllipsis, NMenu } from 'naive-ui'
import { computed, h, ref } from 'vue'
import { useSystemStore } from '@/stores/systemStore'
import IconI from '../IconI.vue'

const systemStore = useSystemStore()

// 当前选中的菜单项
const activeKey = ref<string>('online-music')

// 渲染图标
function renderIcon(iconName: string, size: number) {
  return () => h(IconI, { size, iconName })
}

//
function renderMenuRouterLink(to: string, label: string) {
  return () =>
    h(
      'div',
      {
        to,
        activeClass: 'active',
      },
      h(NEllipsis, {
        maxWidth: '20px',
      }, {
        default: () => label,
      }),
    )
}

// 菜单项
const menuOptions = computed<MenuOption[]>(() => [
  {
    type: 'group',
    label: '我的音乐',
    key: 'my-music',
    children: [],
    show: !systemStore.collapsed,
  },
  {
    label: renderMenuRouterLink('/favorite', '我喜欢的音乐'),
    key: 'favorite',
    icon: renderIcon('i-carbon:3d-print-mesh', 20),
  },
  {
    label: renderMenuRouterLink('/history', '最近播放'),
    key: 'history',
    icon: renderIcon('i-carbon:ibm-cloud-pak-integration', 20),
  },
])
</script>

<template>
  <NMenu
    v-model:value="activeKey"
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
