<script setup lang="ts">
const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
</script>

<template>
  <div class="bg-amber-500">
    12312321321
  </div>
</template>
