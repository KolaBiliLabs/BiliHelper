<script setup lang="ts">
import { NButton, NCard, NSlider } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { usePlayStore } from '@/stores/playStore'
import { useSystemStore } from '@/stores/systemStore'
import { dayjs } from '@/utils/dayjs'
import IconI from '../common/IconI.vue'
// import SongInfo from './SongInfo.vue'
// import Volume from './Volume.vue'

const systemStore = useSystemStore()
const playStore = usePlayStore()
const { isShowPlayer, playState } = storeToRefs(playStore)

// 手动更改当前播放时间
function handleUpdateCurrentTime(v: number) {
  console.log('update play time', v)
}

// 打开播放列表
function handleOpenPlayList() {
  playStore.isShowPlayer = true
  console.log('点击了 打开抽屉组件', playStore.isShowPlayer)
}

// 播放上一首/下一首
function handlePlayAdjacentOne(type: 'prev' | 'next') {
  type === 'prev' ? playStore.playPrev() : playStore.playNext()
}

const currentTime = ref(0)
const totalTime = ref(0)
</script>

<template>
  <NCard
    class="control-wrap"
    :class="[{ show: isShowPlayer && !systemStore.fullScreen }]"
    :content-style="{
      padding: 0,
    }"
  >
    <!-- 进度条 -->
    <NSlider
      v-if="isShowPlayer && !systemStore.fullScreen"
      v-model:value="currentTime"
      :max="totalTime"
      @update:value="handleUpdateCurrentTime"
    />

    <div class="player">
      <!-- 歌曲信息 -->
      <!-- <SongInfo :data="currentSong" /> -->

      <!-- 播放器 -->
      <div class="control">
        <NButton size="small" circle @click="handlePlayAdjacentOne('prev')">
          <IconI icon-name="i-iconoir:skip-prev-solid" />
        </NButton>
        <NButton
          circle
          style="margin: 0 10px"
          size="large"
          @click="() => {}"
        >
          <IconI :icon-name="!playState ? 'i-solar:play-bold-duotone' : 'i-solar:pause-bold-duotone'" :size="24" />
        </NButton>
        <NButton size="small" circle @click="handlePlayAdjacentOne('next')">
          <IconI icon-name="i-iconoir:skip-next-solid" />
        </NButton>
      </div>

      <!-- 菜单 -->
      <div class="menu">
        <!-- 歌曲进度 -->
        <div class="time flex-center select-none">
          <span>{{ dayjs(currentTime).format('mm:ss') }}</span>
          <span>/</span>
          <span>{{ dayjs(totalTime).format('mm:ss') }}</span>
        </div>
        <!-- 音量调节 -->
        <!-- <Volume /> -->

        <!-- 播放列表 -->
        <NButton
          circle
          secondary
          style="margin-left: 10px"
          @click="handleOpenPlayList"
        >
          <IconI icon-name="i-mingcute:playlist-fill" :size="18" />
        </NButton>
      </div> -->
    </div>
  </NCard>
</template>

<style scoped lang="scss">
.control-wrap {
  $h: 90px;
  position: fixed;
  left: 0;
  right: 0;
  height: $h;
  bottom: -$h;
  z-index: 100;
  transition: bottom 0.3s;

  &.show {
    bottom: 0;
  }
}

.n-card {
  /* position: relative; */

  .n-slider {
    position: absolute;
    top: -10px;
  }
}

/* 主控 */
.player {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: center;
  height: 100%;
  gap: 10px;

  div {
    height: 100%;
  }

  /* 中部播放器 */
  .control {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* 右侧菜单 */
  .menu {
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    /* 时间显示 */
    .time {
      font-size: 12px;
      color: #999;
      line-height: 1.5;
      margin-right: 24px;

      span {
        margin: 0 4px;
      }
    }

    /* 音量调节 */
  }
}
</style>
