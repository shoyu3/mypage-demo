<template>
  <div class="not-found">
    <TiltContainer class="card-wrapper">
      <div
        class="card"
        :class="{ 'animate': showCard }"
      >
        <div class="error-code">404</div>
        <h1>{{ $t('notFound.title') }}</h1>
        <p>{{ $t('notFound.description') }}</p>
        <button class="home-button" @click="goHome">
          <icon-lucide-home class="button-icon" />
          {{ $t('notFound.backHome') }}
        </button>
      </div>
    </TiltContainer>
    <FloatingControls />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TiltContainer from '@/components/TiltContainer.vue'
import FloatingControls from '@/components/FloatingControls.vue'

const router = useRouter()

// 卡片动画控制
const showCard = ref(false)

onMounted(() => {
  // 触发卡片跃出动画
  setTimeout(() => {
    showCard.value = true
  }, 100)
})

// 返回首页
function goHome() {
  // 添加离开动画类名，等待动画完成后再跳转
  const card = document.querySelector('.card')
  if (card) {
    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease'
    card.style.opacity = '0'
    card.style.transform = 'translateY(30px) scale(0.9)'
  }
  
  setTimeout(() => {
    router.push('/')
  }, 400)
}
</script>

<style scoped>
.not-found {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--background) 0%, var(--primary-bg) 100%);
  padding: 1.5rem;
  transition: background-color 0.3s ease;
  position: relative;
  overflow: hidden;
  perspective: 1000px;
}

.card-wrapper {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
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
  opacity: 0;
  transform: scale(0.3);
  transition: opacity 0.4s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card.animate {
  opacity: 1;
  transform: scale(1);
}

.error-code {
  font-size: 6rem;
  font-weight: 700;
  color: var(--primary);
  line-height: 1;
  margin-bottom: 1rem;
  opacity: 0.8;
}

.card h1 {
  color: var(--foreground);
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  transition: color 0.3s ease;
}

.card p {
  color: var(--muted);
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  transition: color 0.3s ease;
}

.home-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background-color: var(--primary);
  color: #ffffff;
  border-radius: 0.5rem;
  font-weight: 500;
  text-decoration: none;
  transition: opacity 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  border: none;
  position: relative;
}

.home-button:hover {
  opacity: 0.9;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.button-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .not-found {
    padding: 1rem;
  }

  .card {
    padding: 2.5rem 1.5rem;
    max-width: none;
    width: 80%;
  }

  .error-code {
    font-size: 4rem;
  }

  .card h1 {
    font-size: 1.5rem;
  }

  .card p {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .card {
    padding: 2rem 1.25rem;
    width: 90%;
  }

  .error-code {
    font-size: 3.5rem;
  }

  .card h1 {
    font-size: 1.25rem;
  }

  .card p {
    font-size: 0.875rem;
    line-height: 1.4;
  }

  .home-button {
    padding: 0.75rem 1.25rem;
    font-size: 0.875rem;
  }
}
</style>
