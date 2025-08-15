<script setup lang="ts">
import { XIcon } from 'lucide-vue-next'
import { NButton, NCard, NModal } from 'naive-ui'
import { useLoginModal } from '@/hooks/useLoginModal'
import Qrcode from '../Qrcode.vue'

const emit = defineEmits<{
  success: []
}>()

const { isShowModal, closeModal } = useLoginModal()

function handleSuccess() {
  closeModal()
  emit('success')
}
</script>

<template>
  <NModal
    v-model:show="isShowModal"
    :auto-focus="false"
    :mask-closable="false"
    :bordered="false"
    :closable="false"
    :close-on-esc="false"
    :style="{ boxShadow: 'none' }"
  >
    <Transition name="modal" mode="out-in">
      <div v-if="isShowModal">
        <!-- 主体部分 -->
        <NCard class="p-4 rounded-xl bg-white/50">
          <div class="mb-6 size-45 rounded-md mx-auto overflow-hidden flex-center">
            <Qrcode v-if="isShowModal" class="mt-2" @success="handleSuccess" />
          </div>

          <div class="text-center">
            使用 bilibili 扫码登录
          </div>
        </NCard>

        <!-- 按钮 -->
        <div class="flex-center mt-4">
          <NButton
            round
            secondary
            size="large"
            @click="closeModal"
          >
            <XIcon class="size-5" />
          </NButton>
        </div>
      </div>
    </Transition>
  </NModal>
</template>

<style scoped>
.n-card {
  padding: 0;
}

/* 模态框过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}
</style>
