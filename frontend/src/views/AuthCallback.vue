<template>
  <div class="auth-callback">
    <div class="loading">Выполняется вход...</div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '../store'

const route = useRoute()
const router = useRouter()
const store = useStore()

onMounted(() => {
  const token = route.query.token
  if (token) {
    store.setToken(token)
    store.fetchProfile()
    router.push('/dashboard')
  } else {
    router.push('/login?error=google_auth_failed')
  }
})
</script>

<style scoped>
.auth-callback {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
.loading {
  font-size: 1.2rem;
  color: #636e72;
}
</style>