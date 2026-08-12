<template>
  <section class="cta">
    <div class="container">
      <div class="cta-content">
        <h2>{{ $t('cta.title') }}</h2>
        <p>{{ $t('cta.subtitle') }}</p>
        <router-link to="/register" class="btn-cta pulse">
          <span>{{ $t('cta.btn') }}</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M5 12H19M19 12L13 6M19 12L13 18"/>
          </svg>
        </router-link>
        <span class="note">{{ $t('cta.note') }}</span>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
$primary: #6c5ce7;
$primary-dark: #5a4bd1;
$dark: #1a1a2e;
$white: #ffffff;
$radius: 20px;
$transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
$font-heading: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
$font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

.cta {
  padding: 80px 0;
  background: $dark;

  .cta-content {
    text-align: center;

    h2 {
      font-family: $font-heading;
      font-size: 3rem;
      font-weight: 800;
      color: $white;
      margin-bottom: 12px;
      animation: fadeInUp 0.8s ease;
    }

    p {
      font-family: $font-body;
      font-size: 1.2rem;
      color: rgba($white, 0.6);
      margin-bottom: 32px;
      font-weight: 400;
      animation: fadeInUp 1s ease;
    }

    .btn-cta {
      display: inline-flex;
      align-items: center;
      gap: 14px;
      padding: 20px 52px;
      background: linear-gradient(135deg, $primary, $primary-dark);
      color: $white;
      border-radius: $radius;
      font-family: $font-heading;
      font-size: 1.2rem;
      font-weight: 700;
      transition: $transition;
      text-decoration: none;
      animation: fadeInUp 1.2s ease;
      box-shadow: 0 4px 20px rgba($primary, 0.3);

      &:hover {
        transform: translateY(-4px) scale(1.02);
        box-shadow: 0 12px 40px rgba($primary, 0.35);
      }

      svg { flex-shrink: 0; }
    }

    .note {
      display: block;
      margin-top: 12px;
      font-family: $font-body;
      font-size: 0.85rem;
      color: rgba($white, 0.3);
      font-weight: 400;
      animation: fadeInUp 1.4s ease;
    }
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

// ===== АДАПТИВ =====

@media (max-width: 768px) {
  .cta {
    padding: 60px 0;

    .cta-content {
      h2 {
        font-size: 2.2rem;
      }

      p {
        font-size: 1rem;
      }

      .btn-cta {
        padding: 16px 36px;
        font-size: 1rem;
        gap: 10px;

        svg {
          width: 20px;
          height: 20px;
        }
      }

      .note {
        font-size: 0.75rem;
      }
    }
  }
}

@media (max-width: 480px) {
  .cta {
    padding: 40px 0;

    .cta-content {
      h2 {
        font-size: 1.6rem;
      }

      p {
        font-size: 0.9rem;
        margin-bottom: 24px;
      }

      .btn-cta {
        padding: 14px 28px;
        font-size: 0.9rem;
        gap: 8px;
        border-radius: 14px;

        svg {
          width: 18px;
          height: 18px;
        }
      }

      .note {
        font-size: 0.7rem;
        margin-top: 8px;
      }
    }
  }
}
</style>