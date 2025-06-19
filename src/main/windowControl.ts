import type { BrowserWindow } from 'electron'
import { ipcMain } from 'electron'

export function registerWindowControl(win: BrowserWindow) {
  ipcMain.handle('window-minimize', () => {
    win.minimize()
  })

  ipcMain.handle('window-maximize', () => {
    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
    return win.isMaximized()
  })

  ipcMain.handle('window-close', () => {
    win.close()
  })

  ipcMain.handle('window-is-maximized', () => {
    return win.isMaximized()
  })
}
