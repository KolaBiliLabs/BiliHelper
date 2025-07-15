<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { NCard, NEmpty } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { ref, watchEffect } from 'vue'
import { searchSuggestion } from '@/api/search'
import Loading from '@/components/global/Loading.vue'
import { useSystemStore } from '@/stores/systemStore'

interface Props {
  searchValue: string
}

const { searchValue } = defineProps<Props>()
const emit = defineEmits<{
  change: [searchValue: string]
}>()

const systemStore = useSystemStore()
const { searchFocus } = storeToRefs(systemStore)
const loading = ref(false)

// 搜索建议
const suggestSongs = ref<ISuggestion[]>([])

// 防抖
const debounceReq = useDebounceFn(async () => {
  loading.value = true
  const res = await searchSuggestion(searchValue)
  suggestSongs.value = res.result.tag || []
  loading.value = false
})

function clickSuggestion(v: ISuggestion) {
  emit('change', v.value)
}

watchEffect(() => {
  if (searchValue) {
    debounceReq()
  } else {
    // 清空搜索建议
    suggestSongs.value = []
  }
})
</script>

<template>
  <Transition name="fade-up">
    <div v-if="searchValue && searchFocus" class="search-suggestions">
      <NCard>
        <div v-auto-animate>
          <!-- loading -->
          <template v-if="loading">
            <Loading py-12 flex-center w-full />
          </template>

          <!-- empty -->
          <template v-else-if="!suggestSongs.length">
            <NEmpty description="我猜没这首歌" size="small" />
          </template>

          <template v-else>
            <div
              v-for="song of suggestSongs"
              :key="song.value"
              class="suggest-song"
              flex-between
              @click="() => clickSuggestion(song)"
            >
              <div class="song-name">
                {{ song.value }}
              </div>
            </div>
          </template>
        </div>
      </NCard>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.search-suggestions {
  z-index: 1999;
  position: absolute;
  top: calc(35px + 22px);
  width: 300px;
}

.n-card {
  padding: 12px;
  border-radius: 10px;

  :deep(.n-card__content) {
    padding: 0;
  }
}

.suggest-song {
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #cccccc50;
  }

  .song-name {
    flex: 1;
  }
  .song-artist {
    flex: 0 0 100px;
    text-align: right;
  }
}
</style>
