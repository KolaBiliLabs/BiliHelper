<script setup lang="ts">
import { NButton, NCard, NInput, NModal } from 'naive-ui'
import { ref } from 'vue'
import { useCreatePlaylistModal } from '@/hooks/useCreatePlaylistModal'
import { usePlayStore } from '@/stores/playStore'

const { isShowModal, closeModal } = useCreatePlaylistModal()
const playStore = usePlayStore()
const playlistName = ref('')
const playlistDesc = ref('')

function handleCreate() {
  if (playlistName.value.trim()) {
    // 这里可以扩展 playStore.createPlaylist 支持描述
    playStore.createPlaylist(playlistName.value.trim(), playlistDesc.value.trim())
    playlistName.value = ''
    playlistDesc.value = ''
    closeModal()
  }
}
function handleCancel() {
  playlistName.value = ''
  playlistDesc.value = ''
  closeModal()
}
</script>

<template>
  <NModal
    v-model:show="isShowModal"
    auto-focus
    :mask-closable="false"
    :bordered="false"
    :closable="false"
    close-on-esc
  >
    <div>
      <NCard class="p-4 rounded-xl bg-white/80">
        <div class="mb-4 text-lg font-bold text-center">
          新建歌单
        </div>
        <div class="mb-3 text-gray-500 text-sm text-center">
          创建属于你自己的专属歌单，支持自定义名称和描述。
        </div>
        <div class="flex items-center gap-4 mb-4">
          <!-- 封面占位图 -->
          <div class="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-2xl">
            🎵
          </div>
          <div class="flex-1">
            <NInput
              v-model:value="playlistName"
              placeholder="请输入歌单名称"
              maxlength="30"
              class="mb-2"
            />
            <NInput
              v-model:value="playlistDesc"
              placeholder="可填写歌单描述"
              maxlength="60"
            />
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <NButton secondary @click="handleCancel">
            取消
          </NButton>
          <NButton type="primary" :disabled="!playlistName.trim()" @click="handleCreate">
            创建
          </NButton>
        </div>
      </NCard>
    </div>
  </NModal>
</template>

<style scoped>
.n-card {
  padding: 0;
}
</style>
