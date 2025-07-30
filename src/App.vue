<script setup lang="ts">
import { NLayout, NLayoutContent } from 'naive-ui'
import { onMounted } from 'vue'
import Control from '@/components/control/PlayerControl.vue'
import PlayQueue from '@/components/control/PlayQueue.vue'
import AppProvider from '@/components/global/AppProvider.vue'
import Content from '@/components/global/Content.vue'
import Header from '@/components/layout/header/Header.vue'
import Sider from '@/components/layout/sidebar/Sidebar.vue'
import { useMessageReceived } from '@/hooks/useMessageReceived'
import { useSystemStore } from '@/stores/systemStore'
import { init } from '@/utils/init'

const systemStore = useSystemStore()

useMessageReceived()

onMounted(() => {
  init()
})
</script>

<template>
  <AppProvider>
    <NLayout class="all-layout overflow-auto" :class="[{ fullScreen: systemStore.fullScreen }]" position="absolute">
      <!-- 头部 -->
      <Header />

      <NLayout
        class="body-layout"
        has-sider
        position="absolute"
      >
        <!-- 侧边栏 -->
        <Sider />

        <!-- 主体部分 -->
        <NLayoutContent :native-scrollbar="false" embedded>
          <Content />
        </NLayoutContent>
      </NLayout>
    </NLayout>

    <Control />

    <PlayQueue />
  </AppProvider>
</template>

<style lang="scss" scoped>
.all-layout {
  $headerHeight: 60px;
  height: 100%;
  transition: transform 0.3s;

  &.fullScreen {
    transform: scale3d(0.95, 0.95, -1);
    border-radius: 10px;
  }

  .body-layout {
    top: $headerHeight;
    transition: bottom 0.3s;

    &.player-bar {
      bottom: 80px;
    }

    .main-sider {
      :deep(.n-scrollbar-content) {
        height: 100%;
      }
      .sider-all {
        height: 100%;
      }

      @media (max-width: 720px) {
        display: none;
      }
    }
  }
}
</style>
