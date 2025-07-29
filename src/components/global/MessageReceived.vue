<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { getVideoDetail } from '@/api/search'
import { usePlayStore } from '@/stores/playStore'
import { delay } from '@/utils/core'

const playStore = usePlayStore()

const notificationSimpleConfig = {
  duration: 1500,
  closable: true,
}

onMounted(() => {
  window.electron.ipcRenderer.on('dataFromPlugin', async (_e, ...[payload]) => {
    const { bvId } = payload

    window.$notification.info({
      title: '接收到了来自插件的消息',
      description: '正在解析参数...',
      ...notificationSimpleConfig,
    })

    await delay(200)

    window.$notification.info({
      title: ' 获取视频详情',
      description: '正在获取视频详情...',
      ...notificationSimpleConfig,
    })

    await delay(200)

    const songDetail = await getVideoDetail(bvId)

    window.$notification.info({
      title: '添加到播放列表',
      description: '视频获取完成，正在添加到播放列表...',
      ...notificationSimpleConfig,
    })

    playStore.addToPlugin(songDetail)

    await delay(200)

    window.$notification.success({
      title: '添加完成',
      ...notificationSimpleConfig,
    })
  })
})
onUnmounted(() => {
  window.electron.ipcRenderer.removeAllListeners('dataFromPlugin')
})
</script>

<template>
  <div>
    messageReceived
  </div>
</template>
