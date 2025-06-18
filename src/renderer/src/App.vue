<script setup lang="ts">
import Sider from '@renderer/components/common/Sider.vue'
import { Button, Layout, LayoutContent, LayoutFooter } from 'ant-design-vue'
import { Share } from 'lucide-vue-next'
import Header from '@/components/common/Header.vue'
import AppProvider from '@/components/provider/AppProvider.vue'
</script>

<template>
  <AppProvider>
    <Layout class="h-screen bg-gray-100 antialiased overflow-hidden">
      <Header />

      <Layout class="flex-grow flex flex-row overflow-hidden">
        <Sider />

        <LayoutContent class="flex-grow flex flex-col p-6 bg-white overflow-hidden">
          <div class="flex-none flex items-center justify-between pb-4 border-b border-gray-200">
            <h1 class="text-2xl font-bold text-gray-900">
              测试歌单
            </h1>
            <div class="flex items-center space-x-4">
              <Button type="primary" shape="round">
                播放全部
              </Button>
              <Button shape="round">
                <template #icon />
                收藏
              </Button>
              <Button shape="round">
                <template #icon>
                  <Share />
                </template>
                分享
              </Button>
            </div>
          </div>
        </LayoutContent>
      </Layout>

      <LayoutFooter class="h-[80px]">
      <!-- <Control /> -->
      </LayoutFooter>
    </Layout>
  </AppProvider>
</template>
