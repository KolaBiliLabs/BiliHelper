<script setup lang="ts">
import { Avatar, Button, Slider } from 'ant-design-vue'
import { MenuIcon, Play, SquareRoundCorner, StepBack, StepForward } from 'lucide-vue-next'
import { ref } from 'vue'

const progress = ref(50) // 播放进度
const volume = ref(70) // 音量
</script>

<template>
  <div class="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 flex-between gap-2 h-[100px]">
    <!-- left  -->
    <div class="flex-none flex items-center">
      <Avatar :size="48" src="" class="mr-3" />
      <div>
        <div class="text-base font-semibold">
          物理魔法使马修 神插曲
        </div>
        <div class="text-sm text-gray-500">
          曲: THE IRON FIST
        </div>
      </div>
    </div>

    <!-- center -->
    <div class="flex-1 flex-col-center gap-2">
      <div class="flex-center gap-4">
        <Button shape="circle" class="flex-center">
          <template #icon>
            <StepBack />
          </template>
        </Button>
        <Button shape="circle" type="primary" class="flex-center">
          <template #icon>
            <Play :size="14" />
          </template>
        </Button>
        <Button shape="circle" class="flex-center">
          <template #icon>
            <StepForward />
          </template>
        </Button>
      </div>

      <div class="flex items-center w-full text-xs text-gray-600">
        <span class="mr-2">00:01:08</span>
        <Slider
          v-model:value="progress"
          :min="0"
          :max="100"
          :tooltip-open="false"
          class="flex-grow mx-2"
        />
        <span class="ml-2">00:02:24</span>
      </div>
    </div>

    <!-- right -->
    <div class="flex-none flex items-center space-x-4">
      <Button type="text">
        <MenuIcon />
      </Button>
      <Button type="text">
        <SquareRoundCorner />
      </Button>
      <Slider
        v-model:value="volume"
        :min="0"
        :max="100"
        :tooltip-open="false"
        class="w-24"
      />
    </div>
  </div>
</template>
