<script setup lang="ts">
import type { VNode } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { NButton, NEmpty, NText } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useTemplateRef } from 'vue'
import SongListMenu from '@/components/menus/SongListMenu.vue'
import { usePlayStore } from '@/stores/playStore'
import { useSystemStore } from '@/stores/systemStore'
import player from '@/utils/player'
import SongCard from '../card/SongCard.vue'

const props = withDefaults(defineProps<{
  data: ISong[]
  loading?: boolean
  disabledHeader?: boolean
  noMore?: true
}>(), {
  disabledHeader: false,
  loading: false,
})
const emit = defineEmits<{
  choose: [song: ISong]
  toggleLike: [song: ISong]
  loadMore: []
}>()

defineSlots<{
  default: () => VNode
  header: () => VNode
  empty: () => VNode
}>()

const systemStore = useSystemStore()
const { selectedMenuKey, showPlayer } = storeToRefs(systemStore)

const playStore = usePlayStore()

const songListMenuRef = useTemplateRef<InstanceType<typeof SongListMenu>>('songListMenuRef')

// 选择歌曲
function chooseSong(song: ISong) {
  console.log('→ choose song in SongList', song)
  player.updatePlayList(playStore.playQueue, song)
  showPlayer.value = true

  emit('choose', song)
}

function toggleLike(song: ISong) {
  emit('toggleLike', song)
}

const loadMoreBtnRef = useTemplateRef('loadMoreBtnRef')
useIntersectionObserver(loadMoreBtnRef, ([{ isIntersecting }]) => {
  if (isIntersecting) {
    if (!props.noMore) {
      emit('loadMore')
    }
  }
})
</script>

<template>
  <div v-auto-animate class="space-y-4">
    <!-- 歌曲列表 -->
    <section>
      <slot v-if="!loading && (!data || !data.length)" name="empty">
        <NEmpty
          class="w-full flex-center"
        >
          <NText> 当前歌单无歌曲 </NText>
        </NEmpty>
      </slot>

      <div v-else class="space-y-4">
        <SongCard
          v-for="(song, idx) in data"
          :key="song.id"
          :data="song"
          :index="idx"
          @dblclick.stop="() => chooseSong(song)"
          @contextmenu.stop="
            songListMenuRef?.openDropdown($event, data, song, idx, selectedMenuKey)
          "
          @toggle-like="toggleLike"
        />
      </div>
    </section>

    <!-- loading -->
    <div v-if="!noMore" class="flex justify-center">
      <NButton
        ref="loadMoreBtnRef"
        :loading="loading"
        size="small"
        round
      >
        <span>
          {{ noMore ? '没有更多了' : '加载更多' }}
        </span>
      </NButton>
    </div>

    <!-- 右键菜单 -->
    <SongListMenu ref="songListMenuRef" />
  </div>
</template>

<style scoped lang="scss">
/* 歌列表 */
.n-card {
  $transition: all 0.3s ease-in-out;

  padding: 8px 16px;
  border: 1px solid #ffffff40;
  border-radius: 8px;
  cursor: pointer;
  transition: $transition;
  width: 100%;

  &:hover {
    box-shadow: 0 0 8px #ffffff60;
    border-color: #ffffff60;
  }

  &.active {
    border-color: #ffffff80;
    background-color: #ffffff60;
  }

  &:active {
    transform: scale3d(0.993, 0.993, 1);
  }

  :deep(.n-card__content) {
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.music-playing-indicator {
  animation: pulse 1.2s infinite cubic-bezier(0.65, 0.05, 0.36, 1); /* 动画名称、时长、无限循环、缓动函数 */
}

@keyframes pulse {
  0% {
    transform: scale(0.9); /* 缩小到 80% */
  }
  50% {
    transform: scale(1.1); /* 放大到 120% */
  }
  100% {
    transform: scale(0.9); /* 缩小回 80% */
  }
}
</style>
