<script setup lang="ts">
import { Avatar, Input, List } from 'ant-design-vue'
import { computed, ref } from 'vue'
import { requestSearch } from '@/api/search'

const searchValue = ref('')
const searchResults = ref<any[]>([])

// 只显示视频类型的搜索结果
const videoResults = computed(() => {
  if (!searchResults.value)
    return []
  return searchResults.value.filter(item => item.result_type === 'video')
})

async function handleSubmit() {
  if (!searchValue.value) {
    searchResults.value = []
    return
  }

  const res = await requestSearch(searchValue.value)
  // Bilibili API 返回的数据在 data.result 中
  searchResults.value = res.data.result || []
  console.log(123123, searchValue.value, searchResults.value)
}
</script>

<template>
  <div class="app-region-no-darg">
    <form class="app-region-no-darg" @submit.prevent="handleSubmit">
      <Input
        v-model:value="searchValue"
        placeholder="输入关键词或 b 站链接"
        allow-clear
        size="large"
        width="100"
      />
    </form>

    <List
      v-if="videoResults.length > 0"
      class="mt-4"
      item-layout="horizontal"
      :data-source="videoResults"
    >
      <template #renderItem="{ item }">
        <List.Item>
          <List.Item.Meta :description="`UP: ${item.author}`">
            <template #title>
              <a :href="item.arcurl" target="_blank" v-html="item.title" />
            </template>
            <template #avatar>
              <Avatar :src="`https:${item.pic}`" />
            </template>
          </List.Item.Meta>
        </List.Item>
      </template>
    </List>
  </div>
</template>
