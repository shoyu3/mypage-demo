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
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight
  const clientHeight = window.innerHeight
  
  const canScroll = scrollHeight > clientHeight + 10
  const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50
  const shouldShow = canScroll && !isAtBottom
  
  console.log('[ScrollHint] scrollTop:', scrollTop, 'scrollHeight:', scrollHeight, 'clientHeight:', clientHeight, 'canScroll:', canScroll, 'isAtBottom:', isAtBottom, 'shouldShow:', shouldShow)
  showScrollHint.value = shouldShow
}

onMounted(() => {
  nextTick(() => {
    checkScrollPosition()
  })
  window.addEventListener('scroll', checkScrollPosition)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScrollPosition)
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
  z-index: 0;
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
