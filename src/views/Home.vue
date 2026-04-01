<template>
  <div class="home">
    <TiltContainer class="cards-wrapper">
      <div
        class="card card-first"
        :class="{ 'animate': showFirstCard }"
      >
        <h1>{{ $t('home.title') }}</h1>
        <p>{{ $t('home.description') }}</p>
      </div>
      <div
        class="card card-second"
        :class="{ 'animate': showSecondCard }"
      >
        <h1>{{ $t('home.title1') }}</h1>
        <p>{{ $t('home.content1') }}</p>
      </div>
    </TiltContainer>
    <FloatingControls />
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import TiltContainer from '@/components/TiltContainer.vue'
import FloatingControls from '@/components/FloatingControls.vue'

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
.home {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--background) 0%, var(--primary-bg) 100%);
  padding: 1.5rem;
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease;
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
  padding: 3rem 4rem;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  backdrop-filter: blur(4px);
  transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  position: absolute;
  top: 50%;
  left: 50%;
  opacity: 0;
}

/* 第一个卡片 - 从中心跃出到上方偏左 */
.card-first {
  transform: translate(-50%, -50%) scale(0.3);
  transition: opacity 0.4s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card-first.animate {
  opacity: 1;
  transform: translate(calc(-50% - 10vw), calc(-50% - 15vh)) scale(1);
}

/* 第二个卡片 - 从中心跃出到下方偏右 */
.card-second {
  transform: translate(-50%, -50%) scale(0.3);
  transition: opacity 0.4s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card-second.animate {
  opacity: 1;
  transform: translate(calc(-50% + 10vw), calc(-50% + 15vh)) scale(1);
}

.card h1 {
  color: var(--foreground);
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  transition: color 0.3s ease;
}

.card p {
  color: var(--muted);
  font-size: 1.125rem;
  line-height: 1.6;
  transition: color 0.3s ease;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .home {
    padding: 1rem;
  }

  .card {
    padding: 2.5rem 1.5rem;
    max-width: none;
    width: 60%;
  }

  .card-first.animate {
    transform: translate(calc(-50% - 15%), calc(-50% - 10vh)) scale(1);
  }

  .card-second.animate {
    transform: translate(calc(-50% + 15%), calc(-50% + 10vh)) scale(1);
  }

  .card h1 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }

  .card p {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .card {
    padding: 2rem 1.25rem;
    width: 80%;
  }

  .card-first.animate {
    transform: translate(calc(-50% - 5%), calc(-50% - 8vh)) scale(1);
  }

  .card-second.animate {
    transform: translate(calc(-50% + 5%), calc(-50% + 8vh)) scale(1);
  }

  .card h1 {
    font-size: 1.125rem;
  }

  .card p {
    font-size: 0.875rem;
    line-height: 1.4;
  }
}
</style>
