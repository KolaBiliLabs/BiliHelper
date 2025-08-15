/* eslint-disable node/prefer-global/process */
/* eslint-disable node/prefer-global/buffer */
import path from 'node:path'
import ffmpegStatic from 'ffmpeg-static'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs-extra'
import { parseFile } from 'music-metadata'
import { nanoid } from 'nanoid'

// 设置 ffmpeg 路径
ffmpeg.setFfmpegPath(ffmpegStatic!)

export interface IAudioTrimOptions {
  startTime: number // 开始时间（秒）
  endTime: number // 结束时间（秒）
  format?: 'mp3' | 'flac' | 'wav' | 'aac' | 'ogg' // 输出格式
  quality?: 'low' | 'medium' | 'high' // 音质
  fadeIn?: number // 淡入时间（秒）
  fadeOut?: number // 淡出时间（秒）
  normalize?: boolean // 是否标准化音量
}

export interface IAudioInfo {
  duration: number
  format: string
  bitrate: number
  sampleRate: number
  channels: number
  fileSize: number
}

export interface ITrimResult {
  id: string
  originalPath: string
  trimmedPath: string
  startTime: number
  endTime: number
  duration: number
  format: string
  fileSize: number
  audioInfo: IAudioInfo
}

export class AudioTrimmer {
  private tempDir: string
  private outputDir: string

  constructor() {
    // 设置临时目录和输出目录
    const baseDir = path.join(process.env.APPDATA || process.env.HOME || '', '.kolaBiliHelper')
    this.tempDir = path.join(baseDir, 'temp')
    this.outputDir = path.join(baseDir, 'trimmed')
    this.initDirectories()
  }

  private async initDirectories() {
    await fs.ensureDir(this.tempDir)
    await fs.ensureDir(this.outputDir)
  }

  /**
   * 裁剪音频文件
   */
  async trimAudio(
    inputPath: string,
    options: IAudioTrimOptions,
  ): Promise<ITrimResult> {
    const trimId = nanoid()
    const outputFormat = options.format || 'mp3'
    const outputFileName = `${trimId}.${outputFormat}`
    const outputPath = path.join(this.outputDir, outputFileName)

    try {
      // 获取原始音频信息
      const originalInfo = await this.getAudioInfo(inputPath)

      // 验证时间参数
      this.validateTimeOptions(options, originalInfo.duration)

      // 执行裁剪
      await this.processTrim(inputPath, outputPath, options)

      // 获取裁剪后的音频信息
      const trimmedInfo = await this.getAudioInfo(outputPath)
      const stats = await fs.stat(outputPath)

      const result: ITrimResult = {
        id: trimId,
        originalPath: inputPath,
        trimmedPath: outputPath,
        startTime: options.startTime,
        endTime: options.endTime,
        duration: options.endTime - options.startTime,
        format: outputFormat,
        fileSize: stats.size,
        audioInfo: trimmedInfo,
      }

      return result
    } catch (error) {
      // 清理失败的文件
      await fs.remove(outputPath).catch(() => {})
      throw error
    }
  }

  /**
   * 裁剪音频流（从 URL 或 Buffer）
   */
  async trimAudioStream(
    inputBuffer: Buffer,
    options: IAudioTrimOptions,
  ): Promise<ITrimResult> {
    const trimId = nanoid()
    const outputFormat = options.format || 'mp3'
    const tempFileName = `${trimId}_temp.${this.detectFormat(inputBuffer)}`
    const outputFileName = `${trimId}.${outputFormat}`

    const tempPath = path.join(this.tempDir, tempFileName)
    const outputPath = path.join(this.outputDir, outputFileName)

    try {
      // 保存临时文件
      await fs.writeFile(tempPath, inputBuffer)

      // 获取原始音频信息
      const originalInfo = await this.getAudioInfo(tempPath)

      // 验证时间参数
      this.validateTimeOptions(options, originalInfo.duration)

      // 执行裁剪
      await this.processTrim(tempPath, outputPath, options)

      // 获取裁剪后的音频信息
      const trimmedInfo = await this.getAudioInfo(outputPath)
      const stats = await fs.stat(outputPath)

      const result: ITrimResult = {
        id: trimId,
        originalPath: tempPath,
        trimmedPath: outputPath,
        startTime: options.startTime,
        endTime: options.endTime,
        duration: options.endTime - options.startTime,
        format: outputFormat,
        fileSize: stats.size,
        audioInfo: trimmedInfo,
      }

      // 清理临时文件
      await fs.remove(tempPath)

      return result
    } catch (error) {
      // 清理失败的文件
      await fs.remove(tempPath).catch(() => {})
      await fs.remove(outputPath).catch(() => {})
      throw error
    }
  }

