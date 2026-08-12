<template>
  <section class="features">
    <div class="container">
      <div class="section-header">
        <span class="badge">{{ $t('features.badge') }}</span>
        <h2>{{ $t('features.title') }}</h2>
        <p class="section-subtitle">{{ $t('features.subtitle') }}</p>
      </div>
      
      <div class="features-grid">
        <div class="feature-card" v-for="index in 4" :key="index">
          <div class="feature-number">0{{ index }}</div>
          <div class="feature-icon" :class="`icon-${index}`">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <template v-if="index === 1">
                <path d="M10 13C10 14.1046 9.10457 15 8 15C6.89543 15 6 14.1046 6 13C6 11.8954 6.89543 11 8 11C9.10457 11 10 11.8954 10 13Z"/>
                <path d="M18 8C18 9.10457 17.1046 10 16 10C14.8954 10 14 9.10457 14 8C14 6.89543 14.8954 6 16 6C17.1046 6 18 6.89543 18 8Z"/>
                <line x1="8" y1="15" x2="14" y2="9"/>
                <circle cx="12" cy="12" r="10"/>
              </template>
              <template v-else-if="index === 2">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"/>
                <circle cx="12" cy="9" r="3"/>
              </template>
              <template v-else-if="index === 3">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
              </template>
              <template v-else>
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </template>
            </svg>
          </div>
          <h3>{{ $t(`features.cards.${index - 1}.title`) }}</h3>
          <p>{{ $t(`features.cards.${index - 1}.desc`) }}</p>
          <div class="feature-line">
            <div class="line-fill" :style="{ width: index * 25 + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Всё через $t() в шаблоне — ничего в скрипте не нужно!
</script>

<style lang="scss" scoped>
$primary: #6c5ce7;
$secondary: #00b894;
$dark: #1a1a2e;
$gray: #636e72;
$white: #ffffff;
$shadow: 0 20px 60px rgba(108, 92, 231, 0.15);
$radius: 20px;
$transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
$font-heading: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
$font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

