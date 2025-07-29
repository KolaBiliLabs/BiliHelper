<script setup lang="ts">
window.electron.ipcRenderer.on('dataFromPlugin', (_e, ...[payload]) => {
  console.log('接收到了 => ', payload)
  window.$notification.info({
    title: payload.bvId || 'no title',
    description: 'hh',
  })
})

</script>

<template>
  <div>
    messageReceived
  </div>
</template>

<style scoped>

</style>
