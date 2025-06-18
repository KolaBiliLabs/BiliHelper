<script setup lang="ts">
import { Input } from 'ant-design-vue'
import { ref } from 'vue'

const searchValue = ref('')

function handleSubmit() {
  console.log('submit', searchValue.value)
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <Input v-model:value="searchValue" placeholder="输入关键词或 b 站链接" allow-clear />
  </form>
</template>

<style scoped>

</style>
