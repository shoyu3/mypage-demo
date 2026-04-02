<template>
  <div class="home">
    <div class="fixed-background"></div>

    <div ref="contentWrapperRef" class="content-wrapper">
      <HeroSection />
      <AboutSection />
      <InterestsSection />
      <CharacterCard />
    </div>

    <FloatingControls />

    <Transition name="fade">
      <div v-show="showScrollHint" class="scroll-hint">
        <icon-lucide-circle-arrow-down class="scroll-hint-icon" />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import FloatingControls from '@/components/FloatingControls.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import InterestsSection from '@/components/sections/InterestsSection.vue'
import CharacterCard from '@/components/sections/CharacterCard.vue'

const showScrollHint = ref(true)
const contentWrapperRef = ref(null)

function checkScrollPosition() {
  const clientHeight = window.innerHeight
  
  const contentWrapper = contentWrapperRef.value
  if (!contentWrapper) {
    showScrollHint.value = false
    return
  }
  
  const contentHeight = contentWrapper.scrollHeight
  const contentRect = contentWrapper.getBoundingClientRect()
  
  // 使用 getBoundingClientRect 计算实际的滚动位置
  // contentRect.top 为负值时表示已经向上滚动了
  const scrollTop = Math.abs(Math.min(0, contentRect.top))
  const canScroll = contentHeight > clientHeight + 10
  const scrollBottom = scrollTop + clientHeight
  const threshold = contentHeight - 50
  const isAtBottom = scrollBottom >= threshold
  const shouldShow = canScroll && !isAtBottom
  
  showScrollHint.value = shouldShow
}

onMounted(() => {
  nextTick(() => {
    checkScrollPosition()
  })
  window.addEventListener('scroll', checkScrollPosition, true)
  document.addEventListener('scroll', checkScrollPosition, true)
  window.addEventListener('resize', checkScrollPosition)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScrollPosition, true)
  document.removeEventListener('scroll', checkScrollPosition, true)
  window.removeEventListener('resize', checkScrollPosition)
})
</script>

<style scoped>
.home {
  width: 100%;
  min-height: 100dvh;
  position: relative;
}

.fixed-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  background: linear-gradient(135deg, var(--background) 0%, var(--primary-bg) 100%);
  z-index: -1;
  pointer-events: none;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  overflow-x: hidden;
  min-height: 100dvh;
  padding-bottom: 4rem;
}

.scroll-hint {
  position: fixed;
  bottom: 1.5rem;
  left: 1.5rem;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background-color: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 50%;
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  animation: bounce 2s infinite;
  pointer-events: none;
}

.scroll-hint-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--foreground);
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
