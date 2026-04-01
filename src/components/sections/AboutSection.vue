<template>
  <section class="about-section" id="about">
    <TiltContainer class="tilt-wrapper">
      <div class="container">
        <FadeInUp direction="left" class="content-wrapper">
          <div class="text-content">
            <h2 class="section-title">{{ $t('about.title') }}</h2>
            <div class="story-text">
              <p v-for="(paragraph, index) in storyParagraphs" :key="index" class="paragraph">
                {{ paragraph }}
              </p>
            </div>
          </div>
        </FadeInUp>

        <FadeInUp direction="right" :delay="200" class="image-wrapper">
          <div class="avatar-showcase">
            <div class="avatar-ring">
              <img src="/sakuryne260401.webp" alt="avatar" class="showcase-img" />
            </div>
            <div class="floating-elements">
              <span class="float-item" style="--delay: 0s">✨</span>
              <span class="float-item" style="--delay: 0.5s">🌸</span>
              <span class="float-item" style="--delay: 1s">💻</span>
              <span class="float-item" style="--delay: 1.5s">☕</span>
            </div>
          </div>
        </FadeInUp>
      </div>

      <FadeInUp :delay="400" class="philosophy-wrapper">
        <div class="philosophy-card">
          <icon-lucide-quote class="quote-icon" />
          <TypeWriter 
            :text="$t('about.philosophy')" 
            :speed="60" 
            :delay="800"
            class="philosophy-text"
          />
        </div>
      </FadeInUp>
    </TiltContainer>


  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import FadeInUp from '@/components/ui/FadeInUp.vue'
import TypeWriter from '@/components/ui/TypeWriter.vue'
import TiltContainer from '@/components/TiltContainer.vue'



const { t } = useI18n()

const storyParagraphs = computed(() => {
  const story = t('about.story')
  return story.split('\n\n').filter(p => p.trim())
})
</script>

<style scoped>
.about-section {
  padding: 4rem 1.5rem 6rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
  perspective: 1000px;
  min-height: 100vh;
  flex-shrink: 0;
}

.tilt-wrapper {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.about-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--glass-border), transparent);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 4rem;
  align-items: center;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--foreground);
  margin-bottom: 2rem;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, var(--primary), transparent);
  border-radius: 2px;
}

.story-text {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.paragraph {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--muted);
  text-align: justify;
}

.image-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-showcase {
  position: relative;
  width: 280px;
  height: 280px;
}

.avatar-ring {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  padding: 8px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 50%, var(--primary) 100%);
  background-size: 200% 200%;
  animation: gradient-rotate 4s ease infinite;
  box-shadow: 0 20px 60px rgba(var(--primary-rgb), 0.3);
}

@keyframes gradient-rotate {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.showcase-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid var(--background);
}

.floating-elements {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.float-item {
  position: absolute;
  font-size: 1.5rem;
  animation: float 3s ease-in-out infinite;
  animation-delay: var(--delay);
  opacity: 0.8;
}

.float-item:nth-child(1) { top: 10%; right: 0; }
.float-item:nth-child(2) { top: 50%; right: -10%; }
.float-item:nth-child(3) { bottom: 10%; right: 5%; }
.float-item:nth-child(4) { bottom: 30%; left: -5%; }

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
}

.philosophy-wrapper {
  max-width: 800px;
  margin: 4rem auto 0;
  width: 100%;
}

.philosophy-card {
  background-color: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 1rem;
  padding: 2rem 2.5rem;
  backdrop-filter: blur(4px);
  position: relative;
  text-align: center;
}

.quote-icon {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 24px;
  color: var(--primary);
  background: var(--background);
  padding: 0 8px;
}

.philosophy-text {
  font-size: 1.25rem;
  font-style: italic;
  color: var(--foreground);
  line-height: 1.6;
}

@media (max-width: 968px) {
  .container {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .text-content {
    order: 2;
  }

  .image-wrapper {
    order: 1;
  }

  .avatar-showcase {
    width: 200px;
    height: 200px;
  }

  .section-title {
    font-size: 2rem;
    text-align: center;
  }

  .section-title::after {
    left: 50%;
    transform: translateX(-50%);
  }

  .paragraph {
    text-align: left;
  }
}



@media (max-width: 480px) {
  .about-section {
    padding: 3rem 1rem 5rem;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .paragraph {
    font-size: 1rem;
  }

  .philosophy-card {
    padding: 1.5rem;
  }

  .philosophy-text {
    font-size: 1.1rem;
  }


}
</style>
