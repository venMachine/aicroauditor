<template>
  <div class="auth-page">
    <div class="container">
      <div class="auth-card card">
        <h2>{{ $t('auth.register.title') }}</h2>
        <p class="subtitle">{{ $t('auth.register.subtitle') }}</p>

        <!-- GOOGLE КНОПКА -->
        <button @click="googleLogin" class="btn-google">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {{ $t('auth.register.google') }}
        </button>

        <div class="divider"><span>{{ $t('auth.register.or') || 'или' }}</span></div>

        <form @submit.prevent="register">
          <input 
            type="email" 
            v-model="email" 
            :placeholder="$t('auth.register.email')" 
            required 
          />
          <input 
            type="password" 
            v-model="password" 
            :placeholder="$t('auth.register.password')" 
            required 
            minlength="6" 
          />
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? $t('auth.register.loading') : $t('auth.register.btn') }}
          </button>
          <p class="switch">
            {{ $t('auth.register.switch') }}
            <router-link to="/login">{{ $t('auth.register.switch_link') }}</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useStore } from '../store'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const loading = ref(false)
const store = useStore()
const router = useRouter()

const register = async () => {
  loading.value = true
  try {
    const res = await axios.post('/api/auth/register', { 
      email: email.value, 
      password: password.value 
    })
    store.setToken(res.data.token)
    store.user = res.data.user
    router.push('/dashboard')
  } catch (err) {
    alert('Ошибка: ' + (err.response?.data?.error || 'Неизвестная ошибка'))
  } finally {
    loading.value = false
  }
}

const googleLogin = () => {
  window.location.href = '/api/auth/google'
}
</script>

<style lang="scss" scoped>
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  padding: 40px 0;
}

.auth-card {
  max-width: 440px;
  width: 100%;
  margin: 0 auto;

  h2 {
    text-align: center;
    margin-bottom: 4px;
  }

  .subtitle {
    text-align: center;
    color: $gray;
    margin-bottom: 24px;
  }
}

// ===== GOOGLE КНОПКА =====
.btn-google {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
  border: 2px solid #dfe6e9;
  border-radius: $radius;
  background: white;
  color: #2d3436;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #4285F4;
    background: #f8f9ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(66, 133, 244, 0.15);
  }

  svg {
    flex-shrink: 0;
  }
}

// ===== РАЗДЕЛИТЕЛЬ =====
.divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 16px 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #dfe6e9;
  }

  span {
    color: $gray;
    font-size: 0.85rem;
    white-space: nowrap;
  }
}

form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

input {
  padding: 14px 18px;
  border: 2px solid #dfe6e9;
  border-radius: $radius;
  font-size: 1rem;
  transition: $transition;

  &:focus {
    outline: none;
    border-color: $primary;
  }
}

.switch {
  text-align: center;
  color: $gray;

  a {
    font-weight: 600;
  }
}
</style>
