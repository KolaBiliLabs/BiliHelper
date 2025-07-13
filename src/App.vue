<script setup lang="ts">
import { NLayout, NLayoutContent, NLayoutHeader } from 'naive-ui'
import Header from '@/components/common/header/Header.vue'
import Sider from '@/components/common/sidebar/Sidebar.vue'
import AppProvider from '@/components/provider/AppProvider.vue'
import Content from './components/Content.vue'
import Control from './components/control/Control.vue'
import { useSystemStore } from './stores/systemStore'

const systemStore = useSystemStore()
</script>

<template>
  <AppProvider>
    <NLayout class="all-layout" :class="[{ fullScreen: systemStore.fullScreen }]" position="absolute">
      <!-- 头部 -->
      <NLayoutHeader bordered>
        <Header />
      </NLayoutHeader>

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

  .n-layout-header {
    height: $headerHeight;
    padding: 0 14px;
    display: flex;
    align-items: center;
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
