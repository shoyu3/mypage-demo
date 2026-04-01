<template>
  <div class="home">
    <!-- 固定背景层 -->
    <div class="fixed-background"></div>

    <!-- 内容层 - 通过 transform 切换 -->
    <div class="content-wrapper" :style="contentStyle">
      <!-- Hero Section -->
      <HeroSection @scrollNext="scrollToNextSection" :viewport-height="viewportHeight" />

      <!-- About Section -->
      <AboutSection @scrollNext="scrollToNextSection" :viewport-height="viewportHeight" />

      <!-- Interests Section -->
      <InterestsSection @scrollNext="scrollToNextSection" :viewport-height="viewportHeight" />
 
      <!-- Character Card Section -->
      <CharacterCard :viewport-height="viewportHeight" />
    </div>

    <FloatingControls />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import FloatingControls from '@/components/FloatingControls.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import InterestsSection from '@/components/sections/InterestsSection.vue'
import CharacterCard from '@/components/sections/CharacterCard.vue'

const sections = ['hero', 'about', 'interests', 'character']
const currentSectionIndex = ref(0)
let isScrolling = false

const viewportHeight = ref(window.innerHeight)

function updateViewportHeight() {
  viewportHeight.value = window.innerHeight
}

const contentStyle = computed(() => {
  return {
    transform: `translateY(-${currentSectionIndex.value * viewportHeight.value}px)`,
    transition: isScrolling ? 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
  }
})

let touchStartY = 0
let touchEndY = 0
const minSwipeDistance = 50

onMounted(() => {
  window.addEventListener('wheel', handleWheel, { passive: false })
  window.addEventListener('touchstart', handleTouchStart, { passive: false })
  window.addEventListener('touchend', handleTouchEnd, { passive: false })
  window.addEventListener('resize', updateViewportHeight)
})

onUnmounted(() => {
  window.removeEventListener('wheel', handleWheel)
  window.removeEventListener('touchstart', handleTouchStart)
  window.removeEventListener('touchend', handleTouchEnd)
  window.removeEventListener('resize', updateViewportHeight)
})

function handleWheel(event) {
  event.preventDefault()

  if (isScrolling) return

  const delta = event.deltaY

  if (delta > 0) {
    scrollToNextSection()
  } else if (delta < 0) {
    scrollToPrevSection()
  }
}

function handleTouchStart(event) {
  touchStartY = event.touches[0].clientY
}

function handleTouchEnd(event) {
  if (isScrolling) return
  
  touchEndY = event.changedTouches[0].clientY
  const swipeDistance = touchStartY - touchEndY
  
  if (swipeDistance > minSwipeDistance) {
    scrollToNextSection()
  }
  else if (swipeDistance < -minSwipeDistance) {
    scrollToPrevSection()
  }
}

function scrollToNextSection() {
  if (currentSectionIndex.value < sections.length - 1) {
    isScrolling = true
    currentSectionIndex.value++
    setTimeout(() => {
      isScrolling = false
    }, 800)
  }
}

function scrollToPrevSection() {
  if (currentSectionIndex.value > 0) {
    isScrolling = true
    currentSectionIndex.value--
    setTimeout(() => {
      isScrolling = false
    }, 800)
  }
}
</script>

<style scoped>
.home {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--background) 0%, var(--primary-bg) 100%);
  z-index: 0;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}
</style>
