<template>
  <section class="stats-section">
    <div class="container">
      <div class="stats-grid">
        <div class="stat-card" v-for="(stat, index) in statsWithLabels" :key="index">
          <div class="stat-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6c5ce7" stroke-width="1.5">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </div>
          <div class="stat-number" :data-target="stat.target">{{ stat.current }}</div>
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-progress">
            <div class="progress-bar" :style="{ width: stat.progress + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const bigStats = ref([
  { 
    target: 12847, 
    current: 0, 
    labelKey: 'stats.analyzed',
    progress: 100 
  },
  { 
    target: 47, 
    current: 0, 
    labelKey: 'stats.conversion_growth',
    progress: 85 
  },
  { 
    target: 49, 
    current: 0, 
    labelKey: 'stats.user_rating',
    progress: 92 
  }
])

// Реактивные подписи
const statsWithLabels = computed(() => {
  return bigStats.value.map(stat => ({
    ...stat,
    label: t(stat.labelKey)
  }))
})

onMounted(() => {
  const animateNumber = (el, target, suffix = '') => {
    let current = 0
    const step = Math.ceil(target / 60)
    const interval = setInterval(() => {
      current += step
      if (current >= target) {
        current = target
        clearInterval(interval)
      }
      el.textContent = current + suffix
    }, 20)
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target
        const target = parseInt(el.dataset.target)
        animateNumber(el, target, '')
        observer.unobserve(el)
      }
    })
  })

  // Используем nextTick, чтобы DOM обновился
  setTimeout(() => {
    document.querySelectorAll('.stat-card .stat-number').forEach(el => {
      observer.observe(el)
    })
  }, 100)
})
</script>

<style lang="scss" scoped>
$primary: #6c5ce7;
$secondary: #00b894;
$dark: #1a1a2e;
$gray: #636e72;
$light: #f8f9fa;
$white: #ffffff;
$shadow: 0 20px 60px rgba(108, 92, 231, 0.15);
$radius: 20px;
$transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
$font-heading: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
$font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

.stats-section {
  padding: 80px 0;
  background: $white;

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;

    .stat-card {
      text-align: center;
      padding: 40px 24px;
      background: $light;
      border-radius: $radius;
      position: relative;
      overflow: hidden;
      transition: $transition;

      &:hover {
        transform: translateY(-6px);
        box-shadow: $shadow;
      }

      .stat-icon {
        margin-bottom: 12px;

        svg {
          width: 40px;
          height: 40px;
          stroke-width: 1.5;
        }
      }

      .stat-number {
        display: block;
        font-family: $font-heading;
        font-size: 3.2rem;
        font-weight: 800;
        color: $primary;
        margin-bottom: 4px;
      }

      .stat-label {
        display: block;
        font-family: $font-body;
        font-size: 1rem;
        color: $gray;
        margin-bottom: 16px;
        font-weight: 500;
      }

      .stat-progress {
        height: 6px;
        background: #e9ecef;
        border-radius: 3px;
        overflow: hidden;

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, $primary, $secondary);
          border-radius: 3px;
          transition: width 2s ease;
          width: 0;
        }
      }
    }
  }
}

// ===== АДАПТИВ =====

@media (max-width: 1024px) {
  .stats-section .stats-grid {
    gap: 24px;

    .stat-card {
      padding: 32px 20px;

      .stat-number {
        font-size: 2.6rem;
      }
    }
  }
}

@media (max-width: 768px) {
  .stats-section {
    padding: 60px 0;

    .stats-grid {
      gap: 16px;

      .stat-card {
        padding: 24px 16px;
        border-radius: 14px;

        .stat-icon svg {
          width: 32px;
          height: 32px;
        }

        .stat-number {
          font-size: 2rem;
        }

        .stat-label {
          font-size: 0.85rem;
          margin-bottom: 12px;
        }

        .stat-progress {
          height: 4px;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .stats-section {
    padding: 40px 0;

    .stats-grid {
      grid-template-columns: 1fr;
      gap: 12px;

      .stat-card {
        padding: 20px 16px;
        border-radius: 12px;

        .stat-icon {
          margin-bottom: 6px;

          svg {
            width: 28px;
            height: 28px;
          }
        }

        .stat-number {
          font-size: 1.8rem;
        }

        .stat-label {
          font-size: 0.8rem;
          margin-bottom: 10px;
        }

        .stat-progress {
          height: 3px;
        }
      }
    }
  }
}
</style>