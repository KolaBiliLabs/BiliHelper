/* eslint-disable node/prefer-global/process */
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import { is } from '@electron-toolkit/utils'
import { app } from 'electron'

// 系统判断
export const isDev = is.dev
export const isWin = process.platform === 'win32'
export const isMac = process.platform === 'darwin'
export const isLinux = process.platform === 'linux'

// 程序名称
export const appName = app.getName() || 'SPlayer'

// 生成唯一ID
export function getFileID(filePath: string): number {
  // SHA-256
  const hash = crypto.createHash('sha256')
  hash.update(filePath)
  const digest = hash.digest('hex')
  // 将哈希值的前 16 位转换为十进制数字
  const uniqueId = Number.parseInt(digest.substring(0, 16), 16)
  return Number(uniqueId.toString().padStart(16, '0'))
}

// 生成文件 MD5
export async function getFileMD5(path: string): Promise<string> {
  const data = await fs.readFile(path)
  const hash = crypto.createHash('md5')
  hash.update(data)
  return hash.digest('hex')
}
