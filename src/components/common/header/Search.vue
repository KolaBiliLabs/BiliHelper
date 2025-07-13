<script setup lang="ts">
import { NInput } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { ref, useTemplateRef } from 'vue'
import { searchKeyword } from '@/api/search'
import { useSystemStore } from '@/stores/systemStore'

const systemStore = useSystemStore()
const { searchFocus } = storeToRefs(systemStore)

const searchInputRef = useTemplateRef<InstanceType<typeof NInput> | null>('searchInputRef')

const searchValue = ref('')
const searchDefault = ref('')

// 搜索
function handleSearch(v: string) {
  const _searchValue = v || searchDefault.value

  // 关闭搜索框
  searchFocus.value = false
  searchInputRef.value?.blur()
}

// 搜索框获取焦点
function searchInputFocus() {
  searchInputRef.value?.focus()
  searchFocus.value = true
}
</script>

<template>
  <div relative>
    <NInput
      ref="searchInputRef"
      v-model:value="searchValue"
      :class="searchFocus ? 'focus' : ''"
      :placeholder="searchDefault || '搜索音乐'"
      round
      clearable
      class="n-input app-region-no-drag"
      @keyup.enter="handleSearch(searchValue)"
      @focus="searchInputFocus"
    >
      <template #prefix>
        <div
          i-carbon:search
          color="#ccc"
          w-15
          h-15
        />
      </template>
    </NInput>

    <!-- 遮罩 -->
    <Transition name="fade" mode="out-in">
      <div v-show="searchFocus" class="search-mask" @click="searchFocus = false" />
    </Transition>
  </div>
</template>

<style scoped>
.n-input {
  z-index: 100;
  position: relative;
  width: 200px;
  transition: width 0.3s;

  .focus {
    width: 300px;
  }
}
.search-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #00000050;
  z-index: 10;
  backdrop-filter: blur(10px);
}
</style>