.features {
  padding: 80px 0;
  background: linear-gradient(135deg, #f8f9ff, #eef0ff);

  .section-header {
    text-align: center;
    margin-bottom: 60px;

    .badge {
      display: inline-block;
      background: rgba($primary, 0.1);
      color: $primary;
      padding: 4px 16px;
      border-radius: 24px;
      font-family: $font-body;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 12px;
    }

    h2 {
      font-family: $font-heading;
      font-size: 2.8rem;
      font-weight: 700;
      color: $dark;
      margin-bottom: 8px;
    }

    .section-subtitle {
      font-family: $font-body;
      font-size: 1.1rem;
      color: $gray;
      font-weight: 400;
    }
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;

    .feature-card {
      background: $white;
      padding: 36px 28px;
      border-radius: $radius;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
      transition: $transition;
      text-align: center;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: $radius;
        padding: 2px;
        background: linear-gradient(135deg, $primary, $secondary);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        opacity: 0;
        transition: opacity 0.4s ease;
      }

      &:hover {
        transform: translateY(-8px);
        box-shadow: $shadow;

        &::before {
          opacity: 1;
        }

        .feature-icon {
          transform: scale(1.1) rotate(-5deg);
        }

        .feature-number {
          color: rgba($primary, 0.15);
        }

        .line-fill {
          width: 100% !important;
        }
      }

      .feature-number {
        font-family: $font-heading;
        font-size: 3rem;
        font-weight: 800;
        color: rgba($primary, 0.06);
        line-height: 1;
        margin-bottom: 8px;
        transition: color 0.4s ease;
      }

      .feature-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        margin-bottom: 20px;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

        &.icon-1 {
          background: linear-gradient(135deg, #6c5ce7, #a29bfe);
          box-shadow: 0 4px 20px rgba(108, 92, 231, 0.3);
        }
        &.icon-2 {
          background: linear-gradient(135deg, #00b894, #55efc4);
          box-shadow: 0 4px 20px rgba(0, 184, 148, 0.3);
        }
        &.icon-3 {
          background: linear-gradient(135deg, #fdcb6e, #feca57);
          box-shadow: 0 4px 20px rgba(254, 202, 87, 0.3);
        }
        &.icon-4 {
          background: linear-gradient(135deg, #fd79a8, #e17055);
          box-shadow: 0 4px 20px rgba(225, 112, 85, 0.3);
        }

        svg {
          flex-shrink: 0;
          stroke: white;
          stroke-width: 1.8;
          width: 32px;
          height: 32px;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
          transition: transform 0.4s ease;
        }
      }

      h3 {
        font-family: $font-heading;
        font-size: 1.2rem;
        font-weight: 700;
        margin-bottom: 8px;
        color: $dark;
      }

      p {
        font-family: $font-body;
        color: $gray;
        font-size: 0.95rem;
        line-height: 1.6;
        font-weight: 400;
      }

      .feature-line {
        margin-top: 16px;
        height: 3px;
        background: #e9ecef;
        border-radius: 2px;
        overflow: hidden;

        .line-fill {
          height: 100%;
          background: linear-gradient(90deg, $primary, $secondary);
          border-radius: 2px;
          transition: width 1.5s ease;
          width: 0;
        }
      }
    }
  }
}

// ===== АДАПТИВ =====
@media (max-width: 1024px) {
  .features {
    padding: 60px 0;
    .section-header {
      margin-bottom: 40px;
      h2 { font-size: 2.2rem; }
    }
    .features-grid {
      gap: 20px;
      .feature-card {
        padding: 28px 20px;
        .feature-icon {
          width: 64px;
          height: 64px;
          svg { width: 26px; height: 26px; }
        }
        h3 { font-size: 1.05rem; }
        p { font-size: 0.85rem; }
      }
    }
  }
}

@media (max-width: 992px) {
  .features .features-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .features {
    padding: 50px 0;
    .section-header {
      margin-bottom: 32px;
      .badge { font-size: 0.65rem; padding: 3px 12px; margin-bottom: 8px; }
      h2 { font-size: 1.8rem; }
      .section-subtitle { font-size: 0.9rem; }
    }
    .features-grid {
      gap: 16px;
      .feature-card {
        padding: 20px 16px;
        border-radius: 16px;
        .feature-number { font-size: 2rem; margin-bottom: 4px; }
        .feature-icon { width: 52px; height: 52px; margin-bottom: 12px; svg { width: 20px; height: 20px; } }
        h3 { font-size: 0.9rem; margin-bottom: 4px; }
        p { font-size: 0.75rem; line-height: 1.5; }
        .feature-line { margin-top: 10px; height: 2px; }
      }
    }
  }
}

@media (max-width: 480px) {
  .features {
    padding: 40px 0;
    .section-header {
      margin-bottom: 24px;
      h2 { font-size: 1.5rem; }
      .section-subtitle { font-size: 0.8rem; }
    }
    .features-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      .feature-card {
        padding: 14px 10px;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
        .feature-number { font-size: 1.4rem; margin-bottom: 2px; }
        .feature-icon { width: 40px; height: 40px; margin-bottom: 8px; svg { width: 16px; height: 16px; stroke-width: 2; } }
        h3 { font-size: 0.7rem; margin-bottom: 2px; line-height: 1.2; }
        p { font-size: 0.6rem; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .feature-line { margin-top: 6px; height: 2px; }
        &:hover { transform: none; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04); &::before { opacity: 0; } .feature-icon { transform: none; } .feature-number { color: rgba($primary, 0.06); } .line-fill { width: auto !important; } }
      }
    }
  }
}

@media (max-width: 380px) {
  .features {
    padding: 30px 0;
    .features-grid {
      gap: 8px;
      .feature-card {
        padding: 12px 8px;
        border-radius: 10px;
        .feature-number { font-size: 1.2rem; }
        .feature-icon { width: 34px; height: 34px; margin-bottom: 6px; svg { width: 14px; height: 14px; } }
        h3 { font-size: 0.6rem; }
        p { font-size: 0.55rem; -webkit-line-clamp: 2; }
        .feature-line { margin-top: 4px; height: 1.5px; }
      }
    }
  }
}

@media (max-width: 320px) {
  .features .features-grid {
    grid-template-columns: 1fr;
    max-width: 280px;
    margin: 0 auto;
    .feature-card {
      padding: 16px 14px;
      .feature-icon { width: 48px; height: 48px; svg { width: 20px; height: 20px; } }
      h3 { font-size: 0.85rem; }
      p { font-size: 0.7rem; -webkit-line-clamp: none; }
    }
  }
}
</style>