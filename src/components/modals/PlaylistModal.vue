<script setup lang="ts">
import { NButton, NCard, NInput, NModal } from 'naive-ui'
import { ref, watch } from 'vue'
import { usePlaylistModal } from '@/hooks/usePlaylistModal'

const emit = defineEmits<{
  created: [props: { name: string, desc: string }]
  updated: [props: { id: string, name: string, desc: string }]
}>()

const { isShowModal, isEdit, editData, closeModal } = usePlaylistModal()

const playlistName = ref('')
const playlistDesc = ref('')

// 弹窗打开时填充数据
watch(
  () => isShowModal.value,
  (show) => {
    if (show && isEdit.value && editData.value) {
      playlistName.value = editData.value.name || ''
      playlistDesc.value = editData.value.desc || ''
    } else if (show && !isEdit.value) {
      playlistName.value = ''
      playlistDesc.value = ''
    }
  },
)

function handleSubmit() {
  if (playlistName.value.trim()) {
    if (isEdit.value && editData.value) {
      // 编辑模式
      emit('updated', { id: editData.value.id, name: playlistName.value.trim(), desc: playlistDesc.value.trim() })
    } else {
      // 新建模式
      emit('created', { name: playlistName.value.trim(), desc: playlistDesc.value.trim() })
    }
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
    <NCard class="p-0 rounded-xl bg-white/80 max-w-100">
      <div class="mb-4 text-lg font-bold text-center">
        {{ isEdit ? '编辑歌单' : '新建歌单' }}
      </div>
      <div class="mb-3 text-gray-500 text-sm text-center">
        {{ isEdit ? '修改歌单信息' : '创建属于你自己的专属歌单，支持自定义名称和描述。' }}
      </div>
      <div class="flex items-center gap-4 mb-4">
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
        <NButton type="primary" :disabled="!playlistName.trim()" @click="handleSubmit">
          {{ isEdit ? '保存' : '创建' }}
        </NButton>
      </div>
    </NCard>
  </NModal>
</template>
