<script setup lang="ts">
import { NLayout, NLayoutContent } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Control from '@/components/control/PlayerControl.vue'
import PlayQueue from '@/components/control/PlayQueue.vue'
import AppProvider from '@/components/global/AppProvider.vue'
import Header from '@/components/layout/header/Header.vue'
import Sider from '@/components/layout/sidebar/Sidebar.vue'
import { useMessageReceived } from '@/hooks/useMessageReceived'
import { useSystemStore } from '@/stores/systemStore'
import { init } from '@/utils/init'

const route = useRoute()
const systemStore = useSystemStore()
const { showPlayer } = storeToRefs(systemStore)

// 根据路由meta获取过渡效果
const transitionName = computed(() => {
  return (route.meta?.transition as string) || 'router'
})

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
          <div class="p-4 pl-6" :class="{ 'pb-27': showPlayer }">
            <Transition :name="transitionName" mode="out-in">
              <RouterView />
            </Transition>
          </div>
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

// 路由过渡动画
.router-enter-active,
.router-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.router-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.router-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

// 淡入淡出过渡
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 滑动过渡
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateY(30px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}

// 缩放过渡
.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.scale-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.scale-leave-to {
  opacity: 0;
  transform: scale(1.05);
}
</style>
