<template>
  <div class="home">
    <!-- 固定背景层 -->
    <div class="fixed-background"></div>

    <!-- 内容层 -->
    <div class="content-wrapper">
      <!-- Hero Section -->
      <HeroSection ref="heroSection" :style="{ opacity: sectionOpacities.hero }" />

      <!-- About Section -->
      <AboutSection ref="aboutSection" :style="{ opacity: sectionOpacities.about }" />

      <!-- Interests Section -->
      <InterestsSection ref="interestsSection" :style="{ opacity: sectionOpacities.interests }" />
 
      <!-- Character Card Section -->
      <CharacterCard ref="characterSection" :style="{ opacity: sectionOpacities.character }" />
    </div>

    <FloatingControls />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import FloatingControls from '@/components/FloatingControls.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import InterestsSection from '@/components/sections/InterestsSection.vue'
import CharacterCard from '@/components/sections/CharacterCard.vue'

const heroSection = ref(null)
const aboutSection = ref(null)
const interestsSection = ref(null)
const characterSection = ref(null)

const sectionOpacities = reactive({
  hero: 1,
  about: 1,
  interests: 1,
  character: 1
})

function updateOpacities() {
  const sections = [
    { name: 'hero', el: heroSection.value?.$el || heroSection.value },
    { name: 'about', el: aboutSection.value?.$el || aboutSection.value },
    { name: 'interests', el: interestsSection.value?.$el || interestsSection.value },
    { name: 'character', el: characterSection.value?.$el || characterSection.value }
  ]

  const viewportCenter = window.innerHeight / 2

  sections.forEach(({ name, el }) => {
    if (!el) return

    const rect = el.getBoundingClientRect()
    const sectionCenter = rect.top + rect.height / 2
    const distance = Math.abs(sectionCenter - viewportCenter)
    const maxDistance = window.innerHeight

    let opacity = 1 - (distance / maxDistance)
    opacity = Math.max(0, Math.min(1, opacity))

    sectionOpacities[name] = opacity
  })
}

onMounted(() => {
  window.addEventListener('scroll', updateOpacities)
  updateOpacities()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateOpacities)
})
</script>

<style scoped>
.home {
  width: 100%;
  min-height: 100%;
  position: relative;
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
}
</style>
