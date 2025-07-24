import { WINDOW_CLOSE, WINDOW_MAXIMIZE, WINDOW_MINIMIZE } from '@constants/win'

export function winMin() {
  return window.electron.ipcRenderer.send(WINDOW_MINIMIZE)
}

export function winMax() {
  return window.electron.ipcRenderer.send(WINDOW_MAXIMIZE)
}

export function winClose() {
  return window.electron.ipcRenderer.send(WINDOW_CLOSE)
}
