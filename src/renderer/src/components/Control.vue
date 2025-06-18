<script setup lang="ts">
import { Avatar, Button, Slider } from 'ant-design-vue'
import { MenuIcon, SquareRoundCorner } from 'lucide-vue-next'
import { ref } from 'vue'

const progress = ref(50) // 播放进度
const volume = ref(70) // 音量
</script>

<template>
  <div class="flex-none bg-white p-4 border-t border-gray-200 flex items-center justify-between h-full">
    <div class="flex items-center">
      <Avatar :size="48" src="https://via.placeholder.com/60x60?text=Cover" class="mr-3" />
      <div>
        <div class="text-base font-semibold">
          物理魔法使马修 神插曲
        </div>
        <div class="text-sm text-gray-500">
          曲: THE IRON FIST
        </div>
      </div>
    </div>

    <div class="flex flex-col items-center flex-grow-0 mx-4">
      <div class="flex items-center space-x-6 mb-2">
        <Button type="text" size="large">
          1
        </Button>
        <Button type="text" size="large">
          j1
        </Button>
        <Button type="text" size="large">
          1
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

    <div class="flex items-center space-x-4">
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
