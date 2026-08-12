<template>
  <section class="hero">
    <div class="parallax-bg">
      <div class="particle particle-1"></div>
      <div class="particle particle-2"></div>
      <div class="particle particle-3"></div>
      <div class="particle particle-4"></div>
      <div class="particle particle-5"></div>
      <div class="particle particle-6"></div>
      <div class="particle particle-7"></div>
      <div class="particle particle-8"></div>
      <div class="particle particle-9"></div>
      <div class="particle particle-10"></div>
    </div>
    
    <div class="container">
      <div class="hero-grid">
        <div class="hero-text">
          <div class="tag">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8V12L14 14"/>
            </svg>
            {{ $t('hero.tag') }}
          </div>
          
          <h1>
            <span class="gradient-text">{{ $t('hero.title') }}</span>
          </h1>
          
          <p class="subtitle">{{ $t('hero.subtitle') }}</p>
          
          <div class="actions">
            <router-link to="/register" class="btn-primary pulse">
              <span>{{ $t('hero.btn') }}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12H19M19 12L13 6M19 12L13 18"/>
              </svg>
            </router-link>
            <div class="free-badge bounce">
              <span>{{ $t('hero.badge') }}</span>
            </div>
          </div>

          <div class="stats-row">
            <div class="stat" v-for="(stat, index) in stats" :key="index">
              <div class="stat-number" :data-target="stat.target">
                {{ stat.current }}
              </div>
              <div class="stat-label">
                {{ $t(stat.labelKey) }}
              </div>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="card-3d" @mousemove="handleCardMove" @mouseleave="handleCardLeave">
            <div class="card-inner" :style="cardStyle">
              <div class="card-header">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
                <span class="card-title">{{ $t('hero.card.title') }}</span>
              </div>
              <div class="card-body">
                <div class="score-block">
                  <div class="circle-wrap">
                    <svg viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" stroke="#f0f0f0" stroke-width="8" fill="none"/>
                      <circle class="progress-ring" cx="60" cy="60" r="50" 
                        stroke="#6c5ce7" stroke-width="8" fill="none"
                        :stroke-dasharray="314" :stroke-dashoffset="314 - (314 * 87 / 100)"
                        stroke-linecap="round"/>
                    </svg>
                    <div class="value">
                      <span class="big">87</span>
                      <span class="small">/100</span>
                    </div>
                  </div>
                  <div class="score-stats">
                    <div class="score-stat">
                      <span class="num">+32%</span>
                      <span class="lab">{{ $t('hero.card.potential') }}</span>
                    </div>
                    <div class="score-stat">
                      <span class="num">14</span>
                      <span class="lab">{{ $t('hero.card.problems') }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="issues">
                  <div class="issue high" v-for="(issue, idx) in issues" :key="idx">
                    <span class="dot-icon">
                      <svg width="12" height="12" viewBox="0 0 24 24" :fill="issue.color">
                        <circle cx="12" cy="12" r="10"/>
                      </svg>
                    </span>
                    <span>{{ $t(issue.textKey) }}</span>
                    <span class="badge" :class="issue.priority">{{ $t(issue.badgeKey) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="float-item float-1">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6c5ce7" stroke-width="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
            <span>+47% {{ $t('hero.floats.growth') }}</span>
          </div>
          <div class="float-item float-2">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#feca57">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span>4.9 {{ $t('hero.floats.rating') }}</span>
          </div>
          <div class="float-item float-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00b894" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>2 {{ $t('hero.floats.minutes') }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const stats = ref([
  { target: 12847, current: 0, labelKey: 'hero.stats.checked' },
  { target: 47, current: 0, labelKey: 'hero.stats.growth' },
  { target: 49, current: 0, labelKey: 'hero.stats.rating' }
])

const issues = ref([
  { textKey: 'hero.card.issues.btn_hidden', color: '#ff6b6b', priority: 'срочно', badgeKey: 'hero.card.badges.urgent' },
  { textKey: 'hero.card.issues.no_reviews', color: '#feca57', priority: 'важно', badgeKey: 'hero.card.badges.important' },
  { textKey: 'hero.card.issues.weak_title', color: '#00b894', priority: 'совет', badgeKey: 'hero.card.badges.advice' }
])

const cardStyle = ref({ transform: 'rotateY(0deg) rotateX(0deg)' })

const handleCardMove = (e) => {
  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const rotateX = ((y - centerY) / centerY) * -10
  const rotateY = ((x - centerX) / centerX) * 10
  cardStyle.value = { transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg)` }
}

const handleCardLeave = () => {
  cardStyle.value = { transform: 'rotateY(0deg) rotateX(0deg)' }
}

onMounted(() => {
  const animateNumber = (el, target) => {
    let current = 0
    const step = Math.ceil(target / 60)
    const interval = setInterval(() => {
      current += step
      if (current >= target) {
        current = target
        clearInterval(interval)
      }
      el.textContent = current
    }, 20)
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target
        const target = parseInt(el.dataset.target)
        animateNumber(el, target)
        observer.unobserve(el)
      }
    })
  })

  document.querySelectorAll('.stat-number').forEach(el => {
    observer.observe(el)
  })
})
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

$font-heading: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
$font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
$primary: #6c5ce7;
$primary-dark: #5a4bd1;
$secondary: #00b894;
$danger: #ff6b6b;
$warning: #feca57;
$dark: #1a1a2e;
$gray: #636e72;
$white: #ffffff;
$shadow: 0 20px 60px rgba(108, 92, 231, 0.15);
$radius: 20px;
$transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

.hero {
  position: relative;
  padding: 120px 0 40px;
  background: linear-gradient(135deg, #f8f9ff 0%, #eef0ff 100%);
  overflow: hidden;
  min-height: 80vh;

  .parallax-bg {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;

    .particle {
      position: absolute;
      border-radius: 50%;
      background: linear-gradient(135deg, $primary, rgba($primary, 0.1));
      opacity: 0.2;
      animation: floatParticle 10s infinite ease-in-out;

      &.particle-1 { width: 300px; height: 300px; top: -100px; right: -50px; }
      &.particle-2 { width: 200px; height: 200px; bottom: -50px; left: -50px; background: linear-gradient(135deg, $secondary, rgba($secondary, 0.1)); }
      &.particle-3 { width: 150px; height: 150px; top: 50%; left: 50%; background: linear-gradient(135deg, $warning, rgba($warning, 0.1)); }
      &.particle-4 { width: 100px; height: 100px; top: 20%; right: 30%; background: linear-gradient(135deg, $danger, rgba($danger, 0.1)); }
      &.particle-5 { width: 80px; height: 80px; bottom: 30%; right: 20%; }
      &.particle-6 { width: 120px; height: 120px; top: 10%; left: 20%; background: linear-gradient(135deg, $secondary, rgba($secondary, 0.1)); }
      &.particle-7 { width: 60px; height: 60px; bottom: 20%; left: 30%; }
      &.particle-8 { width: 180px; height: 180px; top: 40%; right: 10%; background: linear-gradient(135deg, $warning, rgba($warning, 0.1)); }
      &.particle-9 { width: 70px; height: 70px; top: 15%; left: 10%; background: linear-gradient(135deg, $primary, rgba($primary, 0.15)); }
      &.particle-10 { width: 250px; height: 250px; bottom: 10%; right: 15%; background: linear-gradient(135deg, $secondary, rgba($secondary, 0.08)); }
    }
  }

  .hero-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: center;
    position: relative;
    z-index: 2;
  }

  .hero-text {
    .tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba($primary, 0.12);
      color: $primary;
      padding: 4px 14px;
      border-radius: 24px;
      font-size: 0.8rem;
      font-weight: 600;
      font-family: $font-body;
      margin-bottom: 16px;
      animation: fadeInUp 0.6s ease;
    }

    h1 {
      font-family: $font-heading;
      font-size: 3.2rem;
      font-weight: 800;
      line-height: 1.12;
      margin-bottom: 16px;
      color: $dark;
      animation: fadeInUp 0.8s ease;
      letter-spacing: -0.02em;

      .gradient-text {
        background: linear-gradient(135deg, $primary, $secondary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        display: inline-block;
      }
    }

    .subtitle {
      font-family: $font-body;
      font-size: 1.05rem;
      color: $gray;
      max-width: 500px;
      margin-bottom: 24px;
      line-height: 1.7;
      font-weight: 400;
      animation: fadeInUp 1s ease;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 32px;
      flex-wrap: wrap;
      animation: fadeInUp 1.2s ease;

      .btn-primary {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        padding: 14px 32px;
        background: $primary;
        color: $white;
        border-radius: $radius;
        font-family: $font-heading;
        font-weight: 700;
        font-size: 1rem;
        transition: $transition;
        text-decoration: none;
        position: relative;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba($primary, 0.25);
        letter-spacing: -0.01em;

        &:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 12px 40px rgba($primary, 0.35);
        }

        svg { flex-shrink: 0; }
      }

      .free-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba($secondary, 0.12);
        color: $secondary;
        padding: 4px 14px;
        border-radius: 24px;
        font-family: $font-body;
        font-size: 0.8rem;
        font-weight: 500;
        animation: pulse 2s infinite;
      }
    }

    .stats-row {
      display: flex;
      gap: 32px;
      animation: fadeInUp 1.4s ease;

      .stat {
        .stat-number {
          display: block;
          font-family: $font-heading;
          font-size: 1.8rem;
          font-weight: 800;
          color: $dark;
        }

        .stat-label {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: $font-body;
          font-size: 0.8rem;
          color: $gray;
          font-weight: 500;
        }
      }
    }
  }

  .hero-visual {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 380px;
    animation: fadeInUp 1.6s ease;

    .card-3d {
      perspective: 1000px;
      width: 100%;
      max-width: 420px;
      cursor: pointer;

      .card-inner {
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(20px);
        border-radius: $radius;
        box-shadow: $shadow;
        border: 1px solid rgba(255, 255, 255, 0.3);
        overflow: hidden;
        transition: transform 0.1s ease;
        transform-style: preserve-3d;

        .card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: rgba(0, 0, 0, 0.02);
          border-bottom: 1px solid rgba(0, 0, 0, 0.04);

          .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            &.red { background: $danger; }
            &.yellow { background: $warning; }
            &.green { background: $secondary; }
          }

          .card-title {
            font-family: $font-body;
            font-size: 0.8rem;
            font-weight: 500;
            color: $gray;
            margin-left: 4px;
          }
        }

        .card-body {
          padding: 16px 20px;

          .score-block {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 16px;

            .circle-wrap {
              position: relative;
              width: 100px;
              height: 100px;
              flex-shrink: 0;

              svg {
                transform: rotate(-90deg);
                .progress-ring {
                  transition: stroke-dashoffset 2s ease;
                }
              }

              .value {
                position: absolute;
                inset: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                .big {
                  font-family: $font-heading;
                  font-size: 2rem;
                  font-weight: 800;
                  color: $dark;
                  line-height: 1;
                }

                .small {
                  font-family: $font-body;
                  font-size: 0.7rem;
                  color: $gray;
                  font-weight: 600;
                }
              }
            }

            .score-stats {
              display: flex;
              flex-direction: column;
              gap: 4px;

              .score-stat {
                .num {
                  display: block;
                  font-family: $font-heading;
                  font-size: 1.1rem;
                  font-weight: 700;
                  color: $primary;
                }

                .lab {
                  font-family: $font-body;
                  font-size: 0.7rem;
                  color: $gray;
                  font-weight: 500;
                }
              }
            }
          }

          .issues {
            display: flex;
            flex-direction: column;
            gap: 6px;

            .issue {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 6px 12px;
              border-radius: 8px;
              font-family: $font-body;
              font-size: 0.8rem;
              font-weight: 500;
              animation: slideIn 0.6s ease forwards;
              opacity: 0;

              &:nth-child(1) { animation-delay: 0.1s; }
              &:nth-child(2) { animation-delay: 0.2s; }
              &:nth-child(3) { animation-delay: 0.3s; }

              &.high {
                background: rgba($danger, 0.08);
                border-left: 3px solid $danger;
              }

              .badge {
                margin-left: auto;
                font-size: 0.6rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                padding: 2px 8px;
                border-radius: 12px;
                background: rgba(0, 0, 0, 0.04);
                font-weight: 600;

                &.срочно { color: $danger; }
                &.важно { color: $warning; }
                &.совет { color: $secondary; }
              }
            }
          }
        }
      }
    }

    .float-item {
      position: absolute;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      padding: 8px 14px;
      border-radius: 10px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: $font-heading;
      font-size: 0.8rem;
      font-weight: 700;
      color: $dark;
      border: 1px solid rgba(255, 255, 255, 0.3);
      animation: float 4s ease-in-out infinite;
      white-space: nowrap;

      &.float-1 {
        top: -10px;
        right: -10px;
        animation-delay: 0s;
        color: $primary;
      }
      &.float-2 {
        bottom: 60px;
        left: -20px;
        animation-delay: 1.5s;
        color: $warning;
      }
      &.float-3 {
        top: 40%;
        right: -15px;
        animation-delay: 3s;
        color: $secondary;
      }

      svg {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
      }
    }
  }
}

// ===== АДАПТИВ =====

@media (max-width: 1024px) {
  .hero {
    padding: 100px 0 30px;

    .hero-text h1 {
      font-size: 2.8rem;
    }

    .hero-visual .float-item {
      font-size: 0.7rem;
      padding: 6px 12px;

      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
}

@media (max-width: 992px) {
  .hero .hero-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .hero .hero-text {
    text-align: center;

    .subtitle {
      max-width: 100%;
      margin-left: auto;
      margin-right: auto;
    }

    .actions {
      justify-content: center;
    }

    .stats-row {
      justify-content: center;
    }
  }

  .hero .hero-visual {
    min-height: 300px;

    .card-3d {
      max-width: 380px;
    }

    .float-item {
      &.float-1 { top: -5px; right: 5px; }
      &.float-2 { bottom: 40px; left: 5px; }
      &.float-3 { top: 40%; right: 5px; }
    }
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 80px 0 20px;
    min-height: auto;

    .hero-text {
      h1 {
        font-size: 2.2rem;
      }

      .subtitle {
        font-size: 0.95rem;
      }

      .actions {
        .btn-primary {
          padding: 12px 24px;
          font-size: 0.9rem;
        }

        .free-badge {
          font-size: 0.7rem;
          padding: 3px 12px;
        }
      }

      .stats-row {
        gap: 20px;

        .stat {
          .stat-number {
            font-size: 1.4rem;
          }

          .stat-label {
            font-size: 0.7rem;
          }
        }
      }
    }

    .hero-visual {
      min-height: 280px;

      .card-3d {
        max-width: 340px;

        .card-inner {
          .card-body {
            padding: 12px 16px;

            .score-block {
              .circle-wrap {
                width: 80px;
                height: 80px;
              }

              .score-stats .score-stat .num {
                font-size: 0.95rem;
              }
            }

            .issues .issue {
              font-size: 0.7rem;
              padding: 4px 10px;
            }
          }
        }
      }

      .float-item {
        font-size: 0.65rem;
        padding: 4px 10px;

        svg {
          width: 14px;
          height: 14px;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 60px 0 16px;

    .hero-text {
      h1 {
        font-size: 1.8rem;
      }

      .subtitle {
        font-size: 0.85rem;
      }

      .actions {
        gap: 10px;

        .btn-primary {
          padding: 10px 18px;
          font-size: 0.8rem;
          gap: 8px;

          svg {
            width: 16px;
            height: 16px;
          }
        }

        .free-badge {
          font-size: 0.65rem;
          padding: 2px 10px;
        }
      }

      .stats-row {
        gap: 16px;
        flex-wrap: wrap;
        justify-content: center;

        .stat {
          .stat-number {
            font-size: 1.2rem;
          }

          .stat-label {
            font-size: 0.65rem;
          }
        }
      }
    }

    .hero-visual {
      min-height: 240px;

      .card-3d {
        max-width: 280px;

        .card-inner {
          .card-header {
            padding: 6px 12px;

            .card-title {
              font-size: 0.7rem;
            }
          }

          .card-body {
            padding: 10px 12px;

            .score-block {
              gap: 10px;

              .circle-wrap {
                width: 60px;
                height: 60px;

                .value .big {
                  font-size: 1.4rem;
                }

                .value .small {
                  font-size: 0.6rem;
                }
              }

              .score-stats .score-stat {
                .num {
                  font-size: 0.85rem;
                }

                .lab {
                  font-size: 0.6rem;
                }
              }
            }

            .issues .issue {
              font-size: 0.65rem;
              padding: 3px 8px;
              gap: 4px;

              .badge {
                font-size: 0.5rem;
                padding: 1px 6px;
              }
            }
          }
        }
      }

      .float-item {
        font-size: 0.55rem;
        padding: 3px 8px;
        border-radius: 6px;

        svg {
          width: 12px;
          height: 12px;
        }

        &.float-1 { top: -2px; right: 2px; }
        &.float-2 { bottom: 30px; left: 2px; }
        &.float-3 { top: 35%; right: 2px; }
      }
    }

    .parallax-bg .particle {
      display: none;
    }
  }
}

// ===== АНИМАЦИИ =====

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes floatParticle {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}
</style>