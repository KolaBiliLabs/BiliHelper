/**
 * 音频裁剪功能使用示例
 */

import { AudioTrimmer } from '../src/utils/audioTrimmer'
import type { IAudioTrimOptions } from '../src/utils/audioTrimmer'

async function audioTrimExample() {
  // 创建音频裁剪器实例
  const trimmer = new AudioTrimmer()

  try {
    // 示例 1: 基本裁剪
    console.log('=== 基本裁剪示例 ===')
    const basicResult = await trimmer.trimAudio('/path/to/audio.mp3', {
      startTime: 10,    // 从第10秒开始
      endTime: 30,      // 到第30秒结束
      format: 'mp3',    // 输出MP3格式
      quality: 'medium' // 中等音质
    })
    console.log('基本裁剪完成:', basicResult)

    // 示例 2: 高级裁剪（带淡入淡出和音量标准化）
    console.log('=== 高级裁剪示例 ===')
    const advancedResult = await trimmer.trimAudio('/path/to/audio.wav', {
      startTime: 5,
      endTime: 25,
      format: 'flac',     // 输出FLAC格式
      quality: 'high',    // 高质量
      fadeIn: 1.0,        // 1秒淡入
      fadeOut: 2.0,       // 2秒淡出
      normalize: true     // 音量标准化
    })
    console.log('高级裁剪完成:', advancedResult)

    // 示例 3: 获取音频信息
    console.log('=== 音频信息示例 ===')
    const audioInfo = await trimmer.getAudioInfo('/path/to/audio.mp3')
    console.log('音频信息:', {
      时长: `${Math.floor(audioInfo.duration / 60)}:${Math.floor(audioInfo.duration % 60).toString().padStart(2, '0')}`,
      格式: audioInfo.format,
      比特率: `${Math.round(audioInfo.bitrate / 1000)} kbps`,
      采样率: `${audioInfo.sampleRate} Hz`,
      声道数: audioInfo.channels,
      文件大小: `${(audioInfo.fileSize / 1024 / 1024).toFixed(2)} MB`
    })

    // 示例 4: 批量处理
    console.log('=== 批量处理示例 ===')
    const files = [
      '/path/to/audio1.mp3',
      '/path/to/audio2.wav',
      '/path/to/audio3.flac'
    ]

    const batchOptions: IAudioTrimOptions = {
      startTime: 0,
      endTime: 60, // 裁剪前60秒
      format: 'mp3',
      quality: 'medium'
    }

    const batchResults = await Promise.all(
      files.map(file => trimmer.trimAudio(file, batchOptions))
    )
    console.log('批量处理完成，共处理', batchResults.length, '个文件')

    // 示例 5: 错误处理
    console.log('=== 错误处理示例 ===')
    try {
      await trimmer.trimAudio('/nonexistent/file.mp3', {
        startTime: 0,
        endTime: 10
      })
    } catch (error) {
      console.log('预期的错误:', error.message)
    }

  } catch (error) {
    console.error('音频裁剪示例执行失败:', error)
  }
}

// 在 Electron 主进程中使用
async function electronMainProcessExample() {
  const { ipcMain } = require('electron')
  const { AudioTrimmer } = require('./src/utils/audioTrimmer')

  // 注册 IPC 处理器
  ipcMain.handle('audio-trim', async (event, options) => {
    const trimmer = new AudioTrimmer()
    
    try {
      const result = await trimmer.trimAudio(options.inputPath, options.trimOptions)
      return { success: true, data: result }
    } catch (error) {
      return { success: false, error: error.message }
    }
  })
}

// 在 Vue 组件中使用
function vueComponentExample() {
  // 使用 Hook
  const {
    isProcessing,
    progress,
    currentAudioInfo,
    trimHistory,
    setAudioInfo,
    addToHistory,
    formatTime,
    formatFileSize
  } = useAudioTrim()

  // 处理文件选择
  async function handleFileSelect(file: File) {
    try {
      // 保存文件到临时目录
      const filePath = await saveFileToTemp(file)
      
      // 获取音频信息
      const trimmer = new AudioTrimmer()
      const audioInfo = await trimmer.getAudioInfo(filePath)
      
      setAudioInfo(audioInfo)
    } catch (error) {
      console.error('文件处理失败:', error)
    }
  }

  // 执行裁剪
  async function executeTrim(options: IAudioTrimOptions) {
    try {
      const trimmer = new AudioTrimmer()
      const result = await trimmer.trimAudio(selectedFilePath.value, options)
      
      addToHistory(result)
      console.log('裁剪完成:', result)
    } catch (error) {
      console.error('裁剪失败:', error)
    }
  }
}

// 导出示例函数
export {
  audioTrimExample,
  electronMainProcessExample,
  vueComponentExample
}

// 如果直接运行此文件
if (require.main === module) {
  audioTrimExample().catch(console.error)
} 
