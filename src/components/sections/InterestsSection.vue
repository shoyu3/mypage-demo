<template>
  <section class="interests-section" id="interests" :style="{ minHeight: viewportHeight + 'px' }">
    <FadeInUp>
      <h2 class="section-title">{{ $t('interests.title') }}</h2>
    </FadeInUp>

    <div class="interests-grid">
      <FadeInUp 
        v-for="(key, index) in interestKeys" 
        :key="key"
        :delay="index * 100"
      >
        <div 
          class="interest-card"
          :class="{ 'is-active': activeInterest === key }"
          @click="toggleInterest(key)"
        >
          <div class="card-header">
            <div class="icon-wrapper">
              <component :is="getIcon(key)" class="interest-icon" />
            </div>
            <h3 class="interest-title">{{ $t(`interests.items.${key}.title`) }}</h3>
            <icon-lucide-chevron-down 
              class="expand-icon"
              :class="{ 'is-expanded': activeInterest === key }"
            />
          </div>
          
          <Transition name="expand">
            <div v-show="activeInterest === key" class="card-content">
              <p class="interest-desc">{{ $t(`interests.items.${key}.desc`) }}</p>
            </div>
          </Transition>
        </div>
      </FadeInUp>
    </div>

    <!-- Scroll Down Indicator -->
    <div class="scroll-indicator" @click="$emit('scrollNext')">
      <span class="scroll-text">{{ $t('home.scrollDown') }}</span>
      <div class="scroll-arrow">
        <icon-lucide-chevron-down class="arrow-icon" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import FadeInUp from '@/components/ui/FadeInUp.vue'
import IconMusic from '~icons/lucide/music'
import IconBook from '~icons/lucide/book-open'
import IconGamepad from '~icons/lucide/gamepad-2'
import IconActivity from '~icons/lucide/activity'
import IconBox from '~icons/lucide/box'

const props = defineProps({
  viewportHeight: {
    type: Number,
    default: window.innerHeight
  }
})

defineEmits(['scrollNext'])

const interestKeys = ['music', 'gaming', 'collecting']

const iconMap = {
  music: IconMusic,
  reading: IconBook,
  gaming: IconGamepad,
  sports: IconActivity,
  collecting: IconBox
}

const activeInterest = ref(null)

const getIcon = (key) => iconMap[key]

const toggleInterest = (key) => {
  activeInterest.value = activeInterest.value === key ? null : key
}
</script>

<style scoped>
.interests-section {
  padding: 4rem 1.5rem 6rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--foreground);
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
  border-radius: 2px;
}

.interests-grid {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  width: 100%;
}

.interest-card {
  background-color: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 1rem;
  padding: 1.5rem;
  backdrop-filter: blur(4px);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.interest-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary), var(--primary-hover));
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.interest-card:hover,
.interest-card.is-active {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(var(--primary-rgb), 0.15);
  border-color: var(--primary-border);
}

.interest-card:hover::before,
.interest-card.is-active::before {
  transform: scaleX(1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-wrapper {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.interest-card:hover .icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.interest-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: white;
}

.interest-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--foreground);
  flex: 1;
}

.expand-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--muted);
  transition: transform 0.3s ease;
}

.expand-icon.is-expanded {
  transform: rotate(180deg);
  color: var(--primary);
}

.card-content {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--glass-border);
}

.interest-desc {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--muted);
}

/* Expand transition */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
  opacity: 1;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
  padding-top: 0;
}

@media (max-width: 768px) {
  .interests-section {
    padding: 3rem 1rem 5rem;
  }

  .section-title {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  .interests-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .interest-card {
    padding: 1.25rem;
  }

  .icon-wrapper {
    width: 2.5rem;
    height: 2.5rem;
  }

  .interest-icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  .interest-title {
    font-size: 1.1rem;
  }
}

/* Scroll Indicator */
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  z-index: 10;
}

.scroll-text {
  font-size: 0.75rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: color 0.3s ease;
}

.scroll-arrow {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: var(--glass-bg);
  border: 1px solid var(--glass-border);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.arrow-icon {
  width: 1rem;
  height: 1rem;
  color: var(--primary);
  animation: bounce 2s infinite;
}

.scroll-indicator:hover .scroll-text {
  color: var(--primary);
}

.scroll-indicator:hover .scroll-arrow {
  border-color: var(--primary);
  transform: translateY(2px);
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-6px);
  }
  60% {
    transform: translateY(-3px);
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 1.75rem;
  }

  .card-header {
    gap: 0.75rem;
  }

  .scroll-indicator {
    bottom: 1.5rem;
  }
}
</style>
