
<template>
  <section class="charts">
    <div class="container">
      <div class="charts-grid">
        <!-- Рост конверсии -->
        <div class="chart-card">
          <h3>{{ $t('charts.conversion_growth') }}</h3>
          <div class="chart-bars">
            <div class="bar-item" v-for="(item, index) in chartData" :key="index">
              <div class="bar-wrapper" :style="{ height: animatedBars[index] + '%' }">
                <div class="bar">
                  <span class="bar-value">{{ barPercentages[index] }}%</span>
                </div>
              </div>
              <span class="bar-label">{{ labels[index] }}</span>
            </div>
          </div>
        </div>

        <!-- Эффективность -->
        <div class="chart-card">
          <h3>{{ $t('charts.efficiency') }}</h3>
          <div class="chart-donut-wrapper">
            <div class="chart-donut">
              <svg viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="80" stroke="#f0f0f0" stroke-width="30" fill="none" />
                <circle class="donut-segment" cx="100" cy="100" r="80" 
                  stroke="#6c5ce7" stroke-width="30" fill="none"
                  stroke-dasharray="226 502" 
                  stroke-dashoffset="0" />
                <circle class="donut-segment" cx="100" cy="100" r="80" 
                  stroke="#00b894" stroke-width="30" fill="none"
                  stroke-dasharray="151 502" 
                  stroke-dashoffset="-226" />
                <circle class="donut-segment" cx="100" cy="100" r="80" 
                  stroke="#feca57" stroke-width="30" fill="none"
                  stroke-dasharray="125 502" 
                  stroke-dashoffset="-377" />
              </svg>
              <div class="donut-center">
                <span class="donut-value">{{ animatedTotal }}%</span>
                <!-- <span class="donut-label">{{ $t('charts.efficiency_label') }}</span> -->
              </div>
            </div>
            <div class="donut-legend">
              <div><span class="legend-dot primary"></span> {{ $t('charts.legend.design') }} (45%)</div>
              <div><span class="legend-dot secondary"></span> {{ $t('charts.legend.text') }} (30%)</div>
              <div><span class="legend-dot warning"></span> {{ $t('charts.legend.trust') }} (25%)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

// МЕТКИ — ПРЯМО ЗДЕСЬ, БЕЗ СЛОЖНОСТЕЙ
const labels = computed(() => {
  return locale.value === 'ru' 
    ? ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн']
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
})

const chartData = ref([
  { value: 45 },
  { value: 55 },
  { value: 68 },
  { value: 78 },
  { value: 85 },
  { value: 92 }
])

const animatedBars = ref([0, 0, 0, 0, 0, 0])
const barPercentages = ref([0, 0, 0, 0, 0, 0])
const animatedTotal = ref(0)

let barInterval = null
let totalInterval = null

const startBarAnimation = (targets) => {
  const currentHeights = [0, 0, 0, 0, 0, 0]
  const targetHeights = targets
  const duration = 2000
  const startTime = Date.now()

  if (barInterval) clearInterval(barInterval)

  barInterval = setInterval(() => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)

    const newHeights = []
    const newPercentages = []

    for (let i = 0; i < targetHeights.length; i++) {
      const current = eased * targetHeights[i]
      newHeights.push(current)
      newPercentages.push(Math.round(current))
    }

    animatedBars.value = newHeights
    barPercentages.value = newPercentages

    if (progress >= 1) {
      animatedBars.value = targetHeights
      barPercentages.value = targetHeights.map(v => Math.round(v))
      clearInterval(barInterval)
      barInterval = null
    }
  }, 16)
}

const animateTotal = () => {
  const duration = 2000
  const startTime = Date.now()
  
  animatedTotal.value = 0

  if (totalInterval) clearInterval(totalInterval)

  totalInterval = setInterval(() => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    
    animatedTotal.value = Math.round(85 * eased)

    if (progress >= 1) {
      animatedTotal.value = 85
      clearInterval(totalInterval)
      totalInterval = null
    }
  }, 16)
}

onMounted(() => {
  setTimeout(() => {
    const targets = chartData.value.map(d => d.value)
    startBarAnimation(targets)
  }, 300)

  setTimeout(() => {
    animateTotal()
  }, 500)
})

onBeforeUnmount(() => {
  if (barInterval) clearInterval(barInterval)
  if (totalInterval) clearInterval(totalInterval)
})
</script>

<style lang="scss" scoped>
$primary: #6c5ce7;
$secondary: #00b894;
$warning: #feca57;
$dark: #1a1a2e;
$gray: #636e72;
$light: #f8f9fa;
$white: #ffffff;
$shadow: 0 20px 60px rgba(108, 92, 231, 0.15);
$radius: 20px;
$transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
$font-heading: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
$font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

