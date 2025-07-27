// 日志输出
import { join } from 'node:path'
import { app } from 'electron'
import log from 'electron-log'
import { isDev } from './utils'

// 绑定事件
Object.assign(console, log.functions)

// 日志配置
log.transports.file.level = 'info'
log.transports.file.maxSize = 2 * 1024 * 1024 // 2M
if (log.transports.ipc)
  log.transports.ipc.level = false

// 控制台输出
log.transports.console.useStyles = true

// 文件输出
log.transports.file.format = '{y}-{m}-{d} {h}:{i}:{s}:{ms} {text}'

// 本地输出
if (!isDev) {
  log.transports.file.resolvePathFn = () =>
    join(app.getPath('documents'), '/colaHelper/colaHelper-log.txt')
} else {
  log.transports.file.level = false
}

log.info('📃 logger initialized')

export default log
