<script setup lang="ts">
import { Button } from 'ant-design-vue'
import { ref } from 'vue'

const isLogin = ref(true)

function logout() {
  isLogin.value = false
  // Add your logout logic here, e.g., clearing tokens, redirecting, etc.
}
</script>

<template>
  <section class="app-region-no-darg">
    <template v-if="isLogin">
      <Button
        shape="round"
        type="primary"
        @click="logout"
      >
        logout
      </Button>
    </template>
    <template v-else>
      login
    </template>
  </section>
</template>
