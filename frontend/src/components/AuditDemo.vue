<template>
  <section class="audit-demo">
    <div class="container">
      <div class="demo-header">
        <span class="badge">{{ t('audit_demo.badge') }}</span>
        <h2>{{ t('audit_demo.title') }}</h2>
        <p>{{ t('audit_demo.subtitle') }}</p>
      </div>

   
      <div class="demo-video-wrapper">
        <div class="video-container">
          <video 
            ref="videoRef"
            class="demo-video"
            muted
            playsinline
            @click="togglePlay"
            preload="metadata"
          >
            <source src="/promo.mp4" type="video/mp4"/>
            {{ t('audit_demo.video_not_supported') }}
          </video>
          
          <button 
            class="play-btn" 
            @click="togglePlay"
            :class="{ playing: isPlaying }"
          >
            <span v-if="!isPlaying">▶</span>
            <span v-else>⏸</span>
          </button>
        </div>
      </div>

      <div v-if="showButton" class="demo-actions">
        <router-link to="/dashboard" class="btn btn-primary">
          {{ t('audit_demo.try_now') }}
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  showButton: {
    type: Boolean,
    default: true
  }
})

const videoRef = ref(null)
const isPlaying = ref(false)

const togglePlay = () => {
  const video = videoRef.value
  if (!video) return
  
  if (video.paused) {
    video.play()
    isPlaying.value = true
  } else {
    video.pause()
    isPlaying.value = false
  }
}

const handleIntersection = (entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      videoRef.value?.play()
      isPlaying.value = true
    } else {
      videoRef.value?.pause()
      isPlaying.value = false
    }
  })
}

onMounted(() => {
  const observer = new IntersectionObserver(handleIntersection, {
    threshold: 0.5
  })
  
  if (videoRef.value) {
    observer.observe(videoRef.value)
  }
})

onBeforeUnmount(() => {
  const video = videoRef.value
  if (video) {
    video.pause()
  }
})
</script>

<style lang="scss" scoped>
.audit-demo {
  padding: 60px 0;
  background: #f8f9fc;
}

.demo-header {
  text-align: center;
  margin-bottom: 48px;

  .badge {
    display: inline-block;
    background: rgba(108, 92, 231, 0.1);
    color: #6c5ce7;
    padding: 4px 16px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 12px;
  }

  h2 {
    font-size: 2.4rem;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 12px;
  }

  p {
    font-size: 1.1rem;
    color: #636e72;
    max-width: 600px;
    margin: 0 auto;
  }
}

.demo-video-wrapper {
  max-width: 900px;
  margin: 0 auto;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  background: #000;
}


.video-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9; 
  background: #0a0a0a;
  cursor: pointer;
  overflow: hidden;
}

.demo-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  background: #000;
}


.video-container::before {
  content: '🎬';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 4rem;
  color: rgba(255,255,255,0.3);
  z-index: 1;
  pointer-events: none;
}

.play-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(108, 92, 231, 0.9);
  border: 3px solid rgba(255,255,255,0.3);
  color: white;
  font-size: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  &:hover {
    transform: translate(-50%, -50%) scale(1.1);
    background: rgba(108, 92, 231, 1);
    box-shadow: 0 0 40px rgba(108, 92, 231, 0.4);
  }

  &.playing {
    opacity: 0;
    pointer-events: none;

    &:hover {
      opacity: 1;
      pointer-events: auto;
    }
  }

  span {
    margin-left: 4px;
  }
}

.demo-actions {
  display: flex;
  justify-content: center;
  margin-top: 32px;

  .btn {
    padding: 14px 48px;
    font-size: 1.1rem;
  }
}

/* ===== АДАПТИВ ===== */
@media (max-width: 768px) {
  .demo-header {
    h2 {
      font-size: 1.8rem;
    }
  }

  .play-btn {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }

  .demo-actions .btn {
    padding: 12px 32px;
    font-size: 1rem;
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .demo-header {
    h2 {
      font-size: 1.4rem;
    }
  }

  .play-btn {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
}
</style>
