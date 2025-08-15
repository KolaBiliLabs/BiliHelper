# 音频裁剪功能

## 概述

音频裁剪功能允许用户对音频文件进行精确的时间裁剪，支持多种音频格式和高级音频处理选项。

## 功能特性

### 核心功能
- ✅ **时间裁剪**: 精确设置开始和结束时间
- ✅ **多格式支持**: MP3, WAV, FLAC, AAC, OGG
- ✅ **音质控制**: 低、中、高质量选项
- ✅ **淡入淡出**: 可选的音频淡入淡出效果
- ✅ **音量标准化**: 自动音量标准化处理
- ✅ **实时预览**: 可视化时间选择器
- ✅ **处理进度**: 实时显示处理进度
- ✅ **裁剪历史**: 保存和管理裁剪历史

### 技术特性
- 🔧 **FFmpeg 集成**: 使用 FFmpeg 进行高质量音频处理
- ⚡ **异步处理**: 非阻塞音频处理
- 🎯 **精确控制**: 毫秒级时间精度
- 📁 **文件管理**: 自动文件清理和管理
- 🔄 **错误处理**: 完善的错误处理和恢复机制

## 依赖项

### 核心依赖
```json
{
  "ffmpeg-static": "^5.2.0",
  "fluent-ffmpeg": "^2.1.2",
  "music-metadata": "^8.0.0",
  "fs-extra": "^11.2.0"
}
```

### 可选依赖
```json
{
  "nanoid": "^5.1.5"
}
```

## 使用方法

### 1. 基本使用

```typescript
import { AudioTrimmer } from '@/utils/audioTrimmer'

const trimmer = new AudioTrimmer()

// 裁剪音频文件
const result = await trimmer.trimAudio('/path/to/audio.mp3', {
  startTime: 10, // 开始时间（秒）
  endTime: 30,   // 结束时间（秒）
  format: 'mp3', // 输出格式
  quality: 'medium' // 音质
})
```

### 2. 高级选项

```typescript
const result = await trimmer.trimAudio('/path/to/audio.mp3', {
  startTime: 10,
  endTime: 30,
  format: 'flac',
  quality: 'high',
  fadeIn: 1.0,    // 1秒淡入
  fadeOut: 2.0,   // 2秒淡出
  normalize: true // 音量标准化
})
```

### 3. 使用 Vue 组件

```vue
<template>
  <AudioTrimModal
    v-model:show="showModal"
    :audio-info="audioInfo"
    :input-path="filePath"
    @trim-complete="handleComplete"
  />
</template>

<script setup>
import AudioTrimModal from '@/components/modals/AudioTrimModal.vue'

const showModal = ref(false)
const audioInfo = ref(null)
const filePath = ref('')

function handleComplete(result) {
  console.log('裁剪完成:', result)
}
</script>
```

### 4. 使用 Hook

```typescript
import { useAudioTrim } from '@/hooks/useAudioTrim'

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
```

## API 参考

### AudioTrimmer 类

#### 构造函数
```typescript
new AudioTrimmer()
```

#### 方法

##### `trimAudio(inputPath: string, options: IAudioTrimOptions): Promise<ITrimResult>`
裁剪音频文件

**参数:**
- `inputPath`: 输入文件路径
- `options`: 裁剪选项

**返回:** 裁剪结果对象

##### `trimAudioStream(inputBuffer: Buffer, options: IAudioTrimOptions): Promise<ITrimResult>`
裁剪音频流

**参数:**
- `inputBuffer`: 音频数据缓冲区
- `options`: 裁剪选项

**返回:** 裁剪结果对象

##### `getAudioInfo(filePath: string): Promise<IAudioInfo>`
获取音频文件信息

**参数:**
- `filePath`: 文件路径

**返回:** 音频信息对象

### 接口定义

#### IAudioTrimOptions
```typescript
interface IAudioTrimOptions {
  startTime: number        // 开始时间（秒）
  endTime: number         // 结束时间（秒）
  format?: 'mp3' | 'flac' | 'wav' | 'aac' | 'ogg' // 输出格式
  quality?: 'low' | 'medium' | 'high' // 音质
  fadeIn?: number         // 淡入时间（秒）
  fadeOut?: number        // 淡出时间（秒）
  normalize?: boolean     // 是否标准化音量
}
```

