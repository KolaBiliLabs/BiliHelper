import type { BrowserWindow } from 'electron'
import type { MyTray } from './tray'
import axios from 'axios'
import { ipcMain } from 'electron'
import { LIKE_STATUS_CHANGE, PLAY_STATUS_CHANGE, WINDOW_CLOSE, WINDOW_MAXIMIZE, WINDOW_MINIMIZE } from '../../constants/ipcChannels'
import { PLAY_STATUS_PAUSE, PLAY_STATUS_PLAY } from '../../constants/playStatus'

/**
 * 注册窗口控制IPC
 */
export function initIpcMain(mainWindow: BrowserWindow | null, mainTray: MyTray | null) {
  initMainIpc(mainWindow, mainTray)
}

/**
 * 主窗口 ipc 通信
 */
function initMainIpc(win: BrowserWindow | null, tray: MyTray | null) {
  ipcMain.on(WINDOW_MINIMIZE, () => {
    win?.minimize()
  })

  ipcMain.on(WINDOW_MAXIMIZE, () => {
    if (win?.isMaximized()) {
      win.unmaximize()
    } else {
      win?.maximize()
    }
    return win?.isMaximized()
  })

  ipcMain.on(WINDOW_CLOSE, () => {
    win?.close()
  })

  // 音乐播放状态更改
  ipcMain.on(PLAY_STATUS_CHANGE, (_, playStatus: boolean) => {
    tray?.setPlayState(playStatus ? PLAY_STATUS_PLAY : PLAY_STATUS_PAUSE)
  })

  // 喜欢状态切换
  ipcMain.on(LIKE_STATUS_CHANGE, (_, likeStatus: boolean) => {
    tray?.setLikeState(likeStatus)
  })

  // 在主进程中处理网络请求
  ipcMain.handle('http-request', async (_, config) => {
    try {
      const response = await axios(config)

      // 只返回可序列化的数据
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config: {
          url: response.config.url,
          method: response.config.method,
          headers: response.config.headers,
        },
      }
    } catch (error: any) {
    // 处理错误，确保错误对象可序列化
      // eslint-disable-next-line no-throw-literal
      throw {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
      }
    }
  })
}
