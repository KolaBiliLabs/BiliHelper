<script setup lang="ts">
import { Button, Layout, LayoutContent, Table } from 'ant-design-vue'
import { Heart, Play, Share } from 'lucide-vue-next'
import Header from '@/components/common/header/Header.vue'
import Sider from '@/components/common/sidebar/Sidebar.vue'
import AppProvider from '@/components/provider/AppProvider.vue'
import Control from './components/Control.vue'

// 模拟歌曲列表数据
const columns = [
  {
    title: '歌曲',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '歌手',
    dataIndex: 'artist',
    key: 'artist',
  },
  {
    title: '专辑',
    dataIndex: 'album',
    key: 'album',
  },
  {
    title: '时长',
    dataIndex: 'duration',
    key: 'duration',
  },
]

const dataSource = []
</script>

<template>
  <AppProvider>
    <Layout class="h-full overflow-hidden backdrop-blur-2xl flex">
      <Sider class="flex-none" />

      <Layout class="flex-grow flex flex-col overflow-hidden">
        <Header />

        <LayoutContent class="flex-grow flex flex-col p-6 overflow-auto">
          <div class="flex-none flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
            <div class="flex items-center space-x-4">
              <h1 class="text-2xl font-bold text-gray-900">
                测试歌单
              </h1>
              <span class="text-gray-500">共 0 首</span>
            </div>
            <div class="flex items-center space-x-4">
              <Button type="primary" shape="round" class="flex-center">
                <template #icon>
                  <Play class="w-4 h-4 mr-1" />
                </template>
                播放全部
              </Button>
              <Button shape="round" class="flex-center">
                <template #icon>
                  <Heart class="w-4 h-4 mr-1" />
                </template>
                收藏
              </Button>
              <Button shape="round" class="flex-center">
                <template #icon>
                  <Share class="w-4 h-4 mr-1" />
                </template>
                分享
              </Button>
            </div>
          </div>

          <Table
            :columns="columns"
            :data-source="dataSource"
            :pagination="false"
            class="song-table"
          />
        </LayoutContent>
      </Layout>
    </Layout>

    <Control />
  </AppProvider>
</template>
