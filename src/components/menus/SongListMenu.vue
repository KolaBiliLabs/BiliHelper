<!-- 歌曲列表 - 右键菜单 -->
<script setup lang="ts">
import type { DropdownOption } from 'naive-ui'
import type { FunctionalComponent } from 'vue'
import { CopyIcon, ListPlusIcon, MenuIcon, Play, ShareIcon } from 'lucide-vue-next'
import { NDropdown } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { h, nextTick, ref } from 'vue'
import { usePlayStore } from '@/stores/playStore'

defineEmits<{ removeSong: [index: number[]] }>()

const playStore = usePlayStore()
const { customPlaylists } = storeToRefs(playStore)

// 右键菜单数据
const dropdownX = ref<number>(0)
const dropdownY = ref<number>(0)
const dropdownShow = ref<boolean>(false)
const dropdownOptions = ref<DropdownOption[]>([])

function renderIcon(icon: FunctionalComponent) {
  return () => h(icon, { class: 'size-4' })
}

// 开启右键菜单
function openDropdown(e: MouseEvent, data: ISong[], song: ISong, index: number, playListId: string) {
  try {
    e.preventDefault()
    dropdownShow.value = false
    // 是否为用户歌单
    const isUserPlaylist = !!playListId && customPlaylists.value.some(pl => pl.id === playListId)
    // 生成菜单
    nextTick().then(() => {
      dropdownOptions.value = [
        {
          key: 'play',
          label: '立即播放',
          props: {
            onClick: () => playStore.play(song),
          },
          icon: renderIcon(Play),
        },
        // {
        //   key: 'play-next',
        //   label: '下一首播放',
        //   show: !isCurrent && !statusStore.personalFmMode,
        //   props: {
        //     onClick: () => player.addNextSong(song, false),
        //   },
        //   icon: renderIcon('PlayNext', { size: 18 }),
        // },
        {
          key: 'playlist-add',
          label: '添加到歌单',
          icon: renderIcon(ListPlusIcon),
          children: [
            ...customPlaylists.value.map(cp => ({
              key: cp.id,
              label: cp.name,
              props: {
                onClick: () => playStore.addMusicToPlaylist(cp.id, song),
              },
            })),
          ],
        },
        {
          key: 'line-1',
          type: 'divider',
        },
        {
          key: 'more',
          label: '更多操作',
          icon: renderIcon(MenuIcon),
          children: [
            {
              key: 'code-name',
              label: `复制歌曲名称`,
              props: {
                onClick: () => {},
              },
              icon: renderIcon(CopyIcon),
            },
            {
              key: 'code-id',
              label: `复制歌曲ID`,
              props: {
                onClick: () => {
                  console.log('click copy id')
                },
              },
              icon: renderIcon(CopyIcon),
            },
            {
              key: 'share',
              label: `分享链接`,
              props: {
                onClick: () => {
                  console.log('click share ')
                },
              },
              icon: renderIcon(ShareIcon),
            },
          ],
        },
      ]
      // 显示菜单
      dropdownX.value = e.clientX
      dropdownY.value = e.clientY
      dropdownShow.value = true
    })
  } catch (error) {
    console.error('右键菜单出现异常：', error)
    window.$message.error('右键菜单出现异常')
  }
}

defineExpose({ openDropdown })
</script>

<template>
  <NDropdown
    :x="dropdownX"
    :y="dropdownY"
    :show="dropdownShow"
    :options="dropdownOptions"
    class="song-list-menu"
    placement="bottom-start"
    trigger="manual"
    size="large"
    @select="dropdownShow = false"
    @clickoutside="dropdownShow = false"
  />
</template>

<style lang="scss">
.delete-mata {
  display: flex;
}
</style>
