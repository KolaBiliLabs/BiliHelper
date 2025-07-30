import type { BrowserWindow, MenuItemConstructorOptions } from 'electron'
import type { PLAY_STATUS_LOADING } from '../../constants/playStatus'
import { join } from 'node:path'
import { app, Menu, nativeImage, Tray } from 'electron'
import { LIKE_STATUS_CHANGE, PLAY_NEXT, PLAY_PREV } from '../../constants/ipcChannels'
import { PLAY_STATUS_PAUSE, PLAY_STATUS_PLAY } from '../../constants/playStatus'
import log from './logger'
import { appName, isWin } from './utils'

type PlayState = typeof PLAY_STATUS_PLAY | typeof PLAY_STATUS_PAUSE | typeof PLAY_STATUS_LOADING

// 全局数据
let playState: PlayState = 'pause'
let likeSong: boolean = false

// 托盘图标
function trayIcon(filename: string) {
  return nativeImage.createFromPath(join(__dirname, `../../resources/${filename}`))
}

function isPause() {
  return playState === PLAY_STATUS_PAUSE
}

function createTrayMenu(mainWindow: BrowserWindow): MenuItemConstructorOptions[] {
  const showIcon = (iconName: string) => {
    return trayIcon(`tray/${iconName}.png`).resize({
      width: 16,
      height: 16,
    })
  }

  const menu: MenuItemConstructorOptions[] = [
    {
      label: 'toggleClient',
      click: () => {
        console.log('-------------------- > toggle client from tray')
      },
    },

    { type: 'separator' }, // 分隔符
    {
      id: 'toggleLikeSong',
      label: likeSong ? '从我喜欢中移除' : '添加到我喜欢',
      icon: showIcon(likeSong ? 'like' : 'unlike'),
      click: () => mainWindow.webContents.send(LIKE_STATUS_CHANGE),
    },

    { type: 'separator' }, // 分隔符
    {
      label: '上一首',
      icon: showIcon('prev'),
      click: () => {
        console.log('------------ > 上一首 playPrev from tray')
        mainWindow.webContents.send(PLAY_PREV)
      },
    },
    {
      id: 'playOrPause',
      label: isPause() ? '播放' : '暂停',
      icon: showIcon(isPause() ? PLAY_STATUS_PLAY : PLAY_STATUS_PAUSE),
      click: () => {
        console.log('------------ > 播放或暂停 playOrPause from tray')
        mainWindow.webContents.send(isPause() ? PLAY_STATUS_PLAY : PLAY_STATUS_PAUSE)
      },
    },
    {
      id: 'playNext',
      label: '下一曲',
      icon: showIcon('next'),
      click: () => {
        console.log('------------ > 下一首 playNext from tray')
        mainWindow.webContents.send(PLAY_NEXT)
      },
    },

    { type: 'separator' }, // 分隔符
    {
      id: 'exit',
      label: '退出',
      icon: showIcon('power'),
      click: () => {
        mainWindow.close()
        app.quit()
      },
    },
  ]

  return menu
}

export class MyTray {
  // 窗口
  private _win: BrowserWindow
  // 托盘
  private _tray: Tray
  // 菜单
  private _menu: MenuItemConstructorOptions[]
  private _contextMenu: Menu

  constructor(mainWindow: BrowserWindow) {
    // 托盘图标
    const icon = trayIcon(isWin ? 'icon.ico' : 'icon@16.png').resize({
      height: 16,
      width: 16,
    })
    // 初始化数据
    this._win = mainWindow
    this._tray = new Tray(icon)
    this._menu = createTrayMenu(this._win)
    this._contextMenu = Menu.buildFromTemplate(this._menu)

    // 初始化事件
    this.initTrayMenu()
    this.initEvents()
    this.setTitle(appName)
  }

  initEvents() {
    // 点击
    this._tray.on('click', () => {
      this._win.show()
      this._win.focus()
    })

    // 在应用即将退出时，确保托盘也被销毁
    app.on('before-quit', () => {
      this._tray.destroy()
    })
  }

  /**
   * 设置托盘标题
   */
  setTitle(title: string) {
    // this._tray.setTitle(title)
    this._tray.setToolTip(title)
  }

  /**
   * 初始化托盘菜单
   */
  initTrayMenu() {
    this._menu = createTrayMenu(this._win)
    this._contextMenu = Menu.buildFromTemplate(this._menu)
    this._tray.setContextMenu(this._contextMenu)
  }

  // 销毁托盘的函数（可选，initTray中已经处理了before-quit）
  destroyTray() {
    this._tray.destroy()
  }

  /**
   * 切换窗口显隐
   */
  toggleWindow() {
    if (this._win.isVisible()) {
      this._win.hide() // 如果窗口可见，则隐藏
    } else {
      this._win.show() // 如果窗口隐藏，则显示
      this._win.focus() // 聚焦窗口
    }
  }

  // 设置播放状态
  setPlayState(state: PlayState) {
    playState = state
    // 更新菜单
    this.initTrayMenu()
  }

  // 设置喜欢状态
  setLikeState(like: boolean) {
    likeSong = like
    // 更新菜单
    this.initTrayMenu()
  }
}

export function initTray(mainWindow: BrowserWindow) {
  try {
    log.info('🚀 Tray Process Startup')
    return new MyTray(mainWindow)
  } catch (error) {
    log.error('❌ Tray Process Error', error)
    return null
  }
}
