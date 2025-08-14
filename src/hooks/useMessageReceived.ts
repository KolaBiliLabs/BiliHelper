// [ ] 替换为 steps
import { DATA_FROM_PLUGIN } from '@constants/ipcChannels'
// import { NStep, NSteps } from 'naive-ui'
import { onMounted, onUnmounted } from 'vue'
import { getVideoDetail } from '@/api/search'
import { usePlayStore } from '@/stores/playStore'
import { delay } from '@/utils/helper'

const notificationSimpleConfig = {
  duration: 1500,
  closable: true,
}

const channelName = DATA_FROM_PLUGIN

/**
 * @description 用于接收 electron主线程的 ws 消息并做后续处理
 */
export function useMessageReceived() {
  const playStore = usePlayStore()

  onMounted(() => {
    window.electron.ipcRenderer.on(channelName, async (_e, ...[payload]: [IUnifiedData]) => {
      console.log(payload)
      const { params } = payload

      // window.$message.create(
      //   () => h(NSteps, { size: 'small', status: 'process', current: 1 }, {
      //     default: () => [
      //       h(NStep, { title: '解析参数', description: '收到了来自插件的消息' }),
      //       h(NStep, { title: '解析参数', description: '收到了来自插件的消息' }),
      //       h(NStep, { title: '解析参数', description: '收到了来自插件的消息' }),
      //       h(NStep, { title: '解析参数', description: '收到了来自插件的消息' }),
      //     ],
      //   }),
      //   {
      //     duration: 5000,
      //   },
      // )

      window.$notification.info({
        title: '接收到了来自插件的消息',
        description: '正在解析参数...',
        ...notificationSimpleConfig,
      })

      await delay(200)

      window.$notification.info({
        title: '获取视频详情',
        description: '正在获取视频详情...',
        ...notificationSimpleConfig,
      })

      await delay(200)

      const songDetail = await getVideoDetail(params.bvId!)

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
    window.electron.ipcRenderer.removeAllListeners(channelName)
  })
}
