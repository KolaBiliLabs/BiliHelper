<script setup lang="ts">
import { WINDOW_CLOSE, WINDOW_HIDE, WINDOW_MAXIMIZE, WINDOW_MINIMIZE } from '@constants/ipcChannels'
import { SlashIcon, SquareIcon, XIcon } from 'lucide-vue-next'
import { NButton } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import CloseAppModal from '@/components/modals/CloseAppModal.vue'
import { useSystemStore } from '@/stores/systemStore'

// [ ] 增加设置界面, 用于管理 是否记住关闭行为
const systemStore = useSystemStore()
const { rememberNotAsk, closeAppMethod, showCloseAppTip } = storeToRefs(systemStore)

const showCloseModal = ref(false)

// 隐藏或关闭
function hideOrClose(action: 'hide' | 'exit') {
  if (rememberNotAsk.value) {
    showCloseAppTip.value = false
    closeAppMethod.value = action
  }
  showCloseModal.value = false
  window.electron.ipcRenderer.send(action === 'hide' ? WINDOW_HIDE : WINDOW_CLOSE)
}

// 尝试关闭软件
function tryClose() {
  if (showCloseAppTip.value) {
    showCloseModal.value = true
  } else {
    hideOrClose(closeAppMethod.value)
  }
}

function min() {
  window.electron.ipcRenderer.send(WINDOW_MINIMIZE)
}

function max() {
  window.electron.ipcRenderer.send(WINDOW_MAXIMIZE)
}
</script>

<template>
  <div class="mr-4 flex items-center gap-2">
    <NButton
      size="large"
      secondary
      circle
      class="app-region-no-drag"
      @click="min"
    >
      <template #icon>
        <SlashIcon class="size-4" />
      </template>
    </NButton>

    <NButton
      size="large"
      secondary
      circle
      class="app-region-no-drag"
      @click="max"
    >
      <template #icon>
        <SquareIcon class="size-4" />
      </template>
    </NButton>

    <NButton
      size="large"
      secondary
      circle
      class="app-region-no-drag"
      @click="tryClose"
    >
      <template #icon>
        <XIcon class="size-4" />
      </template>
    </NButton>

    <CloseAppModal
      v-model="showCloseModal"
      @exit="hideOrClose('exit')"
      @hide="hideOrClose('hide')"
    />
  </div>
</template>
