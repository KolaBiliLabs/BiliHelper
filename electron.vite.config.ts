/* eslint-disable node/prefer-global/process */
import type { MainEnv } from './env'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig, externalizeDepsPlugin, loadEnv } from 'electron-vite'

export default defineConfig(({ command, mode }) => {
  const getEnv = (name: keyof MainEnv): string => {
    return loadEnv(mode, process.cwd())[name]
  }
  console.log(command)
  // 获取端口
  const webPort: number = Number(getEnv('VITE_WEB_PORT') || 14558)
  const servePort: number = Number(getEnv('VITE_SERVER_PORT') || 25884)
  return {
    main: {
      plugins: [externalizeDepsPlugin()],
    },
    preload: {
      plugins: [externalizeDepsPlugin()],
    },
    renderer: {
      resolve: {
        alias: {
          '@renderer': resolve('src/renderer/src'),
          '@': resolve('src/renderer/src'),
          '@constants': resolve('src/constants'),
        },
      },
      plugins: [
        vue(),
        tailwindcss(),
      ],
      server: {
        port: webPort,
        // 代理
        proxy: {
          '/api': {
            target: `http://localhost:${servePort}`,
            changeOrigin: true,
            rewrite: path => path.replace(/^\/api/, '/api/'),
          },
        },
      },
    },
  }
})
