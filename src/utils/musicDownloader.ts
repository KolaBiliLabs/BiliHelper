/* eslint-disable node/prefer-global/buffer */
/* eslint-disable node/prefer-global/process */
import path from 'node:path'
import ffmpegStatic from 'ffmpeg-static'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs-extra'
import { parseFile } from 'music-metadata'
import { nanoid } from 'nanoid'
import fetch from 'node-fetch'

// 设置 ffmpeg 路径
ffmpeg.setFfmpegPath(ffmpegStatic!)

export interface IMusicInfo {
  id: string
  title: string
  artist: string
  album?: string
  duration: number
  filePath: string
  fileSize: number
  downloadTime: string
  tags?: Record<string, any>
}

export interface IDownloadOptions {
  startTime?: number // 开始时间（秒）
  endTime?: number // 结束时间（秒）
  quality?: 'low' | 'medium' | 'high' // 音质
  format?: 'mp3' | 'flac' | 'wav' // 格式
}

export class MusicDownloader {
  private downloadDir: string
  private dbPath: string

  constructor() {
    // 设置下载目录
    this.downloadDir = path.join(process.env.APPDATA || process.env.HOME || '', '.kolaBiliHelper', 'music')
    this.dbPath = path.join(this.downloadDir, 'music.db')
    this.initDirectories()
  }

  private async initDirectories() {
    await fs.ensureDir(this.downloadDir)
  }

  /**
   * 下载音乐文件
   */
  async downloadMusic(
    url: string,
    title: string,
    artist: string,
    album?: string,
    options: IDownloadOptions = {},
  ): Promise<IMusicInfo> {
    const musicId = nanoid()
    const fileName = `${musicId}.${options.format || 'mp3'}`
    const filePath = path.join(this.downloadDir, fileName)

    try {
      // 下载文件
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`下载失败: ${response.statusText}`)
      }

      const buffer = await response.buffer()

      // 如果需要裁剪，使用 ffmpeg 处理
      if (options.startTime !== undefined || options.endTime !== undefined) {
        await this.processAudio(buffer, filePath, options)
      } else {
        // 直接保存文件
        await fs.writeFile(filePath, buffer)
      }

      // 获取文件信息
      const stats = await fs.stat(filePath)
      const metadata = await this.extractMetadata(filePath)

      const musicInfo: IMusicInfo = {
        id: musicId,
        title,
        artist,
        album,
        duration: metadata.common.duration || 0,
        filePath,
        fileSize: stats.size,
        downloadTime: new Date().toISOString(),
        tags: metadata.common,
      }

      // 保存到数据库
      await this.saveToDatabase(musicInfo)

      return musicInfo
    } catch (error) {
      // 清理失败的文件
      await fs.remove(filePath).catch(() => {})
      throw error
    }
  }

  /**
   * 使用 ffmpeg 处理音频
   */
  private async processAudio(
    buffer: Buffer,
    outputPath: string,
    options: IDownloadOptions,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const tempPath = `${outputPath}.temp`

      // 先保存临时文件
      fs.writeFileSync(tempPath, buffer)

      let command = ffmpeg(tempPath)

      // 设置时间裁剪
      if (options.startTime !== undefined) {
        command = command.inputOptions([`-ss ${options.startTime}`])
      }
      if (options.endTime !== undefined) {
        command = command.inputOptions([`-t ${options.endTime - (options.startTime || 0)}`])
      }

      // 设置音质
      const qualityMap = {
        low: { bitrate: '128k', sampleRate: '22050' },
        medium: { bitrate: '192k', sampleRate: '44100' },
        high: { bitrate: '320k', sampleRate: '48000' },
      }

      const quality = qualityMap[options.quality || 'medium']
      command = command
        .audioBitrate(quality.bitrate)
        .audioFrequency(Number.parseInt(quality.sampleRate))

      // 设置输出格式
      const formatMap = {
        mp3: 'mp3',
        flac: 'flac',
        wav: 'wav',
      }
      command = command.toFormat(formatMap[options.format || 'mp3'])

      command
        .on('end', async () => {
          // 删除临时文件
          await fs.remove(tempPath).catch(() => {})
          resolve()
        })
        .on('error', async (err) => {
          // 清理文件
          await fs.remove(tempPath).catch(() => {})
          await fs.remove(outputPath).catch(() => {})
          reject(err)
        })
        .save(outputPath)
    })
  }

  /**
   * 提取音频元数据
   */
  private async extractMetadata(filePath: string) {
    try {
      return await parseFile(filePath)
    } catch (error) {
      console.warn('无法提取元数据:', error)
      return { duration: 0, common: {} }
    }
  }

  /**
   * 保存到数据库
   */
  private async saveToDatabase(musicInfo: IMusicInfo) {
    // 这里会调用数据库管理器保存信息
    // 具体实现见下面的 DatabaseManager

    console.log('musicInfo', musicInfo)
  }

  /**
   * 获取下载目录
   */
  getDownloadDir(): string {
    return this.downloadDir
  }

  /**
   * 清理下载目录
   */
  async cleanupDownloads(): Promise<void> {
    const files = await fs.readdir(this.downloadDir)
    for (const file of files) {
      if (file !== 'music.db') {
        await fs.remove(path.join(this.downloadDir, file))
      }
    }
  }
}
