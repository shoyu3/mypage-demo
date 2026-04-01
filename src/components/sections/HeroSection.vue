<template>
  <section class="hero-section" id="hero" style="min-height: 100vh">
    <TiltContainer class="cards-wrapper">
      <div
        class="card card-first"
        :class="{ 'animate': showFirstCard }"
      >
        <div class="card-content">
          <div class="avatar">
            <img src="/sakuryne260401.webp" alt="avatar" class="avatar-img" />
          </div>
          <div class="info-section">
            <h1 class="name">{{ $t('home.name') }}</h1>
            <p class="tagline">{{ $t('home.tagline') }}</p>
            <div class="social-links">
              <a href="https://github.com/shoyu3" target="_blank" rel="noopener" class="social-link" :title="$t('home.social.github')">
                <icon-lucide-github />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div
        class="card card-second"
        :class="{ 'animate': showSecondCard }"
      >
        <div class="card-content">
          <div class="tech-section">
            <h2 class="section-title">{{ $t('home.techStack') }}</h2>
            <div class="tech-tags">
              <span class="tech-tag">Vue</span>
              <span class="tech-tag">React</span>
              <span class="tech-tag">Node.js</span>
              <span class="tech-tag">Python</span>
            </div>
          </div>
          <div class="stats-section">
            <div class="stat-item">
              <span class="stat-value">30+</span>
              <span class="stat-label">{{ $t('home.stats.years') }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">10+</span>
              <span class="stat-label">{{ $t('home.stats.projects') }}</span>
            </div>
          </div>
        </div>
      </div>
    </TiltContainer>
  </section>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import TiltContainer from '@/components/TiltContainer.vue'

const isFirstLoad = inject('isFirstLoad')
const showFirstCard = ref(false)
const showSecondCard = ref(false)

onMounted(() => {
  const baseDelay = isFirstLoad.value ? 500 : 100
  setTimeout(() => {
    showFirstCard.value = true
  }, baseDelay)
  setTimeout(() => {
    showSecondCard.value = true
  }, baseDelay + 300)
})
</script>

<style scoped>
.hero-section {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  perspective: 1000px;
}

.cards-wrapper {
  position: absolute;
  inset: 0;
}

.card {
  background-color: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 1rem;
  padding: 1rem 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 550px;
  width: 100%;
  min-height: 170px;
  backdrop-filter: blur(4px);
  transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  position: absolute;
  top: 50%;
  left: 50%;
  opacity: 0;
  display: flex;
  align-items: center;
}

.card-first {
  transform: translate(-50%, -50%) scale(0.3);
  transition: opacity 0.4s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card-first.animate {
  opacity: 1;
  transform: translate(calc(-50% - 10vw), calc(-50% - 15vh)) scale(1);
}

.card-second {
  transform: translate(-50%, -50%) scale(0.3);
  transition: opacity 0.4s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card-second.animate {
  opacity: 1;
  transform: translate(calc(-50% + 10vw), calc(-50% + 15vh)) scale(1);
}

.card-first .card-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
}

.avatar {
  flex-shrink: 0;
  width: 7rem;
  height: 7rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(var(--primary-rgb), 0.3);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.info-section {
  flex: 1;
  text-align: right;
}

.name {
  color: var(--foreground);
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.375rem;
  transition: color 0.3s ease;
}

.tagline {
  color: var(--muted);
  font-size: 0.875rem;
  margin-bottom: 1rem;
  transition: color 0.3s ease;
}

.social-links {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.social-link {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  background-color: var(--primary-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--foreground);
  transition: all 0.3s ease;
}

.social-link:hover {
  background-color: var(--primary);
  color: #ffffff;
  transform: translateY(-2px);
}

.social-link svg {
  width: 1.125rem;
  height: 1.125rem;
}

.card-second .card-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  width: 100%;
}

.tech-section {
  flex: 1;
}

.section-title {
  color: var(--foreground);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  transition: color 0.3s ease;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.tech-tag {
  padding: 0.25rem 0.625rem;
  background-color: var(--primary-bg);
  color: var(--primary);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.tech-tag:hover {
  background-color: var(--primary);
  color: #ffffff;
}

.stats-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.stat-value {
  color: var(--primary);
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  color: var(--muted);
  font-size: 0.7rem;
  margin-top: 0.125rem;
}

@media (max-width: 768px) {
  .hero-section {
    padding: 1rem;
  }

  .card {
    padding: 2rem 1.5rem;
    max-width: none;
    width: 75%;
  }

  .card-first.animate {
    transform: translate(calc(-50% - 15%), calc(-50% - 22vh)) scale(1);
  }

  .card-second.animate {
    transform: translate(calc(-50% + 15%), calc(-50% + 4vh)) scale(1);
  }

  .card-first .card-content {
    gap: 1rem;
  }

  .avatar {
    width: 6rem;
    height: 6rem;
  }

  .name {
    font-size: 1.625rem;
  }

  .tagline {
    font-size: 0.875rem;
    margin-bottom: 0.75rem;
  }

  .social-link {
    width: 2.25rem;
    height: 2.25rem;
  }

  .social-link svg {
    width: 1.125rem;
    height: 1.125rem;
  }

  .card-second .card-content {
    gap: 1rem;
  }

  .section-title {
    font-size: 1rem;
  }

  .tech-tag {
    padding: 0.25rem 0.625rem;
    font-size: 0.75rem;
  }

  .stat-value {
    font-size: 1.25rem;
  }

  .stat-label {
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .card {
    padding: 1.75rem 1.25rem;
    width: 85%;
  }

  .card-first.animate {
    transform: translate(calc(-50% - 5%), calc(-50% - 20vh)) scale(1);
  }

  .card-second.animate {
    transform: translate(calc(-50% + 5%), calc(-50% + 2vh)) scale(1);
  }

  .avatar {
    width: 5rem;
    height: 5rem;
  }

  .name {
    font-size: 1.375rem;
  }

  .tagline {
    font-size: 0.8rem;
    margin-bottom: 0.625rem;
  }

  .social-link {
    width: 2rem;
    height: 2rem;
    border-radius: 0.375rem;
  }

  .social-link svg {
    width: 1rem;
    height: 1rem;
  }

  .section-title {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .tech-tags {
    gap: 0.25rem;
  }

  .tech-tag {
    padding: 0.2rem 0.5rem;
    font-size: 0.7rem;
  }

  .stats-section {
    gap: 0.5rem;
  }

  .stat-value {
    font-size: 1.125rem;
  }

  .stat-label {
    font-size: 0.65rem;
  }
}
</style>
