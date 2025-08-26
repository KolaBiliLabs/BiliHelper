<script setup lang="ts">
import { TimerIcon } from 'lucide-vue-next'
import { NButton, NDivider } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SongList from '@/components/global/SongList.vue'
import { usePlayStore } from '@/stores/playStore'
import { useSystemStore } from '@/stores/systemStore'
import player from '@/utils/player'
import { formatTime } from '@/utils/time'

const route = useRoute()
const router = useRouter()
const systemStore = useSystemStore()
const { showPlayer } = storeToRefs(systemStore)

const playStore = usePlayStore()
const { playlists } = storeToRefs(playStore)

// 从路由参数获取歌单ID
const playlistId = computed(() => {
  if (route.params.id) {
    return route.params.id as string
  }
  // 如果没有参数，使用当前路径的最后一段作为ID
  const pathSegments = route.path.split('/')
  return pathSegments[pathSegments.length - 1]
})

const playList = computed(() => playlists.value.find(v => v.id === playlistId.value))

// 如果歌单不存在，显示错误信息
const playlistNotFound = computed(() => !playList.value)

function toggleLike(song: ISong) {
  playStore.toggleLike(song)
}

/**
 * 播放全部歌曲
 */
function playAll() {
  if (!playList.value?.musics.length) {
    return
  }
  player.updatePlayList(playList.value.musics)
  showPlayer.value = true
}
</script>

<template>
  <div>
    <div v-if="playlistNotFound" class="text-center py-8">
      <h2 class="text-xl text-gray-500 mb-4">
        歌单不存在
      </h2>
      <NButton @click="router.push('/history')">
        返回历史页面
      </NButton>
    </div>

    <div v-else>
      <Transition name="left-sm" mode="out-in">
        <header :key="playlistId" class="flex justify-between">
          <div>
            <h1 class="text-2xl font-bold tracking-wide mb-1">
              {{ playList?.name }}
            </h1>
            <template v-if="playList?.description">
              <div class="text-gray-500 text-sm mt-1">
                {{ playList.description || '该歌单没有描述' }}
              </div>
            </template>
            <template v-if="!playList?.isDefault">
              <div class="flex items-center text-xs text-gray-400 mt-2 space-x-2">
                <TimerIcon class="size-4" />
                <span>{{ formatTime(playList?.createTime || 0, 'YYYY-MM-DD') }} 创建</span>
              </div>
            </template>
          </div>

          <div>
            <NButton
              :disabled="!playList?.musics.length"
              round
              tertiary
              @click="playAll"
            >
              播放全部
            </NButton>
          </div>
        </header>
      </Transition>

      <NDivider />

      <Transition name="fade" mode="out-in">
        <SongList
          :key="playlistId"
          :data="playList?.musics || []"
          @toggle-like="toggleLike"
        />
      </Transition>
    </div>
  </div>
</template>
