import type { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
  }

  interface ImportMetaEnv {
    VITE_SERVER_PORT: string
    VITE_WEB_PORT: string
  }
}
