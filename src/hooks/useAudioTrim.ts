import type { IAudioInfo, IAudioTrimOptions, ITrimResult } from '@/utils/audioTrimmer'
import { computed, readonly, ref } from 'vue'

export function useAudioTrim() {
  // 状态
  const isProcessing = ref(false)
  const progress = ref(0)
  const error = ref('')
  const currentAudioInfo = ref<IAudioInfo | null>(null)
  const trimHistory = ref<ITrimResult[]>([])

  // 计算属性
  const hasAudioInfo = computed(() => !!currentAudioInfo.value)
  const canTrim = computed(() => {
    if (!currentAudioInfo.value)
      return false
    return !isProcessing.value && !error.value
  })

  /**
   * 设置音频信息
   */
  function setAudioInfo(audioInfo: IAudioInfo) {
    currentAudioInfo.value = audioInfo
    error.value = ''
  }

  /**
   * 清除音频信息
   */
  function clearAudioInfo() {
    currentAudioInfo.value = null
    error.value = ''
    progress.value = 0
  }

  /**
   * 重置状态
   */
  function reset() {
    isProcessing.value = false
    progress.value = 0
    error.value = ''
    currentAudioInfo.value = null
  }

  /**
   * 添加到裁剪历史
   */
  function addToHistory(result: ITrimResult) {
    trimHistory.value.unshift(result)
    // 限制历史记录数量
    if (trimHistory.value.length > 50) {
      trimHistory.value = trimHistory.value.slice(0, 50)
    }
  }

  /**
   * 清除裁剪历史
   */
  function clearHistory() {
    trimHistory.value = []
  }

  /**
   * 从历史记录中移除
   */
  function removeFromHistory(id: string) {
    const index = trimHistory.value.findIndex(item => item.id === id)
    if (index !== -1) {
      trimHistory.value.splice(index, 1)
    }
  }

  /**
   * 获取裁剪历史
   */
  function getHistory() {
    return trimHistory.value
  }

  /**
   * 格式化时间
   */
  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  /**
   * 格式化文件大小
   */
  function formatFileSize(bytes: number): string {
    if (bytes === 0)
      return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
  }

  /**
   * 格式化比特率
   */
  function formatBitrate(bitrate: number): string {
    if (bitrate === 0)
      return '未知'
    return `${Math.round(bitrate / 1000)} kbps`
  }

  /**
   * 验证裁剪选项
   */
  function validateTrimOptions(options: IAudioTrimOptions): string | null {
    if (!currentAudioInfo.value) {
      return '没有音频信息'
    }

    if (options.startTime < 0) {
      return '开始时间不能为负数'
    }

    if (options.endTime <= options.startTime) {
      return '结束时间必须大于开始时间'
    }

    if (options.endTime > currentAudioInfo.value.duration) {
      return '结束时间不能超过音频总时长'
    }

    if (options.fadeIn && options.fadeIn > 5) {
      return '淡入时间不能超过5秒'
    }

    if (options.fadeOut && options.fadeOut > 5) {
      return '淡出时间不能超过5秒'
    }

    return null
  }

  /**
   * 创建默认裁剪选项
   */
  function createDefaultTrimOptions(): IAudioTrimOptions {
    const duration = currentAudioInfo.value?.duration || 0
    return {
      startTime: 0,
      endTime: duration,
      format: 'mp3',
      quality: 'medium',
      fadeIn: 0,
      fadeOut: 0,
      normalize: false,
    }
  }

  return {
    // 状态
    isProcessing: readonly(isProcessing),
    progress: readonly(progress),
    error: readonly(error),
    currentAudioInfo: readonly(currentAudioInfo),
    trimHistory: readonly(trimHistory),

    // 计算属性
    hasAudioInfo,
    canTrim,

    // 方法
    setAudioInfo,
    clearAudioInfo,
    reset,
    addToHistory,
    clearHistory,
    removeFromHistory,
    getHistory,
    formatTime,
    formatFileSize,
    formatBitrate,
    validateTrimOptions,
    createDefaultTrimOptions,
  }
}
