<script setup lang="ts">
import { SEARCH_RESULT_PAGE } from '@constants/pageId'
import { useEventListener } from '@vueuse/core'
import { SearchIcon } from 'lucide-vue-next'
import { NInput } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { ref, useTemplateRef } from 'vue'
import { useSearchStore } from '@/stores/searchStore'
import { useSystemStore } from '@/stores/systemStore'
import SearchSuggestions from './SearchSuggestions.vue'

const systemStore = useSystemStore()
const { searchFocus, fullScreen, currentPage } = storeToRefs(systemStore)

const searchStore = useSearchStore()
const { currentSearchKeyword } = storeToRefs(searchStore)

const searchInputRef = useTemplateRef<InstanceType<typeof NInput> | null>('searchInputRef')

const searchValue = ref('')

// 搜索
async function handleSearch(v: string) {
  currentSearchKeyword.value = v
  currentPage.value = SEARCH_RESULT_PAGE

  // 关闭搜索框
  searchFocus.value = false
  searchInputRef.value?.blur()
}

// 搜索框获取焦点
function searchInputFocus() {
  searchInputRef.value?.focus()
  searchFocus.value = true
}

/**
 * @description 快捷键搜索
 */
function handleSearchByCK(e: KeyboardEvent) {
  // 全屏播放器时不响应
  if (fullScreen.value)
    return

  // 搜索框聚焦时不响应
  if (searchFocus.value) {
    // 聚焦时
    if (e.key === 'Escape' || e.key === 'Tab') {
      // esc 关闭搜索框
      searchFocus.value = false
      searchInputRef.value?.blur()
    }
    return
  }

  const ctrlOrCmd = e.metaKey || e.ctrlKey
  // 组合键 ctrl+k
  if (ctrlOrCmd && e.key === 'k') {
    console.log('ctrl+k')
    e.preventDefault()
    searchInputFocus()
  }
}

// 快捷键搜索
useEventListener('keydown', handleSearchByCK, false)
</script>

<template>
  <div class="relative">
    <NInput
      ref="searchInputRef"
      v-model:value="searchValue"
      :class="searchFocus ? 'focus' : ''"
      class="n-input app-region-no-drag"
      placeholder="输入关键词或 bv 号"
      round
      clearable
      @keyup.enter="handleSearch(searchValue)"
      @focus="searchInputFocus"
    >
      <template #prefix>
        <SearchIcon class="size-4" />
      </template>
    </NInput>

    <!-- 遮罩 -->
    <Transition name="fade" mode="out-in">
      <div v-show="searchFocus" class="search-mask" @click="searchFocus = false" />
    </Transition>

    <!-- 搜索建议 -->
    <SearchSuggestions :search-value="searchValue" @change="handleSearch" />
  </div>
</template>

<style scoped>
.n-input {
  z-index: 1999;
  position: relative;
  width: 200px;
  transition: width 0.3s;
  height: 35px;

  &.focus {
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
  z-index: 1996;
  backdrop-filter: blur(10px);
}
</style>
