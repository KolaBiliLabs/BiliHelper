import { LIKE_STATUS_CHANGE, PAUSE, PLAY, PLAY_NEXT, PLAY_PREV } from '@constants/ipcChannels'
import { usePlayStore } from '@/stores/playStore'
import { isElectron } from './helper'

// 全局 IPC 事件
export function initIpc() {
  try {
    if (!isElectron) {
      console.log('⚠️ not electron')
      return
    }
    // 播放
    window.electron.ipcRenderer.on(PLAY, () => {
      const playStore = usePlayStore()
      // 存在播放器则恢复播放
      if (playStore.hasPlayer()) {
        playStore.resume()
      } else {
        // 否则播放上次的歌曲
        playStore.play(playStore.currentSong)
      }
    })
    // 暂停
    window.electron.ipcRenderer.on(PAUSE, () => {
      const playStore = usePlayStore()
      playStore.pause()
    })
    // // 播放或暂停
    // window.electron.ipcRenderer.on('playOrPause', () => playStore.pauseOrResume())
    // 上一曲
    window.electron.ipcRenderer.on(PLAY_PREV, () => {
      const playStore = usePlayStore()
      playStore.playNext()
    })
    // 下一曲
    window.electron.ipcRenderer.on(PLAY_NEXT, () => {
      const playStore = usePlayStore()
      playStore.playPrev()
    })

    // 切换喜欢
    window.electron.ipcRenderer.on(LIKE_STATUS_CHANGE, () => {
      const playStore = usePlayStore()
      playStore.toggleLike(playStore.currentSong)
    })
    // // 音量加
    // window.electron.ipcRenderer.on('volumeUp', () => player.setVolume('up'))
    // // 音量减
    // window.electron.ipcRenderer.on('volumeDown', () => player.setVolume('down'))
    // // 播放模式切换
    // window.electron.ipcRenderer.on('changeMode', (_, mode) => player.togglePlayMode(mode))
    // // 喜欢歌曲
    // window.electron.ipcRenderer.on('toggleLikeSong', async () => {
    //   const dataStore = useDataStore()
    //   const musicStore = useMusicStore()
    //   await toLikeSong(musicStore.playSong, !dataStore.isLikeSong(musicStore.playSong.id))
    // })
    // // 无更新
    // window.electron.ipcRenderer.on('update-not-available', () => {
    //   closeUpdateStatus()
    //   window.$message.success('当前已是最新版本')
    // })
    // // 有更新
    // window.electron.ipcRenderer.on('update-available', (_, info) => {
    //   closeUpdateStatus()
    //   openUpdateApp(info)
    // })
    // // 更新错误
    // window.electron.ipcRenderer.on('update-error', (_, error) => {
    //   console.error('Error updating:', error)
    //   closeUpdateStatus()
    //   window.$message.error('更新过程出现错误')
    // })
  } catch (error) {
    console.log(error)
  }
}
