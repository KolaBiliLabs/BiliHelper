"use strict";
const preload = require("@electron-toolkit/preload");
const electron = require("electron");
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
}
