<script setup lang="ts">
import LoginOrLogout from './LoginOrLogout.vue'
import Search from './Search.vue'
import Theme from './Theme.vue'
import WindowControls from './WindowControls.vue'
</script>

<template>
  <header class="flex-between p-4 h-[64px] bg-slate-500/50 app-region-drag">
    <div class="flex-1 flex items-center gap-4">
      <Search />
      <Theme />
    </div>

    <section class="flex-none flex-center gap-4 app-region-no-drag">
      <LoginOrLogout />
      <WindowControls />
    </section>
  </header>
</template>
