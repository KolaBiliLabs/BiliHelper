import type { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      windowControl: {
        minimize: () => Promise<void>
        maximize: () => Promise<boolean>
        close: () => Promise<void>
        isMaximized: () => Promise<boolean>
      }
    }
  }

  interface ImportMetaEnv {
    VITE_SERVER_PORT: string
    VITE_WEB_PORT: string
  }
}
