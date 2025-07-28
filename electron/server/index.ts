import type { App, BrowserWindow } from 'electron'
import * as http from 'node:http' // Socket.IO 可以直接依附于 http.Server
import { ipcMain } from 'electron'
import { Server } from 'socket.io'
import log from '../main/logger'

const SERVER_PORT = 25885 // 定义服务器监听端口
// eslint-disable-next-line import/no-mutable-exports
export let io: Server | null = null

export function startSocketIOServer(app: App, mainWindow: BrowserWindow): void {
  // 创建一个基本的 HTTP 服务器，Socket.IO 将依附于它
  const httpServer = http.createServer((_req, res) => {
    // 尽管 Socket.IO 依附于 HTTP 服务器，但对于浏览器插件的通信，我们主要通过 Socket.IO
    // 这里可以设置一些基本的 HTTP 响应，但通常不用于主通信
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('Electron Socket.IO Server Running')
  })

  io = new Server(httpServer, {
    cors: {
      origin: '*', // 允许所有来源的浏览器插件连接，或者指定你的插件的 origin
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    log.info(`一个新的浏览器插件已连接: ${socket.id}`)

    // 监听来自浏览器插件的 'sendDataToElectron' 事件
    socket.on('sendDataToElectron', (data: any) => {
      log.info(`收到来自插件 (${socket.id}) 的数据:`, data)

      // 在这里处理来自浏览器插件的数据
      // 例如：调用 Bilibili API，或将数据转发到 Electron 的渲染进程
      ipcMain.emit('dataFromPlugin', data)
      mainWindow.webContents.send('dataFromPlugin', data)
      log.info('数据已发送到renderer', data)

      // 向浏览器插件发送确认消息
      socket.emit('dataReceivedAck', { status: 'success', message: 'Electron 已收到您的数据', data })
    })

    // 监听 'disconnect' 事件
    socket.on('disconnect', () => {
      log.info(`浏览器插件已断开连接: ${socket.id}`)
    })

    // 监听错误
    socket.on('error', (err: Error) => {
      log.error(`Socket.IO 错误 (${socket.id}):`, err.message)
    })
  })

  httpServer.listen(SERVER_PORT, () => {
    log.info(`Socket.IO 服务器正在监听端口 ${SERVER_PORT}`)
  })

  // 在应用退出前关闭 Socket.IO 服务器
  app.on('before-quit', () => {
    if (io) {
      log.info('关闭 Socket.IO 服务器...')
      io.close(() => {
        log.log('Socket.IO 服务器已关闭')
      })
    }
  })
}
