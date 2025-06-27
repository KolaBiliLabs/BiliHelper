/* eslint-disable node/prefer-global/process */
import type { MainEnv } from './env'
import { resolve } from 'node:path'
// @ts-ignore it's a vite plugin, don't have types
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
      build: {
        lib: {
          entry: resolve(__dirname, 'electron/main/index.ts'),
          name: 'main',
        },
      },
      plugins: [externalizeDepsPlugin()],
    },
    preload: {
      build: {
        lib: {
          entry: resolve(__dirname, 'electron/preload/index.ts'),
          name: 'preload',
        },
      },
      plugins: [externalizeDepsPlugin()],
    },
    renderer: {
      root: '.',
      resolve: {
        alias: {
          '@': resolve('src'),
          '@constants': resolve('constants'),
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
            rewrite(path) {
              return path.replace(/^\/api/, '/api/')
            },
          },
        },
      },
      build: {
        outDir: 'dist/renderer',
        emptyOutDir: true,
        rollupOptions: {
          input: {
            index: resolve(__dirname, 'index.html'),
          },
        },
      },
    },
  }
})
