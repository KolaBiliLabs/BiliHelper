/* eslint-disable node/prefer-global/process */
import type { BrowserWindowConstructorOptions } from 'electron'
import type { MyTray } from './tray'
import { join } from 'node:path'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, shell } from 'electron'
import icon from '../../resources/icon.png?asset'
import { startSocketIOServer } from '../server'
import { initIpcMain } from './ipcMain'
import log from './logger'
import { initTray } from './tray'
import { appName, isDev, isMac } from './utils'

// 屏蔽报错
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

// [ ]: 应用关闭时选择后台运行或直接退出
// [ ]: 快捷键关闭应用时，应用不完全退出

log.info('🦄 写在 ready 前')

class MainProcess {
  // 主窗口
  private mainWindow: BrowserWindow | null = null
  private mainTray: MyTray | null = null
  private isQuit: boolean = false

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
      this.createMainWindow()

      // 启动主进程服务
      startSocketIOServer(app, this.mainWindow)

      // 处理app事件
      this.handleAppEvents()
      this.handleWindowEvents()

      // 初始化托盘
      this.mainTray = initTray(this.mainWindow!)

      // 注册窗口控制IPC
      initIpcMain(this.mainWindow, this.mainTray)
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
   * 处理app事件
   */
  handleAppEvents() {
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window, {
      })
    })

    // 应用被激活 especially macos
    app.on('activate', () => {
      if (this.mainWindow) { // 检查 mainWindow 是否已存在（而不是被销毁）
        if (this.mainWindow.isDestroyed()) {
          // 如果窗口被销毁了（比如通过 app.quit()），则重新创建
          this.createMainWindow()
        } else if (!this.mainWindow.isVisible()) {
          // 如果窗口存在但不可见（被 hide() 或最小化），则显示并聚焦
          this.mainWindow.show()
          this.mainWindow.focus() // 确保窗口获得焦点
          console.log('通过 Dock 或 Cmd+Tab 激活，窗口已显示并聚焦。')
        } else {
          // 如果窗口已经可见，只是简单地把它带到最前面并聚焦
          this.mainWindow.focus()
          console.log('通过 Dock 或 Cmd+Tab 激活，窗口已聚焦。')
        }
      } else {
        // 第一次启动应用，或者 mainWindow 被设置为 null 后，重新创建
        this.createMainWindow()
      }
    })

    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bar to stay active until the user quits
    // explicitly with Cmd + Q.
    // 窗口被关闭时
    app.on('window-all-closed', () => {
      if (!isMac) {
        app.quit()
      }
      this.mainWindow = null
    })

    // 退出前
    app.on('before-quit', () => {
      this.isQuit = true
    })

    // 根据开发或生产环境加载不同的URL
    if (isDev) {
      // 在开发模式下打开开发者工具
      // this.mainWindow?.webContents.openDevTools()
      // console.log('Electron 处于开发模式，DevTools 已开启。')
    } else {
    // 在生产模式下关闭开发者工具
      this.mainWindow?.webContents.closeDevTools() // 明确关闭
      // 或者更简洁地，直接不调用 openDevTools()
      console.log('Electron 处于生产模式，DevTools 已禁用。')
    }
  }

  /**
   * 处理 window 事件
   */
  handleWindowEvents() {
    // 窗口即将显示
    this.mainWindow?.on('ready-to-show', () => {
      if (!this.mainWindow) {
        return
      }
      log.info('🚀 窗口即将显示')
    })

    // 窗口关闭
    this.mainWindow?.on('close', (event) => {
      event.preventDefault()
      if (this.isQuit) {
        app.exit()
      } else {
        this.mainWindow?.hide()
      }
    })
  }

  /**
   * 创建主窗口
   */
  createMainWindow() {
    const mainWindow = this.createWindow({
      width: 1022,
      height: 670,
      minWidth: 1022,
      minHeight: 670,
      // 立即显示窗口
      show: false,
      frame: false,
      transparent: true,
      ...(process.platform === 'linux' ? { icon } : {}),
    })
    this.mainWindow = mainWindow

    mainWindow.on('ready-to-show', () => {
      mainWindow.show()
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (isDev && process.env.ELECTRON_RENDERER_URL) {
      mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
    } else {
      mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }

    return mainWindow
  }

  /**
   * 创建窗口
   */
  createWindow(options: BrowserWindowConstructorOptions = {}): BrowserWindow {
    const defaultOptions: BrowserWindowConstructorOptions = {
      title: appName,
      width: 1200,
      height: 800,
      frame: true,
      center: true,
      // 图标
      icon,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        // 禁用渲染器沙盒
        sandbox: false,
        // 禁用同源策略
        webSecurity: false,
        // 允许 HTTP
        allowRunningInsecureContent: true,
        // 禁用拼写检查
        spellcheck: false,
        // 启用 Node.js
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
      },
    }
    const win = new BrowserWindow({ ...defaultOptions, ...options })
    return win
  }
}

export default new MainProcess()
