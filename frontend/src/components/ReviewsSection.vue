<template>
  <section class="reviews">
    <div class="container">
      <div class="reviews-grid">
        <div class="review-card" v-for="(review, index) in reviews" :key="index">
          <div class="review-stars">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#feca57"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#feca57"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#feca57"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#feca57"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#feca57"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p>"{{ review.text }}"</p>
          <div class="review-author">
            <span class="name">{{ review.name }}</span>
            <span class="role">{{ review.role }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

// Русские отзывы (запасной вариант)
const ruReviews = [
  { 
    text: 'За 3 недели после внедрения рекомендаций конверсия выросла на 43%, а показатель отказов снизился на 28%. Лучшая инвестиция в маркетинг за последний год.',
    name: 'Андрей Козлов', 
    role: 'CEO, SalesTech' 
  },
  { 
    text: 'Нашли 17 скрытых проблем, которые мы не замечали годами. После исправления продажи увеличились на 35%, а средний чек вырос на 22%.',
    name: 'Екатерина Морозова', 
    role: 'Маркетолог, DigitalPro' 
  },
  { 
    text: 'Запустили сайт, прогоняли через аудит — исправили ошибки, которые стоили нам 60% трафика. Теперь сайт в топе Яндекса по 15 ключевым запросам.',
    name: 'Дмитрий Волков', 
    role: 'Основатель, MediaWave' 
  }
]

// Английские отзывы (запасной вариант)
const enReviews = [
  { 
    text: 'Within 3 weeks of implementing the recommendations, conversion grew by 43% and bounce rate dropped by 28%. The best marketing investment in the last year.',
    name: 'Andrey Kozlov', 
    role: 'CEO, SalesTech' 
  },
  { 
    text: 'Found 17 hidden issues we had been missing for years. After fixing them, sales increased by 35% and average order value grew by 22%.',
    name: 'Ekaterina Morozova', 
    role: 'Marketer, DigitalPro' 
  },
  { 
    text: 'Launched the website, ran it through the audit — fixed issues that were costing us 60% of traffic. Now the site is in Yandex top 15 for key queries.',
    name: 'Dmitry Volkov', 
    role: 'Founder, MediaWave' 
  }
]

// Реактивный массив с отзывами
const reviews = ref(ruReviews)

// Функция обновления отзывов
const updateReviews = () => {
  try {
    const translated = t('reviews.reviews')
    if (translated && Array.isArray(translated) && translated.length > 0) {
      reviews.value = translated
    } else {
      // Если перевод не загрузился — используем запасной вариант
      reviews.value = locale.value === 'ru' ? ruReviews : enReviews
    }
  } catch (error) {
    // В случае ошибки — запасной вариант
    reviews.value = locale.value === 'ru' ? ruReviews : enReviews
  }
}

// Обновляем при монтировании
onMounted(() => {
  updateReviews()
})

// Следим за сменой языка
watch(locale, () => {
  updateReviews()
})
</script>

<style lang="scss" scoped>
$primary: #6c5ce7;
$dark: #1a1a2e;
$gray: #636e72;
$light: #f8f9fa;
$white: #ffffff;
$shadow: 0 20px 60px rgba(108, 92, 231, 0.15);
$radius: 20px;
$transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
$font-heading: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
$font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

.reviews {
  padding: 80px 0;
  background: $light;

  .reviews-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;

    .review-card {
      background: $white;
      padding: 32px;
      border-radius: $radius;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
      transition: $transition;
      animation: fadeInUp 0.8s ease forwards;
      opacity: 0;

      &:nth-child(1) { animation-delay: 0.1s; }
      &:nth-child(2) { animation-delay: 0.2s; }
      &:nth-child(3) { animation-delay: 0.3s; }

      &:hover {
        transform: translateY(-6px);
        box-shadow: $shadow;
      }

      .review-stars {
        display: flex;
        gap: 2px;
        margin-bottom: 12px;

        svg { width: 18px; height: 18px; }
      }

      p {
        font-family: $font-body;
        font-size: 1rem;
        font-weight: 500;
        color: $dark;
        margin-bottom: 12px;
        line-height: 1.6;
      }

      .review-author {
        .name {
          display: block;
          font-family: $font-heading;
          font-weight: 700;
          color: $dark;
        }

        .role {
          font-family: $font-body;
          font-size: 0.85rem;
          color: $gray;
          font-weight: 400;
        }
      }
    }
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

// ===== АДАПТИВ =====

@media (max-width: 1024px) {
  .reviews .reviews-grid {
    gap: 24px;

    .review-card {
      padding: 24px;

      p {
        font-size: 0.95rem;
      }
    }
  }
}

@media (max-width: 992px) {
  .reviews .reviews-grid {
    grid-template-columns: repeat(2, 1fr);

    .review-card:last-child {
      grid-column: span 2;
      max-width: 50%;
      margin: 0 auto;
    }
  }
}

@media (max-width: 768px) {
  .reviews {
    padding: 60px 0;

    .reviews-grid {
      gap: 16px;

      .review-card {
        padding: 20px;
        border-radius: 14px;

        .review-stars svg {
          width: 16px;
          height: 16px;
        }

        p {
          font-size: 0.9rem;
        }

        .review-author {
          .name {
            font-size: 0.9rem;
          }

          .role {
            font-size: 0.75rem;
          }
        }
      }
    }
  }
}

@media (max-width: 600px) {
  .reviews {
    padding: 40px 0;

    .reviews-grid {
      grid-template-columns: 1fr;
      gap: 16px;

      .review-card {
        padding: 18px;
        border-radius: 12px;

        &:last-child {
          grid-column: auto;
          max-width: 100%;
          margin: 0;
        }

        .review-stars {
          margin-bottom: 8px;

          svg {
            width: 14px;
            height: 14px;
          }
        }

        p {
          font-size: 0.85rem;
          margin-bottom: 8px;
        }

        .review-author {
          .name {
            font-size: 0.85rem;
          }

          .role {
            font-size: 0.7rem;
          }
        }
      }
    }
  }
}
</style>