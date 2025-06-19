<script setup lang="ts">
import { Input } from 'ant-design-vue'
import { ref } from 'vue'
import { requestSearch } from '@/api/search'

const searchValue = ref('')

async function handleSubmit() {
  const res = await requestSearch(searchValue.value)
  console.log(123123, searchValue.value, res)
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <Input v-model:value="searchValue" placeholder="输入关键词或 b 站链接" allow-clear />
  </form>
</template>
