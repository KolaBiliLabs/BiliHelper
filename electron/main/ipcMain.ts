import type { BrowserWindow } from 'electron'
import { ipcMain } from 'electron'
import { WINDOW_CLOSE, WINDOW_IS_MAXIMIZED, WINDOW_MAXIMIZE, WINDOW_MINIMIZE } from '../../constants/win'

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
}
