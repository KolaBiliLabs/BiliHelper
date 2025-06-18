/* eslint-disable node/prefer-global/process */
// electron/tray.ts
import type { BrowserWindow } from 'electron'
import { join } from 'node:path'
import { app, Menu, Tray } from 'electron'

let tray: Tray | null = null // 定义一个 Tray 实例
let mainWindow: BrowserWindow | null = null // 需要传入主窗口实例

// 初始化托盘功能
export function initTray(win: BrowserWindow) {
  mainWindow = win // 保存主窗口实例

  // 根据操作系统选择图标路径
  const iconPath = join(__dirname, '../../resources', process.platform === 'win32' ? 'icon.ico' : 'icon.png', // 假设你有 icon.ico 和 icon.png 在 resources 目录下
  )

  tray = new Tray(iconPath)

  // 设置托盘提示文本
  tray.setToolTip('我的 Electron 应用')

  // 创建托盘菜单
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示窗口',
      click: () => {
        if (mainWindow) {
          mainWindow.show()
          mainWindow.focus()
        } else {
          // 如果窗口已经关闭，可以考虑重新创建，但这通常在主进程的 createWindow 逻辑中处理
          // 对于这里，我们假设 mainWindow 总是被维护的
          console.warn('Main window is null when trying to show from tray.')
        }
      },
    },
    { type: 'separator' }, // 分隔符
    {
      label: '退出',
      click: () => {
        // 设置一个标志，通知 app.on('close') 不再隐藏窗口，而是真正退出
        (app as any).quitting = true // Electron Types 不直接包含 'quitting'，这里进行类型断言
        app.quit()
      },
    },
  ])

  // 设置托盘的上下文菜单（右键点击菜单）
  tray.setContextMenu(contextMenu)

  // 监听托盘点击事件 (左键点击)
  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide() // 如果窗口可见，则隐藏
      } else {
        mainWindow.show() // 如果窗口隐藏，则显示
        mainWindow.focus() // 聚焦窗口
      }
    } else {
      // 可以在这里重新创建窗口，或者在主进程的 app.on('activate') 中处理
      console.warn('Main window is null when trying to click tray.')
    }
  })

  // 在应用即将退出时，确保托盘也被销毁
  app.on('before-quit', () => {
    if (tray) {
      tray.destroy()
      tray = null // 清空引用
    }
  })
}

// 导出销毁托盘的函数（可选，initTray中已经处理了before-quit）
export function destroyTray() {
  if (tray) {
    tray.destroy()
    tray = null
  }
}
