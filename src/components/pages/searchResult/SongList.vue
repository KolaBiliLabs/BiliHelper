<script setup lang="ts">
import { NCard, NEmpty, NImage, NText } from 'naive-ui'
import Loading from '@/components/common/Loading.vue'

interface Props {
  data: IBilibiliVideoData[]
  loading: boolean
  disabledHeader?: boolean
}

withDefaults(defineProps<Props>(), {
  disabledHeader: false,
})
defineEmits<{
  choose: [id: number]
}>()

defineSlots<{
  default: () => void
  header: () => void
}>()

function handleThumb(thumb: string) {
  if (thumb.startsWith('http') || thumb.startsWith('https')) {
    return thumb
  }
  return `https:${thumb}`
}
</script>

<template>
  <div v-auto-animate class="min-h-60vh space-y-4">
    <!-- 歌曲列表 -->
    <template v-if="!loading">
      <NEmpty
        v-if="!data || !data.length"
        class="w-full h-[50vh] flex-center"
      >
        <NText> 暂无数据 </NText>
      </NEmpty>

      <template v-else>
        <NCard
          v-for="item of data"
          :key="item.id"
          hoverable
          select-none
          @dblclick="$emit('choose', item.id)"
        >
          <div class="flex items-center h-full gap-4">
            <!-- 头像 -->
            <div
              class="size-14 rounded-md overflow-hidden flex-center"
            >
              <img :src="handleThumb(item.pic)" :alt="item.desc" class="size-full object-cover">
            </div>

            <div class="flex justify-center flex-col pr-4">
              <div class="flex items-center gap-7">
                <NText> {{ item.author }} </NText>
              </div>

              <NText class="text-slate-500">
                {{ item.author }}
              </NText>
            </div>
          </div>
          <NText class="w-20 flex-none">
            {{ item.typename }}
          </NText>
          <NText class="duration">
            {{ item.duration }}
          </NText>
        </NCard>
      </template>
    </template>

    <!-- loading -->
    <Loading
      v-else
      :size="80"
      class="w-full h-50vw flex-center"
    />
  </div>
</template>

<style scoped lang="scss">
/* 歌列表 */
.n-card {
  $transition: all 0.3s ease-in-out;

  padding: 8px;
  border: 1px solid #ffffff40;
  border-radius: 8px;
  cursor: pointer;
  transition: $transition;

  &:hover {
    box-shadow: 0 0 8px #ffffff60;
    border-color: #ffffff60;
  }

  &.active {
    border-color: #ffffff90;
    background-color: #ffffff70;
  }

  &:active {
    transform: scale3d(0.995, 0.995, 1);
  }

  :deep(.n-card__content) {
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
