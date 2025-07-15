<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<script setup lang="ts">
import { LocateIcon, MusicIcon, Trash2Icon, TrashIcon } from 'lucide-vue-next'
import { NButton, NDrawer, NDrawerContent, NEmpty, NGi, NGrid, NText } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { nextTick } from 'vue'
import { usePlayStore } from '@/stores/playStore'
import { useSystemStore } from '@/stores/systemStore'

const systemStore = useSystemStore()
const { showPlayQueue } = storeToRefs(systemStore)

const playStore = usePlayStore()
const { playQueue } = storeToRefs(playStore)

// 删除歌曲
function handleDeleteSong(song: ISong) {
  playQueue.value = playQueue.value.filter(s => s.bvid !== song.bvid)

  // [ ]: 删除歌曲后 播放下一首
}

// 选择歌曲
function handleChooseSong(song: ISong) {
  playStore.play(song)
}

// 当进入动画结束
async function scrollToItem() {
  await nextTick()
  const playingItem = document.querySelector(`.item-${playStore.currentSong.bvid}`)

  playingItem?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}

function clearQueue() {
  playStore.clearQueue()
  showPlayQueue.value = false
}
</script>

<template>
  <NDrawer
    v-model:show="showPlayQueue"
    :class="{ 'full-screen': systemStore.fullScreen }"
    :width="400"
    @after-enter="scrollToItem"
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
        <template v-if="playQueue.length">
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
        </template>
        <NEmpty
          v-else
          description="播放列表暂无歌曲，快去添加吧"
          class="tip"
          size="large"
          style="margin-top: 60px"
        />
      </main>

      <template #footer>
        <NGrid :cols="2" x-gap="16" class="playlist-menu">
          <NGi>
            <NButton
              :focusable="false"
              size="large"
              strong
              secondary
              block
              @click="clearQueue"
            >
              <template #icon>
                <Trash2Icon class="size-4" />
              </template>
              清空列表
            </NButton>
          </NGi>
          <NGi>
            <NButton
              :focusable="false"
              :disabled="!playQueue.length"
              size="large"
              strong
              secondary
              block
              @click="scrollToItem"
            >
              <template #icon>
                <LocateIcon class="size-4" />
              </template>
              当前播放
            </NButton>
          </NGi>
        </NGrid>
      </template>
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
