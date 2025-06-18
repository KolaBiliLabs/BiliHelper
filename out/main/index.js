"use strict";
const node_path = require("node:path");
const utils = require("@electron-toolkit/utils");
const electron = require("electron");
const path = require("path");
const icon = path.join(__dirname, "../../resources/icon.png");
let tray = null;
let mainWindow = null;
function initTray(win) {
  mainWindow = win;
  const iconPath = node_path.join(
    __dirname,
    "../../resources",
    process.platform === "win32" ? "icon.ico" : "icon.png"
    // 假设你有 icon.ico 和 icon.png 在 resources 目录下
  );
  tray = new electron.Tray(iconPath);
  tray.setToolTip("我的 Electron 应用");
  const contextMenu = electron.Menu.buildFromTemplate([
    {
      label: "显示窗口",
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        } else {
          console.warn("Main window is null when trying to show from tray.");
        }
      }
    },
    { type: "separator" },
    // 分隔符
    {
      label: "退出",
      click: () => {
        electron.app.quitting = true;
        electron.app.quit();
      }
    }
  ]);
  tray.setContextMenu(contextMenu);
  tray.on("click", () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    } else {
      console.warn("Main window is null when trying to click tray.");
    }
  });
  electron.app.on("before-quit", () => {
    if (tray) {
      tray.destroy();
      tray = null;
    }
  });
}
function createWindow() {
  const mainWindow2 = new electron.BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: node_path.join(__dirname, "../preload/index.js"),
      sandbox: false
    },
    titleBarStyle: "hidden",
    ...process.platform !== "darwin" ? { titleBarOverlay: true } : {}
  });
  mainWindow2.on("ready-to-show", () => {
    mainWindow2.show();
  });
  mainWindow2.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow2.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow2.loadFile(node_path.join(__dirname, "../renderer/index.html"));
  }
  return mainWindow2;
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  electron.ipcMain.on("ping", () => console.log("pong"));
  const win = createWindow();
  initTray(win);
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