  /**
   * 执行音频裁剪处理
   */
  private async processTrim(
    inputPath: string,
    outputPath: string,
    options: IAudioTrimOptions,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      let command = ffmpeg(inputPath)

      // 设置时间裁剪
      command = command.inputOptions([`-ss ${options.startTime}`])
      const duration = options.endTime - options.startTime
      command = command.inputOptions([`-t ${duration}`])

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

      // 设置淡入淡出效果
      if (options.fadeIn && options.fadeIn > 0) {
        command = command.audioFilters(`afade=t=in:st=0:d=${options.fadeIn}`)
      }
      if (options.fadeOut && options.fadeOut > 0) {
        const fadeOutStart = duration - options.fadeOut
        command = command.audioFilters(`afade=t=out:st=${fadeOutStart}:d=${options.fadeOut}`)
      }

      // 音量标准化
      if (options.normalize) {
        command = command.audioFilters('loudnorm')
      }

      // 设置输出格式
      const formatMap = {
        mp3: 'mp3',
        flac: 'flac',
        wav: 'wav',
        aac: 'aac',
        ogg: 'ogg',
      }
      command = command.toFormat(formatMap[options.format || 'mp3'])

      command
        .on('start', (commandLine) => {
          console.log('FFmpeg 命令:', commandLine)
        })
        .on('progress', (progress) => {
          console.log('处理进度:', progress.percent, '%')
        })
        .on('end', () => {
          console.log('音频裁剪完成')
          resolve()
        })
        .on('error', (err) => {
          console.error('音频裁剪失败:', err)
          reject(err)
        })
        .save(outputPath)
    })
  }

  /**
   * 获取音频文件信息
   */
  async getAudioInfo(filePath: string): Promise<IAudioInfo> {
    try {
      const metadata = await parseFile(filePath)
      const stats = await fs.stat(filePath)

      return {
        duration: metadata.format.duration || 0,
        format: metadata.format.container || 'unknown',
        bitrate: metadata.format.bitrate || 0,
        sampleRate: metadata.format.sampleRate || 0,
        channels: metadata.format.numberOfChannels || 0,
        fileSize: stats.size,
      }
    } catch (error) {
      console.warn('无法获取音频信息:', error)
      return {
        duration: 0,
        format: 'unknown',
        bitrate: 0,
        sampleRate: 0,
        channels: 0,
        fileSize: 0,
      }
    }
  }

  /**
   * 验证时间参数
   */
  private validateTimeOptions(options: IAudioTrimOptions, duration: number): void {
    if (options.startTime < 0) {
      throw new Error('开始时间不能为负数')
    }
    if (options.endTime <= options.startTime) {
      throw new Error('结束时间必须大于开始时间')
    }
    if (options.endTime > duration) {
      throw new Error('结束时间不能超过音频总时长')
    }
  }

  /**
   * 检测音频格式
   */
  private detectFormat(buffer: Buffer): string {
    // 简单的格式检测，可以根据需要扩展
    const header = buffer.toString('hex', 0, 4)
    if (header.startsWith('494433'))
      return 'mp3' // ID3
    if (header.startsWith('52494646'))
      return 'wav' // RIFF
    if (header.startsWith('664c6143'))
      return 'flac' // fLaC
    return 'mp3' // 默认
  }

  /**
   * 清理临时文件
   */
  async cleanupTempFiles(): Promise<void> {
    const files = await fs.readdir(this.tempDir)
    for (const file of files) {
      await fs.remove(path.join(this.tempDir, file))
    }
  }

  /**
   * 获取输出目录
   */
  getOutputDir(): string {
    return this.outputDir
  }

  /**
   * 获取临时目录
   */
  getTempDir(): string {
    return this.tempDir
  }
}
