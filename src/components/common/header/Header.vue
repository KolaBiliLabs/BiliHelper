<script setup lang="ts">
import Search from './Search.vue'
import Theme from './Theme.vue'
import WindowControls from './WindowControls.vue'
</script>

<template>
  <header class="relative flex items-center p-4 h-[64px] bg-blue-500/50 app-region-drag">
    <div class="flex-1 flex items-center gap-4">
      <Search />
      <Theme />
    </div>

    <section class="flex-none w-[164px] flex-center">
      <WindowControls />
    </section>
  </header>
</template>
