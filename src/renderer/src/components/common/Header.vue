<script setup lang="ts">
import Search from './Search.vue'
import WindowControls from './WindowControls.vue'
</script>

<template>
  <header class="relative flex items-center p-4 h-[64px] bg-blue-500/50 app-region-drag">
    <div class="flex-1 flex items-center">
      <Search class="app-region-no-drag" />
    </div>

    <section class="flex-none w-[164px] flex items-center justify-center">
      <WindowControls class="app-region-no-drag" />
    </section>
  </header>
</template>
