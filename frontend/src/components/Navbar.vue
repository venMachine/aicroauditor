<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-left">
        <router-link to="/" class="logo">
          <svg class="logo-icon" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="10" fill="#6c5ce7"/>
            <path d="M10 13L13 10M13 10L16 13M13 10V24M19 13L22 10M22 10L25 13M22 10V24M10 24H25" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="13" cy="24" r="2" fill="white"/>
            <circle cx="22" cy="24" r="2" fill="white"/>
          </svg>
          <span class="logo-text">AI CRO Auditor</span>
        </router-link>
      </div>

      <div class="navbar-right">
        <!-- КНОПКА ЯЗЫКА -->
        <button class="lang-toggle" @click="toggleLang" title="Сменить язык">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2C14.5 4.5 15.5 8 15.5 12C15.5 16 14.5 19.5 12 22C9.5 19.5 8.5 16 8.5 12C8.5 8 9.5 4.5 12 2Z"/>
          </svg>
          <span class="lang-text">{{ currentLang === 'ru' ? 'EN' : 'RU' }}</span>
        </button>

        <!-- ДЕСКТОПНЫЕ ССЫЛКИ -->
        <div class="nav-links">
          <template v-if="user">
            <router-link to="/dashboard" class="nav-link">{{ $t('nav.audits') }}</router-link>
            <router-link to="/pricing" class="nav-link">{{ $t('nav.pricing') }}</router-link>
            <span class="credits-badge">{{ user.credits }} {{ $t('nav.credits') }}</span>
            <button @click="handleLogout" class="btn-logout">{{ $t('nav.logout') }}</button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn-login">{{ $t('nav.login') }}</router-link>
            <router-link to="/register" class="btn-start">{{ $t('nav.start') }}</router-link>
          </template>
        </div>

        <!-- БУРГЕР (только на мобилках) -->
        <button class="burger-btn" @click="toggleMenu" :class="{ active: isMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <!-- МОБИЛЬНОЕ МЕНЮ -->
    <Teleport to="body">
      <div v-if="isMenuOpen" class="mobile-overlay" @click="closeMenu"></div>
      <div class="mobile-menu" :class="{ open: isMenuOpen }">
        <div class="mobile-menu-inner">
          <template v-if="user">
            <router-link to="/dashboard" class="mobile-link" @click="closeMenu">Мои аудиты</router-link>
            <router-link to="/pricing" class="mobile-link" @click="closeMenu">Тарифы</router-link>
            <span class="mobile-credits">{{ user.credits }} кредитов</span>
            <button @click="handleLogout" class="mobile-logout">Выйти</button>
          </template>
          <template v-else>
            <router-link to="/login" class="mobile-login" @click="closeMenu">Вход</router-link>
            <router-link to="/register" class="mobile-start" @click="closeMenu">Начать</router-link>
          </template>
        </div>
      </div>
    </Teleport>
  </nav>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useStore } from '../store'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'


const store = useStore()
const router = useRouter()
const user = computed(() => store.user)
const { locale } = useI18n()



const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMenu = () => {
  isMenuOpen.value = false
  document.body.style.overflow = ''
}

watch(() => router.currentRoute.value, () => {
  closeMenu()
})

const currentLang = ref('ru')

const toggleLang = () => {
  const newLang = locale.value === 'ru' ? 'en' : 'ru'
  locale.value = newLang
  localStorage.setItem('lang', newLang)
  currentLang.value = newLang
}
const handleLogout = () => {
  store.clearToken()
  store.user = null
  router.push('/')
  closeMenu()
}
</script>

