<script setup lang="ts">
import type { ItemType } from 'ant-design-vue'
import type { VueElement } from 'vue'
import { Menu } from 'ant-design-vue'
import { BookHeadphones, Heart } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { h, ref } from 'vue'
import { useSystemStore } from '@/stores/systemStore'

const systemStore = useSystemStore()
const { selectedMenuKey } = storeToRefs(systemStore)

function getItem(label: VueElement | string, key: string, icon?: any, children?: ItemType[], type?: 'group'): ItemType {
  return {
    key,
    icon: icon ? h(icon) : undefined,
    children,
    label,
    type,
  } as ItemType
}

const playLists = ref([
  getItem('物理魔法使马修 神插曲', 'playlist1'),
  getItem('物理魔法使马修 神插曲2', 'playlist2'),
  getItem('物理魔法使马修 神插曲3', 'playlist3'),
  getItem('物理魔法使马修 神插曲4', 'playlist4'),
  getItem('物理魔法使马修 神插曲5', 'playlist5'),
  getItem('物理魔法使马修 神插曲2', 'playlist2'),
  getItem('物理魔法使马修 神插曲2', 'playlist2'),
  getItem('物理魔法使马修 神插曲3', 'playlist3'),
  getItem('物理魔法使马修 神插曲4', 'playlist4'),
  getItem('物理魔法使马修 神插曲5', 'playlist5'),
  getItem('物理魔法使马修 神插曲3', 'playlist3'),
  getItem('物理魔法使马修 神插曲4', 'playlist4'),
  getItem('物理魔法使马修 神插曲2', 'playlist2'),
  getItem('物理魔法使马修 神插曲3', 'playlist3'),
  getItem('物理魔法使马修 神插曲4', 'playlist4'),
  getItem('物理魔法使马修 神插曲5', 'playlist5'),
  getItem('物理魔法使马修 神插曲5', 'playlist5'),
])

const items = ref<ItemType[]>([
  getItem('我喜欢的音乐', 'favorite', Heart),
  getItem('最近播放', 'recently', BookHeadphones),
  { type: 'divider' },
  getItem('创建的歌单', 'created', undefined, playLists.value, 'group'),
])
</script>

<template>
  <div class="h-full">
    <Menu
      v-model:selected-keys="selectedMenuKey"
      mode="inline"
      :items
    />
  </div>
</template>
