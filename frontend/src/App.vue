<template>
  <div id="app">
    <Navbar />
    <router-view />
    <Footer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useStore } from './store'
import { useRouter } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

const store = useStore()
const router = useRouter()

onMounted(async () => {
  const token = localStorage.getItem('token')
  
  if (token) {
    store.setToken(token)
    
    try {
      await store.fetchProfile()
      await store.fetchAudits()
      console.log('Сессия восстановлена, пользователь:', store.user?.email)
    } catch (error) {
      console.error('Ошибка восстановления сессии:', error)
      store.clearToken()
      router.push('/login')
    }
  } else {
    if (router.currentRoute.value.meta?.auth) {
      router.push('/login')
    }
  }
})
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  width: 100%;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f0f2f8;
  overflow-x: hidden;
  width: 100%;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 12px;
  }
}
</style>