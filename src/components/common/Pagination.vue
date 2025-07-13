<script setup lang="ts">
import { NPagination } from 'naive-ui'

interface Props {
  totalCount: number
  page: number
  pageSize: number
  loading: boolean
}
defineProps<Props>()

defineEmits<{
  pageChange: [page: number]
}>()
</script>

<template>
  <div class="flex-center py-7">
    <NPagination
      :disabled="loading"
      :page="page"
      :page-size="pageSize"
      :item-count="totalCount"
      @update-page="(page) => $emit('pageChange', page)"
    />
  </div>
</template>
