/* eslint-disable node/prefer-global/process */
import type { BrowserWindowConstructorOptions } from 'electron'
import { join } from 'node:path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, shell } from 'electron'
import icon from '../../resources/icon.png?asset'
import initAppServer from '../server'
import { initTray } from './tray'
import { appName, isDev } from './utils'
import { registerWindowControl } from './windowControl'

// 主窗口
let mainWindow: BrowserWindow

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  // 设置应用程序名称
  electronApp.setAppUserModelId('com.electron.bili.helper')

  // 启动主进程服务
  await initAppServer()

  // 创建主窗口
  createMainWindow()

  // 注册窗口控制IPC
  registerWindowControl(mainWindow)
  // 初始化托盘
  initTray(mainWindow)
  // 处理app事件
  handleAppEvents()
})

/**
 *  处理app事件
 */
function handleAppEvents() {
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window, {

    })
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
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

/**
 * 创建窗口
 */
function createWindow(options: BrowserWindowConstructorOptions = {}): BrowserWindow {
  const defaultOptions: BrowserWindowConstructorOptions = {
    title: appName,
    width: 1280,
    height: 720,
    frame: false,
    center: true,
    // 图标
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.ts'),
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
      // 启用上下文隔离
      contextIsolation: false,
    },
  }
  Object.assign(defaultOptions, options)
  const win = new BrowserWindow(options)
  return win
}

/**
 * 创建主窗口
 */
function createMainWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minHeight: 800,
    minWidth: 1280,
    // 立即显示窗口
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
    frame: false,
  })

  if(isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}
