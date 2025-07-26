<!-- 歌曲列表 - 右键菜单 -->
<script setup lang="ts">
import type { DropdownOption } from 'naive-ui'
import type { FunctionalComponent } from 'vue'
import type { IPlaylist } from '@/stores/playStore'
import { HISTORY_PAGE } from '@constants/pageId'
import { Edit2Icon, PlayIcon, Trash2Icon } from 'lucide-vue-next'
import { NDropdown } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { h, nextTick, ref } from 'vue'
import { usePlaylistModal } from '@/hooks/usePlaylistModal'
import { usePlayStore } from '@/stores/playStore'
import { useSystemStore } from '@/stores/systemStore'

defineEmits<{ removeSong: [index: number[]] }>()

const systemStore = useSystemStore()
const playStore = usePlayStore()
const { customPlaylists } = storeToRefs(playStore)

const { openModal: openPlayListModal } = usePlaylistModal()

// 右键菜单数据
const dropdownX = ref<number>(0)
const dropdownY = ref<number>(0)
const dropdownShow = ref<boolean>(false)
const dropdownOptions = ref<DropdownOption[]>([])

function renderIcon(icon: FunctionalComponent) {
  return () => h(icon, { class: 'size-4' })
}

/**
 * 删除歌单
 * @param playList
 */
function handleDelPlayList(playList: IPlaylist) {
  if (playList.musics.length >= 5) {
    window.$dialog.info({
      title: '确定删除此歌单？',
      positiveText: '确认',
      negativeText: '取消',
      onPositiveClick() {
        playStore.removePlaylist(playList.id)
      },
    })
    return
  }

  playStore.removePlaylist(playList.id)

  systemStore.currentPage = HISTORY_PAGE
}

// 开启右键菜单
function openDropdown(e: MouseEvent, playList: IPlaylist) {
  try {
    e.preventDefault()
    dropdownShow.value = false
    // 是否为用户歌单
    const isUserPlaylist = !!playList.id && customPlaylists.value.find(pl => pl.id === playList.id)
    // 生成菜单
    nextTick().then(() => {
      const options: DropdownOption[] = [
        {
          label: '播放全部',
          key: 'playAll',
          icon: renderIcon(PlayIcon),
          props: {
            onClick() {
              console.log('clicked play all => ')
            },
          },
        },
      ]
      if (isUserPlaylist) {
        options.push(
          {
            label: '修改歌单',
            key: 'update',
            icon: renderIcon(Edit2Icon),
            props: {
              onClick() {
                openPlayListModal(true, { id: playList.id, name: playList.name, desc: playList.description })
              },
            },
          },
          {
            label: '删除歌单',
            key: 'delete',
            icon: renderIcon(Trash2Icon),
            style: 'color: #e53e3e;',
            props: {
              onClick: () => handleDelPlayList(playList),
            },
          },
        )
      }
      dropdownOptions.value = options
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