.charts {
  padding: 80px 0;
  background: $white;

  .charts-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;

    .chart-card {
      background: $light;
      padding: 32px;
      border-radius: $radius;
      transition: $transition;

      &:hover {
        transform: translateY(-4px);
        box-shadow: $shadow;
      }

      h3 {
        font-family: $font-heading;
        font-size: 1.2rem;
        font-weight: 700;
        margin-bottom: 24px;
        color: $dark;
      }

      .chart-bars {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        height: 220px;
        padding-top: 10px;
        gap: 8px;

        .bar-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          flex: 1;
          height: 100%;
          justify-content: flex-end;

          .bar-wrapper {
            width: 80%;
            min-height: 4px;
            background: linear-gradient(180deg, $primary, $secondary);
            border-radius: 8px 8px 0 0;
            transition: height 0.3s ease-out;
            height: 0%;
            position: relative;
            display: flex;
            align-items: flex-start;
            justify-content: center;

            .bar {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: flex-start;
              justify-content: center;
              position: relative;

              .bar-value {
                font-family: $font-body;
                font-size: 0.8rem;
                font-weight: 700;
                color: $white;
                padding-top: 6px;
                opacity: 0;
                transition: opacity 0.3s ease 0.5s;
                text-shadow: 0 1px 4px rgba(0,0,0,0.3);
              }
            }
          }

          .bar-wrapper[style*="height:"] .bar .bar-value {
            opacity: 1;
          }

          .bar-label {
            font-family: $font-body;
            font-size: 0.75rem;
            color: $gray;
            font-weight: 600;
            margin-top: 4px;
          }
        }
      }

      .chart-donut-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;

        .chart-donut {
          position: relative;
          width: 200px;
          height: 200px;
          margin: 0 auto 16px;

          svg {
            width: 100%;
            height: 100%;
            transform: rotate(-90deg);

            .donut-segment {
              transition: stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1);
            }
          }

          .donut-center {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .donut-value {
              font-family: $font-heading;
              font-size: 2.4rem;
              font-weight: 800;
              color: $dark;
              line-height: 1;
              transition: all 0.5s ease;
            }

            .donut-label {
              font-family: $font-body;
              font-size: 0.8rem;
              color: $gray;
              font-weight: 500;
            }
          }
        }

        .donut-legend {
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;

          div {
            display: flex;
            align-items: center;
            gap: 8px;
            font-family: $font-body;
            font-size: 0.85rem;
            color: $gray;
            font-weight: 500;

            .legend-dot {
              width: 14px;
              height: 14px;
              border-radius: 50%;
              flex-shrink: 0;
              border: 2px solid rgba(0,0,0,0.05);

              &.primary { background: #6c5ce7; }
              &.secondary { background: #00b894; }
              &.warning { background: #feca57; }
            }
          }
        }
      }
    }
  }
}

// ===== АДАПТИВ =====

@media (max-width: 1024px) {
  .charts .charts-grid {
    gap: 24px;

    .chart-card {
      padding: 24px;

      .chart-bars {
        height: 180px;

        .bar-item .bar-wrapper .bar .bar-value {
          font-size: 0.7rem;
        }
      }

      .chart-donut-wrapper .chart-donut {
        width: 160px;
        height: 160px;
      }
    }
  }
}

@media (max-width: 992px) {
  .charts .charts-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}

@media (max-width: 768px) {
  .charts {
    padding: 60px 0;

    .charts-grid {
      gap: 24px;

      .chart-card {
        padding: 20px;

        h3 {
          font-size: 1rem;
          margin-bottom: 16px;
        }

        .chart-bars {
          height: 150px;
          gap: 4px;

          .bar-item {
            .bar-wrapper {
              width: 70%;
              border-radius: 6px 6px 0 0;

              .bar .bar-value {
                font-size: 0.65rem;
                padding-top: 4px;
              }
            }

            .bar-label {
              font-size: 0.65rem;
            }
          }
        }

        .chart-donut-wrapper {
          .chart-donut {
            width: 140px;
            height: 140px;

            .donut-center {
              .donut-value {
                font-size: 1.8rem;
              }

              .donut-label {
                font-size: 0.7rem;
              }
            }
          }

          .donut-legend {
            gap: 16px;

            div {
              font-size: 0.75rem;

              .legend-dot {
                width: 12px;
                height: 12px;
              }
            }
          }
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .charts {
    padding: 40px 0;

    .charts-grid {
      gap: 16px;

      .chart-card {
        padding: 16px;
        border-radius: 14px;

        h3 {
          font-size: 0.9rem;
          margin-bottom: 12px;
        }

        .chart-bars {
          height: 120px;
          gap: 2px;

          .bar-item {
            .bar-wrapper {
              width: 60%;
              border-radius: 4px 4px 0 0;

              .bar .bar-value {
                font-size: 0.5rem;
                padding-top: 2px;
              }
            }

            .bar-label {
              font-size: 0.55rem;
            }
          }
        }

        .chart-donut-wrapper {
          .chart-donut {
            width: 110px;
            height: 110px;
            margin-bottom: 10px;

            svg circle {
              stroke-width: 20;
            }

            .donut-center {
              .donut-value {
                font-size: 1.4rem;
              }

              .donut-label {
                font-size: 0.6rem;
              }
            }
          }

          .donut-legend {
            gap: 10px;
            flex-direction: column;
            align-items: center;

            div {
              font-size: 0.7rem;

              .legend-dot {
                width: 10px;
                height: 10px;
              }
            }
          }
        }
      }
    }
  }
}
</style>