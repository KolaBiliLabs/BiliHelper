/* eslint-disable node/prefer-global/process */
import type { BrowserWindowConstructorOptions } from 'electron'
import { join } from 'node:path'
import { is } from '@electron-toolkit/utils'
import { BrowserWindow, shell } from 'electron'
import icon from '../../resources/icon.png?asset'
import { appName, isDev } from './utils'

/**
 * 创建主窗口
 */
export function createMainWindow() {
  // Create the browser window.
  const mainWindow = createWindow({
    width: 1200,
    height: 800,
    minHeight: 800,
    minWidth: 1280,
    // 立即显示窗口
    show: false,
    frame: false,
    transparent: true,
    ...(process.platform === 'linux' ? { icon } : {}),
  })

  if (isDev) {
    // mainWindow.webContents.openDevTools()
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
    // mainWindow.loadFile(join(__dirname, '../../index.html'))
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
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
