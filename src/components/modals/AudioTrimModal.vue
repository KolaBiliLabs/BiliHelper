<script setup lang="ts">
import type { IAudioInfo, IAudioTrimOptions } from '@/utils/audioTrimmer'
import { AUDIO_TRIM_ERROR, AUDIO_TRIM_PROGRESS, AUDIO_TRIM_START } from '@constants/ipcChannels'
import { NButton, NInputNumber, NModal, NProgress, NSelect, NSwitch } from 'naive-ui'
import { computed, ref, watch } from 'vue'

const show = defineModel<boolean>('show')
const props = defineProps<{
  audioInfo: IAudioInfo
  inputPath: string
}>()
const emit = defineEmits<{
  (e: 'trimComplete', result: any): void
}>()

// 响应式数据
const isProcessing = ref(false)
const progress = ref(0)
const error = ref('')
const enableFadeIn = ref(false)
const enableFadeOut = ref(false)

// 裁剪选项
const trimOptions = ref<IAudioTrimOptions>({
  startTime: 0,
  endTime: 0,
  format: 'mp3',
  quality: 'medium',
  fadeIn: 0,
  fadeOut: 0,
  normalize: false,
})

// 格式选项
const formatOptions = [
  { label: 'MP3', value: 'mp3' },
  { label: 'FLAC', value: 'flac' },
  { label: 'WAV', value: 'wav' },
  { label: 'AAC', value: 'aac' },
  { label: 'OGG', value: 'ogg' },
]

// 音质选项
const qualityOptions = [
  { label: '低质量', value: 'low' },
  { label: '中等质量', value: 'medium' },
  { label: '高质量', value: 'high' },
]

// 计算属性
const isValid = computed(() => {
  if (!props.audioInfo)
    return false
  return (
    trimOptions.value.startTime >= 0
    && trimOptions.value.endTime > trimOptions.value.startTime
    && trimOptions.value.endTime <= props.audioInfo.duration
  )
})

// 监听音频信息变化，初始化时间范围
watch(
  () => props.audioInfo,
  (newInfo) => {
    if (newInfo) {
      trimOptions.value.startTime = 0
      trimOptions.value.endTime = newInfo.duration
    }
  },
  { immediate: true },
)

// 监听淡入淡出开关
watch(enableFadeIn, (enabled) => {
  if (!enabled) {
    trimOptions.value.fadeIn = 0
  }
})

watch(enableFadeOut, (enabled) => {
  if (!enabled) {
    trimOptions.value.fadeOut = 0
  }
})

// 方法
function updateStartTime() {
  if (trimOptions.value.startTime >= trimOptions.value.endTime) {
    trimOptions.value.startTime = trimOptions.value.endTime - 0.1
  }
}

