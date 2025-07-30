import { PLAY_STATUS_CHANGE } from '@constants/ipcChannels'

/**
 * 用于应用初始化时的一些操作
 */
export function init() {
  console.log('--------- start init 应用初始化 ---------')

  // 初始化时，将播放状态初始化为未播放
  window.electron.ipcRenderer.send(PLAY_STATUS_CHANGE, false)

  console.log('--------- end init 应用初始化 ---------')
}
