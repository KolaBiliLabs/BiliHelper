import type { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    electronAPI: {
      httpRequest: (config: any) => Promise<any>
    }
  }

  interface ImportMetaEnv {
    VITE_SERVER_PORT: string
    VITE_WEB_PORT: string
  }
}

export {}