<style lang="scss" scoped>
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(108, 92, 231, 0.08);
  padding: 12px 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;

  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    width: 100%;
  }

  .navbar-left {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    flex-shrink: 0;

    .logo-icon {
      flex-shrink: 0;
      transition: transform 0.3s ease;
    }

    &:hover .logo-icon {
      transform: scale(1.05) rotate(-3deg);
    }

    .logo-text {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 1.3rem;
      font-weight: 700;
      color: #1a1a2e;
      letter-spacing: -0.3px;
      white-space: nowrap;
    }
  }

  .lang-toggle {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 12px;
    border: 1px solid #dfe6e9;
    border-radius: 8px;
    background: transparent;
    color: #2d3436;
    font-weight: 600;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.3s ease;
    flex-shrink: 0;

    &:hover {
      border-color: #6c5ce7;
      color: #6c5ce7;
      background: rgba(108, 92, 231, 0.04);
    }

    svg {
      flex-shrink: 0;
    }

    .lang-text {
      font-weight: 600;
      font-size: 0.75rem;
      letter-spacing: 0.5px;
    }
  }

  // ===== ДЕСКТОПНЫЕ ССЫЛКИ =====
  .nav-links {
    display: flex;
    align-items: center;
    gap: 12px;

    .nav-link {
      color: #2d3436;
      font-weight: 500;
      font-size: 0.95rem;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 8px;
      transition: all 0.3s ease;
      white-space: nowrap;

      &:hover {
        color: #6c5ce7;
        background: rgba(108, 92, 231, 0.06);
      }
    }

    .credits-badge {
      background: #f0f2f8;
      padding: 8px 16px;
      border-radius: 24px;
      font-size: 0.85rem;
      font-weight: 600;
      color: #2d3436;
      display: flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
    }

    .btn-login {
      padding: 10px 24px;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      background: transparent;
      color: #2d3436;
      font-weight: 600;
      font-size: 0.95rem;
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;
      white-space: nowrap;

      &:hover {
        border-color: #6c5ce7;
        color: #6c5ce7;
        background: rgba(108, 92, 231, 0.04);
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(108, 92, 231, 0.1);
      }
    }

    .btn-start {
      padding: 10px 28px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, #6c5ce7, #5a4bd1);
      color: white;
      font-weight: 600;
      font-size: 0.95rem;
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(108, 92, 231, 0.25);
      white-space: nowrap;

      &:hover {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 8px 30px rgba(108, 92, 231, 0.35);
        background: linear-gradient(135deg, #5a4bd1, #4a3db8);
      }

      &:active {
        transform: scale(0.98);
      }
    }

    .btn-logout {
      padding: 10px 24px;
      border: 2px solid #ff6b6b;
      border-radius: 12px;
      background: transparent;
      color: #ff6b6b;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      cursor: pointer;
      white-space: nowrap;

      &:hover {
        background: #ff6b6b;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
      }
    }
  }

  // ===== БУРГЕР =====
  .burger-btn {
    display: none;
    flex-direction: column;
    justify-content: space-between;
    width: 28px;
    height: 20px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    flex-shrink: 0;
    z-index: 1001;

    span {
      display: block;
      width: 100%;
      height: 2px;
      background: #2d3436;
      border-radius: 2px;
      transition: all 0.3s ease;
      transform-origin: center;
    }

    &.active {
      span:nth-child(1) {
        transform: translateY(9px) rotate(45deg);
      }
      span:nth-child(2) {
        opacity: 0;
        transform: scaleX(0);
      }
      span:nth-child(3) {
        transform: translateY(-9px) rotate(-45deg);
      }
    }
  }
}

// ===== МОБИЛЬНОЕ МЕНЮ =====
.mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
  animation: fadeIn 0.3s ease;
}

