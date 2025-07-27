/* eslint-disable node/prefer-global/process */
import type { MainEnv } from './env'
import path, { resolve } from 'node:path'
// @ts-ignore it's a vite plugin, don't have types
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
// @ts-ignore it's a vite plugin, don't have types
import vueJsx from '@vitejs/plugin-vue-jsx'
import { bytecodePlugin, defineConfig, externalizeDepsPlugin, loadEnv } from 'electron-vite'
import vueDevTools from 'vite-plugin-vue-devtools'

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
      publicDir: resolve(__dirname, 'public'),
      build: {
        rollupOptions: {
          input: {
            index: resolve(__dirname, 'electron/main/index.ts'),
          },
        },
      },
      resolve: {
        alias: {
          '@constants': path.resolve(__dirname, 'constants'),
        },
      },
    },
    preload: {
      plugins: [externalizeDepsPlugin(), bytecodePlugin()],
      build: {
        rollupOptions: {
          input: {
            index: resolve(__dirname, 'electron/preload/index.ts'),
          },
        },
      },
    },
    renderer: {
      root: '.',
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src'),
          '@constants': path.resolve(__dirname, 'constants'),
        },
      },
      plugins: [
        vue(),
        vueJsx(),
        tailwindcss(),
        vueDevTools(),
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
        rollupOptions: {
          input: {
            index: resolve(__dirname, 'index.html'),
          },
        },
      },
    },
  }
})