function updateEndTime() {
  if (trimOptions.value.endTime <= trimOptions.value.startTime) {
    trimOptions.value.endTime = trimOptions.value.startTime + 0.1
  }
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function formatBitrate(bitrate: number): string {
  if (bitrate === 0)
    return '未知'
  return `${Math.round(bitrate / 1000)} kbps`
}

async function handleTrim() {
  if (!props.inputPath || !isValid.value)
    return

  isProcessing.value = true
  progress.value = 0
  error.value = ''

  try {
    // 发送裁剪请求到主进程
    const result = await window.electron.ipcRenderer.invoke(AUDIO_TRIM_START, {
      inputPath: props.inputPath,
      trimOptions: trimOptions.value,
    })

    emit('trimComplete', result)
  } catch (err: any) {
    error.value = err.message || '裁剪失败'
  } finally {
    isProcessing.value = false
  }
}

function handleCancel() {
  if (isProcessing.value) {
    // 取消正在进行的处理
    window.electron.ipcRenderer.invoke('audio-trim-cancel')
  }
}

// 监听主进程消息
window.electron.ipcRenderer.on(AUDIO_TRIM_PROGRESS, (_, progressData) => {
  progress.value = progressData.percent || 0
})

window.electron.ipcRenderer.on(AUDIO_TRIM_ERROR, (_, errorData) => {
  error.value = errorData.message || '裁剪失败'
  isProcessing.value = false
})
</script>

<template>
  <NModal
    v-model:show="show"
    preset="card"
    title="音频裁剪"
    class="w-96"
    :mask-closable="false"
    :closable="!isProcessing"
  >
    <div class="space-y-4">
      <!-- 音频信息 -->
      <div v-if="audioInfo" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          <div>时长: {{ formatTime(audioInfo.duration) }}</div>
          <div>格式: {{ audioInfo.format.toUpperCase() }}</div>
          <div>比特率: {{ formatBitrate(audioInfo.bitrate) }}</div>
        </div>
      </div>

      <!-- 时间选择 -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">裁剪范围</span>
          <span class="text-xs text-gray-500">
            {{ formatTime(trimOptions.startTime) }} - {{ formatTime(trimOptions.endTime) }}
          </span>
        </div>

        <!-- 时间滑块 -->
        <div class="relative">
          <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div
              class="h-full bg-blue-500 rounded-full transition-all duration-200"
              :style="{ width: `${(trimOptions.endTime - trimOptions.startTime) / audioInfo?.duration * 100}%`, left: `${trimOptions.startTime / audioInfo?.duration * 100}%` }"
            />
          </div>

          <!-- 开始时间滑块 -->
          <input
            v-model.number="trimOptions.startTime"
            type="range"
            :min="0"
            :max="audioInfo?.duration || 0"
            :step="0.1"
            class="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
            @input="updateStartTime"
          >

          <!-- 结束时间滑块 -->
          <input
            v-model.number="trimOptions.endTime"
            type="range"
            :min="0"
            :max="audioInfo?.duration || 0"
            :step="0.1"
            class="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
            @input="updateEndTime"
          >
        </div>

        <!-- 时间输入 -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">开始时间</label>
            <NInputNumber
              v-model:value="trimOptions.startTime"
              :min="0"
              :max="audioInfo?.duration || 0"
              :step="0.1"
              placeholder="0.0"
              size="small"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">结束时间</label>
            <NInputNumber
              v-model:value="trimOptions.endTime"
              :min="0"
              :max="audioInfo?.duration || 0"
              :step="0.1"
              placeholder="0.0"
              size="small"
            />
          </div>
        </div>
      </div>

      <!-- 输出设置 -->
      <div class="space-y-3">
        <h4 class="text-sm font-medium">
          输出设置
        </h4>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">格式</label>
            <NSelect
              v-model:value="trimOptions.format"
              :options="formatOptions"
              size="small"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">音质</label>
            <NSelect
              v-model:value="trimOptions.quality"
              :options="qualityOptions"
              size="small"
            />
          </div>
        </div>

        <!-- 高级选项 -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-600 dark:text-gray-400">淡入效果</span>
            <NSwitch v-model:value="enableFadeIn" size="small" />
          </div>
          <NInputNumber
            v-if="enableFadeIn"
            v-model:value="trimOptions.fadeIn"
            :min="0"
            :max="5"
            :step="0.1"
            placeholder="0.0"
            size="small"
          />

          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-600 dark:text-gray-400">淡出效果</span>
            <NSwitch v-model:value="enableFadeOut" size="small" />
          </div>
          <NInputNumber
            v-if="enableFadeOut"
            v-model:value="trimOptions.fadeOut"
            :min="0"
            :max="5"
            :step="0.1"
            placeholder="0.0"
            size="small"
          />

          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-600 dark:text-gray-400">音量标准化</span>
            <NSwitch v-model:value="trimOptions.normalize" size="small" />
          </div>
        </div>
      </div>

      <!-- 处理进度 -->
      <div v-if="isProcessing" class="space-y-2">
        <div class="flex items-center justify-between text-sm">
          <span>处理中...</span>
          <span>{{ progress }}%</span>
        </div>
        <NProgress
          :percentage="progress"
          :show-indicator="false"
          status="success"
        />
      </div>

      <!-- 错误信息 -->
      <div v-if="error" class="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
        {{ error }}
      </div>
    </div>

    <!-- 操作按钮 -->
    <template #footer>
      <div class="flex justify-end space-x-2">
        <NButton
          v-if="!isProcessing"
          size="small"
          @click="handleCancel"
        >
          取消
        </NButton>
        <NButton
          v-if="!isProcessing"
          type="primary"
          :disabled="!isValid"
          size="small"
          @click="handleTrim"
        >
          开始裁剪
        </NButton>
        <NButton
          v-if="isProcessing"
          type="error"
          size="small"
          @click="handleCancel"
        >
          取消处理
        </NButton>
      </div>
    </template>
  </NModal>
</template>

<style scoped>
/* 自定义滑块样式 */
input[type='range'] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

input[type='range']::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
}
</style>
