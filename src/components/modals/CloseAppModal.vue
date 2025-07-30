<script setup lang="ts">
import { EyeClosedIcon, XIcon } from 'lucide-vue-next'
import { NButton, NCheckbox, NFlex, NModal, NText } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useSystemStore } from '@/stores/systemStore'

const show = defineModel<boolean>()
defineEmits<{
  exit: []
  hide: []
}>()

const systemStore = useSystemStore()
const { rememberNotAsk } = storeToRefs(systemStore)
</script>

<template>
  <NModal
    :show
    :auto-focus="false"
    title="关闭软件"
    style="width: 600px"
    preset="card"
    transform-origin="center"
    bordered
    @after-leave="rememberNotAsk = false"
  >
    <NFlex vertical :size="10">
      <NText depth="3" type="warning">
        确认关闭软件吗？
      </NText>
      <NCheckbox v-model:checked="rememberNotAsk" size="small">
        记住且不再询问
      </NCheckbox>
    </NFlex>
    <template #footer>
      <NFlex justify="end">
        <NButton strong secondary @click="$emit('exit')">
          <template #icon>
            <XIcon class="size-4" />
          </template>
          关闭
        </NButton>
        <NButton
          type="primary"
          strong
          secondary
          @click="$emit('hide')"
        >
          <template #icon>
            <EyeClosedIcon class="size-4" />
          </template>
          隐藏到托盘
        </NButton>
      </NFlex>
    </template>
  </NModal>
</template>
