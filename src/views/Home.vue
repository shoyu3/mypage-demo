<template>
  <div class="home">
    <!-- 固定背景层 -->
    <div class="fixed-background"></div>

    <!-- 内容层 - 通过 transform 切换 -->
    <div class="content-wrapper" :style="contentStyle">
      <!-- Hero Section -->
      <section class="hero-section" id="hero" :style="{ height: viewportHeight + 'px' }">
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

        <!-- Scroll Down Indicator -->
        <div class="scroll-indicator" @click="scrollToNextSection">
          <span class="scroll-text">{{ $t('home.scrollDown') }}</span>
          <div class="scroll-arrow">
            <icon-lucide-chevron-down class="arrow-icon" />
          </div>
        </div>
      </section>

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
import { ref, inject, onMounted, onUnmounted, computed } from 'vue'
import TiltContainer from '@/components/TiltContainer.vue'
import FloatingControls from '@/components/FloatingControls.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import InterestsSection from '@/components/sections/InterestsSection.vue'
import CharacterCard from '@/components/sections/CharacterCard.vue'

const isFirstLoad = inject('isFirstLoad')
const showFirstCard = ref(false)
const showSecondCard = ref(false)

// 页面区块配置
const sections = ['hero', 'about', 'interests', 'character']
const currentSectionIndex = ref(0)
let isScrolling = false

// 视口高度 - 使用 window.innerHeight 避免移动端 100vh 问题
const viewportHeight = ref(window.innerHeight)

// 更新视口高度
function updateViewportHeight() {
  viewportHeight.value = window.innerHeight
}

// 内容层样式 - 通过 transform 实现切换
const contentStyle = computed(() => {
  return {
    transform: `translateY(-${currentSectionIndex.value * viewportHeight.value}px)`,
    transition: isScrolling ? 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
  }
})

// 触摸滑动相关变量
let touchStartY = 0
let touchEndY = 0
const minSwipeDistance = 50

onMounted(() => {
  const baseDelay = isFirstLoad.value ? 500 : 100
  setTimeout(() => {
    showFirstCard.value = true
  }, baseDelay)
  setTimeout(() => {
    showSecondCard.value = true
  }, baseDelay + 300)

  // 添加滚轮事件监听
  window.addEventListener('wheel', handleWheel, { passive: false })
  
  // 添加触摸滑动监听
  window.addEventListener('touchstart', handleTouchStart, { passive: false })
  window.addEventListener('touchend', handleTouchEnd, { passive: false })
  
  // 监听视口高度变化
  window.addEventListener('resize', updateViewportHeight)
})

onUnmounted(() => {
  window.removeEventListener('wheel', handleWheel)
  window.removeEventListener('touchstart', handleTouchStart)
  window.removeEventListener('touchend', handleTouchEnd)
  window.removeEventListener('resize', updateViewportHeight)
})

// 处理滚轮事件
function handleWheel(event) {
  event.preventDefault()

  if (isScrolling) return

  const delta = event.deltaY

  if (delta > 0) {
    // 向下滚动
    scrollToNextSection()
  } else if (delta < 0) {
    // 向上滚动
    scrollToPrevSection()
  }
}

// 处理触摸开始
function handleTouchStart(event) {
  touchStartY = event.touches[0].clientY
}

// 处理触摸结束
function handleTouchEnd(event) {
  if (isScrolling) return
  
  touchEndY = event.changedTouches[0].clientY
  const swipeDistance = touchStartY - touchEndY
  
  // 向上滑动超过阈值，翻到下一页
  if (swipeDistance > minSwipeDistance) {
    scrollToNextSection()
  }
  // 向下滑动超过阈值，翻到上一页
  else if (swipeDistance < -minSwipeDistance) {
    scrollToPrevSection()
  }
}

// 滚动到下一个区块
function scrollToNextSection() {
  if (currentSectionIndex.value < sections.length - 1) {
    isScrolling = true
    currentSectionIndex.value++
    setTimeout(() => {
      isScrolling = false
    }, 800)
  }
}

// 滚动到上一个区块
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

/* 固定背景层 */
.fixed-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--background) 0%, var(--primary-bg) 100%);
  z-index: 0;
}

/* 内容层 */
.content-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}

/* Hero Section */
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

/* 卡片一：头像居左，内容右对齐 */
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

/* 卡片二：Tech Stack居左，统计数据居右（一上一下） */
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
  opacity: 0;
  animation: fade-in-up 0.6s ease 1.5s forwards;
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

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
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
    transform: translate(calc(-50% - 15%), calc(-50% - 15vh)) scale(1);
  }

  .card-second.animate {
    transform: translate(calc(-50% + 15%), calc(-50% + 15vh)) scale(1);
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

  .scroll-indicator {
    bottom: 1.5rem;
  }
}

@media (max-width: 480px) {
  .card {
    padding: 1.75rem 1.25rem;
    width: 85%;
  }

  .card-first.animate {
    transform: translate(calc(-50% - 5%), calc(-50% - 13vh)) scale(1);
  }

  .card-second.animate {
    transform: translate(calc(-50% + 5%), calc(-50% + 13vh)) scale(1);
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
