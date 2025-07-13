<script setup lang="ts">
import { XIcon } from 'lucide-vue-next'
import { NButton, NModal } from 'naive-ui'
import { useLoginModal } from '@/hooks/useLoginModal'
import Qrcode from '../Qrcode.vue'

const { isShowModal, closeModal } = useLoginModal()
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
    @update-show="(v) => console.log(v)"
  >
    <div>
      <!-- 主体部分 -->
      <div class="p-4 rounded-xl bg-white">
        <div class="mb-6 size-45 rounded-md mx-auto overflow-hidden flex-center">
          <Qrcode class="mt-2" @success="closeModal" />
        </div>

        <div class="text-center">
          使用 bilibili 扫码登录
        </div>
      </div>

      <!-- 按钮 -->
      <div class="flex-center mt-4">
        <NButton
          class="p-2.5 rounded-full"
          round
          type="tertiary"
          @click="closeModal"
        >
          <XIcon class="size-5" />
        </NButton>
      </div>
    </div>
  </NModal>
</template>
