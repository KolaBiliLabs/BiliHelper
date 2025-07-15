<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<script setup lang="ts">
import { MusicIcon, TrashIcon } from 'lucide-vue-next'
import { NButton, NDrawer, NDrawerContent, NText } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { nextTick } from 'vue'
import { usePlayStore } from '@/stores/playStore'
import { useSystemStore } from '@/stores/systemStore'

const systemStore = useSystemStore()
const { showPlaylist } = storeToRefs(systemStore)

const playStore = usePlayStore()
const { playQueue } = storeToRefs(playStore)

// 删除歌曲
function handleDeleteSong(song: ISong) {
  playQueue.value = playQueue.value.filter(s => s.bvid !== song.bvid)

  // [x]: 删除歌曲后 播放下一首
}

// 选择歌曲
function handleChooseSong(song: ISong) {
  playStore.play(song)
}

// 当进入动画结束
async function afterDrawerEnter() {
  await nextTick()
  const playingItem = document.querySelector(`.play-list-item.item-${playStore.currentIndex}`)

  playingItem?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}
</script>

<template>
  <NDrawer
    v-model:show="showPlaylist"
    :class="{ 'full-screen': systemStore.fullScreen }"
    :width="400"
    @after-enter="afterDrawerEnter"
  >
    <NDrawerContent :native-scrollbar="false" closable>
      <!-- 头部 -->
      <template #header>
        <NText> 播放列表 </NText>
        <div class="mt-3 text-[12px]">
          <NText> {{ playQueue.length }} 首歌曲 </NText>
        </div>
      </template>

      <!-- 主体 -->
      <main v-auto-animate>
        <div
          v-for="(song, idx) of playQueue"
          :key="song.bvid"
          class="flex-center p-2 gap-6 bg-black/50 border border-black/50 mb-3 rounded-xl cursor-pointer box-border transition-all duration-300 select-none hover:border-white/50 hover:shadow-black/10 active:scale-3d active:scale-[0.992]"
          :class="[
            `item-${song.bvid}`,
            { 'bg-white/50': song.bvid === playStore.currentSong?.bvid },
          ]"
          @click="handleChooseSong(song)"
        >
          <!-- 序号 -->
          <div class="px-3">
            <MusicIcon v-if="song.bvid === playStore.currentSong.bvid" class="size-4" />
            <NText v-else>
              {{ idx + 1 }}
            </NText>
          </div>

          <!-- 歌曲信息 -->
          <div class="flex-1">
            <NText v-html="song.title" />
          </div>

          <!-- 操作 -->
          <div class="action">
            <NButton quaternary class="px-3" @click.stop="() => handleDeleteSong(song)">
              <TrashIcon class="size-4" />
            </NButton>
          </div>
        </div>
      </main>
    </NDrawerContent>
  </NDrawer>
</template>

<style lang="scss">
.n-drawer {
  border-radius: 10px 0 0 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  .n-drawer-content {
    padding: 0;
  }

  .n-scrollbar-content {
    padding: 16px !important;
  }
}
</style>
