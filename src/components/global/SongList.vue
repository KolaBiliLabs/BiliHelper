<script setup lang="ts">
import { NEmpty, NText } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useTemplateRef } from 'vue'
import Loading from '@/components/global/Loading.vue'
import SongListMenu from '@/components/menus/SongListMenu.vue'
import { useSystemStore } from '@/stores/systemStore'
import SongCard from '../card/SongCard.vue'

withDefaults(defineProps<{
  data: ISong[]
  loading?: boolean
  disabledHeader?: boolean
}>(), {
  disabledHeader: false,
  loading: false,
})
const emit = defineEmits<{
  choose: [song: ISong]
  toggleLike: [bvid: ISong]
}>()

defineSlots<{
  default: () => void
  header: () => void
}>()

const systemStore = useSystemStore()
const { selectedMenuKey } = storeToRefs(systemStore)

const songListMenuRef = useTemplateRef<InstanceType<typeof SongListMenu>>('songListMenuRef')

function toggleLike(song: ISong) {
  emit('toggleLike', song)
}
</script>

<template>
  <div v-auto-animate class="min-h-[60vh] space-y-4">
    <!-- 歌曲列表 -->
    <template v-if="!loading">
      <NEmpty
        v-if="!data || !data.length"
        class="w-full h-[50vh] flex-center"
      >
        <NText> 当前歌单无歌曲 </NText>
      </NEmpty>

      <template v-else>
        <SongCard
          v-for="(song, idx) in data"
          :key="song.bvid"
          :data="song"
          :index="idx"
          @dblclick="$emit('choose', song)"
          @contextmenu.stop="
            songListMenuRef?.openDropdown($event, data, song, idx, selectedMenuKey)
          "
          @toggle-like="toggleLike"
        />
      </template>
    </template>

    <!-- loading -->
    <div v-else class="flex-center">
      <Loading
        :size="80"
        class="w-full h-50vw flex-center"
      />
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
