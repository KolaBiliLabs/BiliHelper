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
            <RouterView #default="{ Component }">
              <Transition :name="transitionName" mode="out-in">
                <component :is="Component" />
              </Transition>
            </RouterView>
          </div>
        </NLayoutContent>
      </NLayout>
    </NLayout>

    <Control />

    <PlayQueue />
  </AppProvider>
</template>

<style lang="scss">
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

.player-slider {
  position: absolute !important;
  width: 100%;
  height: 16px;
  top: -8px !important;
  left: 0 !important;
  margin: 0 !important;
  --n-rail-height: 3px;
  --n-handle-size: 14px;
}
</style>