#### ITrimResult
```typescript
interface ITrimResult {
  id: string              // 唯一标识
  originalPath: string    // 原始文件路径
  trimmedPath: string     // 裁剪后文件路径
  startTime: number       // 开始时间
  endTime: number         // 结束时间
  duration: number        // 裁剪后时长
  format: string          // 输出格式
  fileSize: number        // 文件大小
  audioInfo: IAudioInfo   // 音频信息
}
```

#### IAudioInfo
```typescript
interface IAudioInfo {
  duration: number        // 时长（秒）
  format: string         // 格式
  bitrate: number        // 比特率
  sampleRate: number     // 采样率
  channels: number       // 声道数
  fileSize: number       // 文件大小
}
```

## 配置选项

### 音质设置
```typescript
const qualityMap = {
  low: { bitrate: '128k', sampleRate: '22050' },
  medium: { bitrate: '192k', sampleRate: '44100' },
  high: { bitrate: '320k', sampleRate: '48000' }
}
```

### 输出目录
默认输出目录: `~/.kolaBiliHelper/trimmed/`
临时目录: `~/.kolaBiliHelper/temp/`

## 错误处理

### 常见错误
1. **时间参数错误**: 开始时间大于结束时间
2. **文件不存在**: 输入文件路径无效
3. **格式不支持**: 不支持的音频格式
4. **权限错误**: 文件读写权限不足

### 错误处理示例
```typescript
try {
  const result = await trimmer.trimAudio(filePath, options)
  console.log('裁剪成功:', result)
} catch (error) {
  console.error('裁剪失败:', error.message)
  // 处理错误
}
```

## 性能优化

### 建议
1. **大文件处理**: 对于大文件，建议使用流式处理
2. **并发限制**: 避免同时处理多个大文件
3. **临时文件清理**: 定期清理临时文件
4. **内存管理**: 及时释放不需要的音频数据

### 最佳实践
```typescript
// 批量处理时使用队列
const queue = []
for (const file of files) {
  queue.push(trimmer.trimAudio(file.path, file.options))
}
const results = await Promise.all(queue)
```

## 扩展功能

### 自定义音频滤镜
```typescript
// 可以扩展 AudioTrimmer 类来支持更多 FFmpeg 滤镜
class CustomAudioTrimmer extends AudioTrimmer {
  async applyCustomFilter(inputPath: string, filter: string) {
    // 实现自定义滤镜
  }
}
```

### 批量处理
```typescript
async function batchTrim(files: string[], options: IAudioTrimOptions) {
  const trimmer = new AudioTrimmer()
  const results = []
  
  for (const file of files) {
    try {
      const result = await trimmer.trimAudio(file, options)
      results.push(result)
    } catch (error) {
      console.error(`处理文件 ${file} 失败:`, error)
    }
  }
  
  return results
}
```

## 故障排除

### 常见问题

1. **FFmpeg 路径错误**
   - 确保 `ffmpeg-static` 正确安装
   - 检查 FFmpeg 二进制文件是否存在

2. **内存不足**
   - 减少并发处理数量
   - 使用流式处理替代缓冲处理

3. **文件权限问题**
   - 检查输出目录权限
   - 确保有足够的磁盘空间

4. **格式转换失败**
   - 检查输入文件格式是否支持
   - 验证输出格式参数

### 调试模式
```typescript
// 启用详细日志
const trimmer = new AudioTrimmer()
trimmer.setDebugMode(true)
```

## 更新日志

### v1.0.0
- 初始版本发布
- 支持基本音频裁剪功能
- 集成 FFmpeg 处理引擎
- 提供 Vue 组件和 Hook

### 计划功能
- [ ] 音频波形可视化
- [ ] 实时预览播放
- [ ] 更多音频滤镜
- [ ] 云端处理支持
- [ ] 批量处理优化 