.mobile-menu {
  position: fixed;
  top: 0;
  right: -100%;
  width: 320px;
  max-width: 85vw;
  height: 100vh;
  background: white;
  box-shadow: -8px 0 40px rgba(0, 0, 0, 0.1);
  transition: right 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  overflow-y: auto;
  padding-top: 70px;

  &.open {
    right: 0;
  }

  .mobile-menu-inner {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 20px 24px;

    .mobile-link {
      padding: 14px 16px;
      color: #2d3436;
      font-size: 1rem;
      font-weight: 500;
      text-decoration: none;
      border-radius: 10px;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(108, 92, 231, 0.06);
        color: #6c5ce7;
      }
    }

    .mobile-credits {
      padding: 14px 16px;
      background: #f0f2f8;
      border-radius: 10px;
      font-size: 0.95rem;
      font-weight: 600;
      color: #2d3436;
      text-align: center;
      margin: 4px 0;
    }

    .mobile-login {
      padding: 14px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      background: transparent;
      color: #2d3436;
      font-size: 1rem;
      font-weight: 600;
      text-decoration: none;
      text-align: center;
      transition: all 0.3s ease;
      margin-top: 4px;

      &:hover {
        border-color: #6c5ce7;
        color: #6c5ce7;
        background: rgba(108, 92, 231, 0.04);
      }
    }

    .mobile-start {
      padding: 14px 16px;
      border: none;
      border-radius: 10px;
      background: linear-gradient(135deg, #6c5ce7, #5a4bd1);
      color: white;
      font-size: 1rem;
      font-weight: 600;
      text-decoration: none;
      text-align: center;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(108, 92, 231, 0.25);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(108, 92, 231, 0.35);
      }
    }

    .mobile-logout {
      padding: 14px 16px;
      border: 2px solid #ff6b6b;
      border-radius: 10px;
      background: transparent;
      color: #ff6b6b;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;

      &:hover {
        background: #ff6b6b;
        color: white;
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

// =============================================
// ===== АДАПТИВ =====
// =============================================

@media (max-width: 1024px) {
  .navbar {
    .logo .logo-text {
      font-size: 1.1rem;
    }

    .nav-links .nav-link {
      font-size: 0.85rem;
      padding: 6px 12px;
    }

    .nav-links .btn-login,
    .nav-links .btn-start,
    .nav-links .btn-logout {
      padding: 8px 18px;
      font-size: 0.85rem;
    }

    .nav-links .credits-badge {
      font-size: 0.75rem;
      padding: 6px 12px;
    }
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 10px 0;

    .container {
      padding: 0 16px;
    }

    .logo .logo-text {
      font-size: 1rem;
    }

    .logo .logo-icon {
      width: 30px;
      height: 30px;
    }

    .logo {
      gap: 8px;
    }

    // ПОКАЗЫВАЕМ БУРГЕР
    .burger-btn {
      display: flex;
    }

    .navbar-right {
      gap: 6px;
    }

    .lang-toggle {
      padding: 6px 10px;
      font-size: 0.7rem;

      svg {
        width: 16px;
        height: 16px;
      }

      .lang-text {
        font-size: 0.65rem;
      }
    }

    // СКРЫВАЕМ ДЕСКТОПНЫЕ ССЫЛКИ НА МОБИЛКАХ
    .nav-links {
      display: none !important;
    }
  }

  .mobile-menu {
    width: 300px;
    padding-top: 60px;

    .mobile-menu-inner {
      padding: 16px 20px;
    }
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 8px 0;

    .container {
      padding: 0 12px;
    }

    .logo .logo-text {
      font-size: 0.85rem;
    }

    .logo .logo-icon {
      width: 26px;
      height: 26px;
    }

    .logo {
      gap: 6px;
    }

    .lang-toggle {
      padding: 4px 8px;
      font-size: 0.6rem;

      svg {
        width: 14px;
        height: 14px;
      }

      .lang-text {
        font-size: 0.55rem;
      }
    }

    .burger-btn {
      width: 24px;
      height: 17px;
    }
  }

  .mobile-menu {
    width: 280px;
    padding-top: 55px;

    .mobile-menu-inner {
      padding: 12px 16px;

      .mobile-link,
      .mobile-login,
      .mobile-start,
      .mobile-logout,
      .mobile-credits {
        padding: 12px 14px;
        font-size: 0.9rem;
      }
    }
  }
}

// ===== НА ДЕСКТОПЕ СКРЫВАЕМ МОБИЛЬНОЕ МЕНЮ =====
@media (min-width: 769px) {
  .mobile-menu {
    display: none !important;
  }

  .mobile-overlay {
    display: none !important;
  }
}
</style>
