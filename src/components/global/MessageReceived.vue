<script setup lang="ts">
window.electron.ipcRenderer.on('dataFromPlugin', async (ev) => {
  console.log('接收到了 => ', ev)
})
</script>

<template>
  <div>
    messageReceived
  </div>
</template>

<style scoped>

</style>
