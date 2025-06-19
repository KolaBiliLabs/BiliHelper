"use strict";
const preload = require("@electron-toolkit/preload");
const electron = require("electron");
const api = {
  // 窗口控制API
  windowControl: {
    minimize: () => electron.ipcRenderer.invoke("window-minimize"),
    maximize: () => electron.ipcRenderer.invoke("window-maximize"),
    close: () => electron.ipcRenderer.invoke("window-close"),
    isMaximized: () => electron.ipcRenderer.invoke("window-is-maximized")
  }
};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.api = api;
}
