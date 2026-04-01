<template>
  <div class="home">
    <!-- 固定背景层 -->
    <div class="fixed-background"></div>

    <!-- 内容层 -->
    <div class="content-wrapper">
      <!-- Hero Section -->
      <div class="section-wrapper">
        <div class="section-sticky">
          <HeroSection />
        </div>
      </div>

      <!-- About Section -->
      <div class="section-wrapper">
        <div class="section-sticky">
          <AboutSection />
        </div>
      </div>

      <!-- Interests Section -->
      <div class="section-wrapper">
        <div class="section-sticky">
          <InterestsSection />
        </div>
      </div>

      <!-- Character Card Section -->
      <div class="section-wrapper">
        <div class="section-sticky">
          <CharacterCard />
        </div>
      </div>
    </div>

    <!-- 滚动进度条 -->
    <div class="scroll-progress-bar" v-if="showProgressBar">
      <div class="progress-fill" :style="{ width: `${scrollProgress}%` }"></div>
    </div>

    <FloatingControls />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import FloatingControls from '@/components/FloatingControls.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import InterestsSection from '@/components/sections/InterestsSection.vue'
import CharacterCard from '@/components/sections/CharacterCard.vue'

const scrollProgress = ref(0)
const showProgressBar = ref(true)

function updateScrollProgress() {
  const sectionHeight = window.innerHeight
  const currentScroll = window.scrollY
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  
  // 检查是否已经滚动到页面底部（触底）
  if (currentScroll >= maxScroll) {
    showProgressBar.value = false
    return
  }
  
  // 计算在 sticky 容器内的实际滚动进度（0-100%）
  // sticky 容器高度为 200vh，其中前 100vh 是锁定阶段，后 100vh 是滚动阶段
  const totalWrapperHeight = sectionHeight * 2 // 200vh
  const scrollInWrapper = currentScroll % totalWrapperHeight
  
  // 如果滚动距离超过 100vh，说明已经进入滚动阶段，隐藏进度条
  if (scrollInWrapper >= sectionHeight) {
    showProgressBar.value = false
    return
  }
  
  // 显示进度条，计算距离阈值还有多少
  showProgressBar.value = true
  const progress = (scrollInWrapper / sectionHeight) * 100
  scrollProgress.value = Math.min(100, Math.max(0, progress))
}

onMounted(() => {
  window.addEventListener('scroll', updateScrollProgress)
  updateScrollProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollProgress)
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

.section-wrapper {
  position: relative;
  height: 200vh;
}

.section-sticky {
  position: sticky;
  top: 0;
  min-height: 100vh;
  height: auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scroll-progress-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: var(--muted-bg);
  z-index: 1000;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary) 0%, var(--primary-hover) 100%);
  transition: width 0.1s ease-out;
}
</style>
