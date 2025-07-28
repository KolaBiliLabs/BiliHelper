/* eslint-disable node/prefer-global/process */
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow } from 'electron'
import { startSocketIOServer } from '../server'
import { initIpcMain } from './ipcMain'
import log from './logger'
import { initTray } from './tray'
import { createMainWindow } from './windows'

// [ ]: 应用关闭时选择后台运行或直接退出
// [ ]: 快捷键关闭应用时，应用不完全退出

log.info('🦄 写在 ready 前')

class MainProcess {
  // 主窗口
  mainWindow?: BrowserWindow = undefined

  constructor() {
    // 单例锁
    if (!app.requestSingleInstanceLock()) {
      log.error('❌ There is already a program running and this process is terminated')
      app.quit()
      process.exit(0)
    } else {
      this.showWindow()
    }

    app.on('ready', async () => {
      log.info('🚀 Application Process Startup')
      // 设置应用程序名称
      electronApp.setAppUserModelId('com.electron.bili.helper')

      // 创建主窗口
      this.mainWindow = createMainWindow()

      // 启动主进程服务
      startSocketIOServer(app, this.mainWindow)

      // 处理app事件
      this.handleAppEvents()

      // 初始化托盘
      initTray(this.mainWindow)

      // 注册窗口控制IPC
      initIpcMain(this.mainWindow)
    })
  }

  /**
   * 显示窗口
   */
  showWindow() {
    if (this.mainWindow) {
      this.mainWindow.show()
      if (this.mainWindow.isMinimized()) {
        this.mainWindow.restore()
      }
      this.mainWindow.focus()
    }
  }

  /**
   *  处理app事件
   */
  handleAppEvents() {
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window, {
      })
    })

    app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) {
        this.mainWindow = createMainWindow()
      }
    })

    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bar to stay active until the user quits
    // explicitly with Cmd + Q.
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })
  }
}

export default new MainProcess()
