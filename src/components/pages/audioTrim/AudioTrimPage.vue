<template>
  <div class="p-6 space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">音频裁剪</h1>
      <n-button
        type="primary"
        @click="showFileSelector = true"
        :disabled="isProcessing"
      >
        选择音频文件
      </n-button>
    </div>

    <!-- 文件选择器 -->
    <n-modal
      v-model:show="showFileSelector"
      preset="card"
      title="选择音频文件"
      class="w-96"
    >
      <div class="space-y-4">
        <div class="text-center">
          <n-upload
            ref="uploadRef"
            :show-file-list="false"
            accept="audio/*"
            @change="handleFileSelect"
          >
            <n-button>选择文件</n-button>
          </n-upload>
          <p class="text-xs text-gray-500 mt-2">
            支持 MP3, WAV, FLAC, AAC, OGG 等格式
          </p>
        </div>
      </div>
    </n-modal>

    <!-- 音频信息 -->
    <div v-if="hasAudioInfo" class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
      <h3 class="text-lg font-medium mb-3">音频信息</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <span class="text-sm text-gray-600 dark:text-gray-400">时长</span>
          <div class="font-medium">{{ formatTime(currentAudioInfo!.duration) }}</div>
        </div>
        <div>
          <span class="text-sm text-gray-600 dark:text-gray-400">格式</span>
          <div class="font-medium">{{ currentAudioInfo!.format.toUpperCase() }}</div>
        </div>
        <div>
          <span class="text-sm text-gray-600 dark:text-gray-400">比特率</span>
          <div class="font-medium">{{ formatBitrate(currentAudioInfo!.bitrate) }}</div>
        </div>
        <div>
          <span class="text-sm text-gray-600 dark:text-gray-400">文件大小</span>
          <div class="font-medium">{{ formatFileSize(currentAudioInfo!.fileSize) }}</div>
        </div>
      </div>
      
      <div class="mt-4 flex space-x-2">
        <n-button
          type="primary"
          @click="showTrimModal = true"
          :disabled="!canTrim"
        >
          开始裁剪
        </n-button>
        <n-button
          @click="clearAudioInfo"
          :disabled="isProcessing"
        >
          清除
        </n-button>
      </div>
    </div>

    <!-- 裁剪历史 -->
    <div v-if="trimHistory.length > 0" class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-medium">裁剪历史</h3>
        <n-button
          size="small"
          @click="clearHistory"
        >
          清除历史
        </n-button>
      </div>
      
      <div class="space-y-2">
        <div
          v-for="item in trimHistory"
          :key="item.id"
          class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded"
        >
          <div class="flex-1">
            <div class="font-medium">{{ formatTime(item.startTime) }} - {{ formatTime(item.endTime) }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ item.format.toUpperCase() }} | {{ formatFileSize(item.fileSize) }}
            </div>
          </div>
          <div class="flex space-x-2">
            <n-button
              size="small"
              @click="openFile(item.trimmedPath)"
            >
              打开
            </n-button>
            <n-button
              size="small"
              type="error"
              @click="removeFromHistory(item.id)"
            >
              删除
            </n-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 裁剪模态框 -->
    <AudioTrimModal
      v-model:show="showTrimModal"
      :audio-info="currentAudioInfo"
      :input-path="selectedFilePath"
      @trim-complete="handleTrimComplete"
    />

    <!-- 处理进度 -->
    <div v-if="isProcessing" class="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
      <div class="flex items-center space-x-3">
        <n-spin size="small" />
        <div>
          <div class="font-medium">处理中...</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">{{ progress }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NModal, NUpload, NSpin } from 'naive-ui'
import AudioTrimModal from '@/components/modals/AudioTrimModal.vue'
import { useAudioTrim } from '@/hooks/useAudioTrim'
import type { ITrimResult } from '@/utils/audioTrimmer'

// 使用音频裁剪 Hook
const {
  isProcessing,
  progress,
  error,
  currentAudioInfo,
  trimHistory,
  hasAudioInfo,
  canTrim,
  setAudioInfo,
  clearAudioInfo,
  addToHistory,
  clearHistory,
  removeFromHistory,
  formatTime,
  formatFileSize,
  formatBitrate,
} = useAudioTrim()

// 本地状态
const showFileSelector = ref(false)
const showTrimModal = ref(false)
const selectedFilePath = ref('')
const uploadRef = ref()

/**
 * 处理文件选择
 */
async function handleFileSelect(options: any) {
  const file = options.file
  if (!file) return

  try {
    // 这里需要将文件保存到本地并获取路径
    // 在实际应用中，你可能需要将文件保存到临时目录
    const filePath = await saveFileToTemp(file)
    selectedFilePath.value = filePath

    // 获取音频信息
    const { AudioTrimmer } = await import('@/utils/audioTrimmer')
    const trimmer = new AudioTrimmer()
    const audioInfo = await trimmer.getAudioInfo(filePath)
    
    setAudioInfo(audioInfo)
    showFileSelector.value = false
  } catch (err: any) {
    console.error('文件处理失败:', err)
    window.$message.error('文件处理失败: ' + err.message)
  }
}

/**
 * 保存文件到临时目录
 */
async function saveFileToTemp(file: File): Promise<string> {
  // 这里是一个简化的实现
  // 在实际应用中，你需要将文件保存到本地临时目录
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => {
      // 这里应该将文件保存到本地并返回路径
      // 为了演示，我们使用一个模拟的路径
      resolve(`/temp/${file.name}`)
    }
    reader.readAsArrayBuffer(file)
  })
}

/**
 * 处理裁剪完成
 */
function handleTrimComplete(result: ITrimResult) {
  addToHistory(result)
  window.$message.success('音频裁剪完成！')
}

/**
 * 打开文件
 */
function openFile(filePath: string) {
  // 在实际应用中，这里应该使用系统默认程序打开文件
  console.log('打开文件:', filePath)
  window.$message.info('文件路径: ' + filePath)
}
</script> 
