"use strict";
const node_path = require("node:path");
const utils = require("@electron-toolkit/utils");
const electron = require("electron");
const path = require("path");
const Fastify = require("fastify");
const log = require("electron-log");
require("node:crypto");
require("node:fs/promises");
const icon = path.join(__dirname, "../../resources/icon.png");
const isDev = utils.is.dev;
process.platform === "win32";
process.platform === "darwin";
process.platform === "linux";
const appName = electron.app.getName() || "SPlayer";
Object.assign(console, log.functions);
log.transports.file.level = "info";
log.transports.file.maxSize = 2 * 1024 * 1024;
if (log.transports.ipc)
  log.transports.ipc.level = false;
log.transports.console.useStyles = true;
log.transports.file.format = "{y}-{m}-{d} {h}:{i}:{s}:{ms} {text}";
if (!isDev) {
  log.transports.file.resolvePathFn = () => node_path.join(electron.app.getPath("documents"), "/SPlayer/SPlayer-log.txt");
} else {
  log.transports.file.level = false;
}
log.info("📃 logger initialized");
let webPort;
let servePort;
async function getSafePort() {
  if (webPort && servePort) {
    return { webPort, servePort };
  }
  webPort = 14558;
  servePort = 25884;
  return {
    webPort,
    servePort
  };
}
async function initAppServer() {
  try {
    const fastify = Fastify({
      logger: true
    });
    fastify.get("/api", (request, reply) => {
      reply.send({ hello: "world" });
    });
    const { servePort: servePort2 } = await getSafePort();
    fastify.listen({ port: servePort2 }, (err, address) => {
      if (err) {
        throw err;
      }
      log.info(`Server is now listening on ${address}`);
    });
  } catch (error) {
    log.error("🚫 AppServer failed to start");
    throw error;
  }
}
const WINDOW_MINIMIZE = "win-min";
const WINDOW_MAXIMIZE = "win-max";
const WINDOW_CLOSE = "win-close";
const WINDOW_IS_MAXIMIZED = "win-is-max";
function initIpcMain(mainWindow2) {
  initMainIpcMain(mainWindow2);
}
function initMainIpcMain(win) {
  electron.ipcMain.on(WINDOW_MINIMIZE, () => {
    win.minimize();
  });
  electron.ipcMain.on(WINDOW_MAXIMIZE, () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
    return win.isMaximized();
  });
  electron.ipcMain.on(WINDOW_CLOSE, () => {
    win.close();
  });
  electron.ipcMain.on(WINDOW_IS_MAXIMIZED, () => {
    return win.isMaximized();
  });
}
let tray = null;
let mainWindow$1 = null;
function initTray(win) {
  mainWindow$1 = win;
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
        if (mainWindow$1) {
          mainWindow$1.show();
          mainWindow$1.focus();
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
    if (mainWindow$1) {
      if (mainWindow$1.isVisible()) {
        mainWindow$1.hide();
      } else {
        mainWindow$1.show();
        mainWindow$1.focus();
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
let mainWindow;
electron.app.on("ready", async () => {
  utils.electronApp.setAppUserModelId("com.electron.bili.helper");
  await initAppServer();
  createMainWindow();
  handleAppEvents();
  initTray(mainWindow);
  initIpcMain(mainWindow);
});
function handleAppEvents() {
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window, {});
  });
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
  electron.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      electron.app.quit();
    }
  });
}
function createWindow(options = {}) {
  const defaultOptions = {
    title: appName,
    width: 1280,
    height: 720,
    frame: false,
    center: true,
    // 图标
    icon,
    webPreferences: {
      preload: node_path.join(__dirname, "../preload/index.ts"),
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
      contextIsolation: false
    }
  };
  Object.assign(defaultOptions, options);
  const win = new electron.BrowserWindow(options);
  return win;
}
function createMainWindow() {
  mainWindow = new electron.BrowserWindow({
    width: 1200,
    height: 800,
    minHeight: 800,
    minWidth: 1280,
    // 立即显示窗口
    show: false,
    autoHideMenuBar: true,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: node_path.join(__dirname, "../preload/index.js"),
      sandbox: false
    },
    frame: false
  });
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(node_path.join(__dirname, "../renderer/index.html"));
  }
  return mainWindow;
}
