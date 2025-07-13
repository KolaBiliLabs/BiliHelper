import type { BrowserWindow } from 'electron'
// @ts-expect-error don't known why
import { WINDOW_CLOSE, WINDOW_IS_MAXIMIZED, WINDOW_MAXIMIZE, WINDOW_MINIMIZE } from '@constants/win'
import axios from 'axios'
import { ipcMain } from 'electron'

/**
 * 注册窗口控制IPC
 */
export function initIpcMain(mainWindow: BrowserWindow) {
  initMainIpcMain(mainWindow)
}

/**
 * 主窗口 ipc 通信
 */
function initMainIpcMain(win: BrowserWindow) {
  ipcMain.on(WINDOW_MINIMIZE, () => {
    win.minimize()
  })

  ipcMain.on(WINDOW_MAXIMIZE, () => {
    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
    return win.isMaximized()
  })

  ipcMain.on(WINDOW_CLOSE, () => {
    win.close()
  })

  ipcMain.on(WINDOW_IS_MAXIMIZED, () => {
    return win.isMaximized()
  })

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date()).toLocaleString())
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
