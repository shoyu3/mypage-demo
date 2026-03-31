<template>
  <div class="home">
    <div 
      ref="cardsContainerRef"
      class="cards-container"
      :style="containerStyle"
    >
      <div 
        ref="firstCardRef"
        class="card card-first" 
        :class="{ 'animate': showFirstCard }"
      >
        <h1>{{ $t('home.title') }}</h1>
        <p>{{ $t('home.description') }}</p>
      </div>
      <div
        ref="secondCardRef"
        class="card card-second"
        :class="{ 'animate': showSecondCard }"
      >
        <h1>{{ $t('home.title1') }}</h1>
        <p>{{ $t('home.content1') }}</p>
        <!-- 传感器数据显示（检测中或启用传感器模式时显示） -->
        <div v-if="isSensorDetecting || useSensorTilt" class="sensor-data">
          <div class="sensor-item">
            <span class="sensor-label">Gamma:</span>
            <span class="sensor-value">{{ sensorData.gamma.toFixed(1) }}°</span>
          </div>
          <div class="sensor-item">
            <span class="sensor-label">Beta:</span>
            <span class="sensor-value">{{ sensorData.beta.toFixed(1) }}°</span>
          </div>
          <div class="sensor-item">
            <span class="sensor-label">Alpha:</span>
            <span class="sensor-value">{{ sensorData.alpha.toFixed(1) }}°</span>
          </div>
        </div>
      </div>
    </div>
    <div class="floating-menus">
      <!-- 语言切换菜单 -->
      <div class="menu-container" ref="langMenuContainer">
        <div class="icon-card" @click.stop="toggleLangMenu">
          <icon-lucide-languages class="icon" />
        </div>
        <Transition name="menu">
          <div v-if="isLangMenuOpen" class="dropdown-menu">
            <div class="menu-title">{{ $t('language.switch') || 'Language' }}</div>
            <div class="menu-options">
              <button v-for="option in langOptions" :key="option.value" class="menu-option"
                :class="{ active: currentLocale === option.value }" @click="selectLocale(option.value)">
                <span class="option-icon">{{ option.icon }}</span>
                <span class="option-label">{{ option.label }}</span>
                <span v-if="currentLocale === option.value" class="check-icon">
                  <icon-lucide-check class="check" />
                </span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
      <!-- 主题切换菜单 -->
      <div class="menu-container" ref="menuContainer">
        <div class="icon-card" @click.stop="toggleMenu">
          <icon-lucide-palette class="icon" />
        </div>
        <Transition name="menu">
          <div v-if="isMenuOpen" class="dropdown-menu theme-dropdown">
            <!-- 模式选择 -->
            <div class="menu-section">
              <div class="menu-title">{{ $t('theme.mode') || '主题模式' }}</div>
              <div class="menu-options">
                <button v-for="option in themeOptions" :key="option.value" class="menu-option"
                  :class="{ active: themeStore.mode === option.value }" @click="selectMode(option.value)">
                  <span class="option-icon">{{ option.icon }}</span>
                  <span class="option-label">{{ option.label }}</span>
                  <span v-if="themeStore.mode === option.value" class="check-icon">
                    <icon-lucide-check class="check" />
                  </span>
                </button>
              </div>
            </div>
            <!-- 分隔线 -->
            <div class="menu-divider"></div>
            <!-- 颜色选择 -->
            <div class="menu-section">
              <div class="menu-title">{{ $t('theme.color') || '主题颜色' }}</div>
              <div class="color-grid">
                <button v-for="color in colorOptions" :key="color.value" class="color-btn"
                  :class="{ active: themeStore.themeName === color.value }" :style="{ '--color-dot': color.color }"
                  @click="selectColor(color.value)" :title="color.label">
                  <span class="color-dot"></span>
                  <span v-if="themeStore.themeName === color.value" class="color-check">
                    <icon-lucide-check class="check" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/stores/theme'
import { setLocale } from '@/i18n'

const themeStore = useThemeStore()
const { locale } = useI18n()

// 卡片动画控制
const showFirstCard = ref(false)
const showSecondCard = ref(false)

// 卡片容器引用
const cardsContainerRef = ref(null)

// 卡片引用
const firstCardRef = ref(null)
const secondCardRef = ref(null)

// 容器旋转状态
const containerRotate = ref({ x: 0, y: 0 })

// 传感器倾斜相关状态
const useSensorTilt = ref(false)
const hasSensorChanged = ref(false)
const initialGamma = ref(null)
const initialBeta = ref(null)
const initialAlpha = ref(null)
const isSensorDetecting = ref(false) // 是否正在检测中（前5秒）
let sensorCheckInterval = null

// 传感器原始数据（用于显示）
const sensorData = ref({ alpha: 0, beta: 0, gamma: 0 })

// 基准值：纵向平放时 alpha=90, beta=0, gamma=0
const BASELINE_ALPHA = 90
const BASELINE_BETA = 0
const BASELINE_GAMMA = 0

// 主题菜单
const isMenuOpen = ref(false)
const menuContainer = ref(null)

// 语言菜单
const isLangMenuOpen = ref(false)
const langMenuContainer = ref(null)

// 计算容器样式
const containerStyle = computed(() => ({
  '--rotate-x': `${containerRotate.value.x}deg`,
  '--rotate-y': `${containerRotate.value.y}deg`,
}))

const currentLocale = computed(() => locale.value)

const { t } = useI18n()

const themeOptions = computed(() => [
  { value: 'auto', label: t('theme.auto'), icon: '🌓' },
  { value: 'light', label: t('theme.light'), icon: '☀️' },
  { value: 'dark', label: t('theme.dark'), icon: '🌙' },
])

const colorOptions = [
  { value: 'purple', label: '紫色', color: '#aa3bff' },
  { value: 'blue', label: '蓝色', color: '#3b82f6' },
  { value: 'green', label: '绿色', color: '#10b981' },
]

const langOptions = [
  { value: 'zh', label: '中文', icon: '🇨🇳' },
  { value: 'en', label: 'English', icon: '🇬🇧' },
]

// 主题菜单控制
function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) {
    isLangMenuOpen.value = false
  }
}

function closeMenu() {
  isMenuOpen.value = false
}

function selectMode(mode) {
  themeStore.setMode(mode)
}

function selectColor(colorName) {
  themeStore.setThemeColor(colorName)
}

// 语言菜单控制
function toggleLangMenu() {
  isLangMenuOpen.value = !isLangMenuOpen.value
  if (isLangMenuOpen.value) {
    isMenuOpen.value = false
  }
}

function closeLangMenu() {
  isLangMenuOpen.value = false
}

function selectLocale(newLocale) {
  setLocale(locale, newLocale)
  closeLangMenu()
}

// 点击外部关闭菜单
function handleClickOutside(event) {
  if (menuContainer.value && !menuContainer.value.contains(event.target)) {
    closeMenu()
  }
  if (langMenuContainer.value && !langMenuContainer.value.contains(event.target)) {
    closeLangMenu()
  }
}

// 计算容器的倾斜角度
function calculateContainerTilt(mouseX, mouseY) {
  if (!cardsContainerRef.value) return { x: 0, y: 0 }

  const rect = cardsContainerRef.value.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  // 计算鼠标相对于容器中心的偏移（-1 到 1）
  let percentX = (mouseX - centerX) / (rect.width / 2)
  let percentY = (mouseY - centerY) / (rect.height / 2)

  // 限制偏移范围在 -1 到 1 之间，防止角度过大
  percentX = Math.max(-1, Math.min(1, percentX))
  percentY = Math.max(-1, Math.min(1, percentY))

  // 限制最大倾斜角度为 15 度
  // 取反使卡片朝向鼠标方向倾斜
  const maxTilt = 15
  const rotateY = -percentX * maxTilt
  const rotateX = percentY * maxTilt

  return { x: rotateX, y: rotateY }
}

// 鼠标移动处理（使用 requestAnimationFrame 节流）
let rafId = null
function handleMouseMove(event) {
  // 如果使用传感器倾斜，则不处理鼠标移动
  if (useSensorTilt.value) return
  if (rafId) return

  rafId = requestAnimationFrame(() => {
    containerRotate.value = calculateContainerTilt(event.clientX, event.clientY)
    rafId = null
  })
}

// 鼠标离开页面时重置倾斜
function handleMouseLeave() {
  containerRotate.value = { x: 0, y: 0 }
}

// 从传感器值计算倾斜角度（相对于基准值）
function calculateTiltFromSensor(gamma, beta, alpha) {
  // 基准值：纵向平放时 alpha=90, beta=0, gamma=0
  // 计算相对于基准值的偏移
  const relativeGamma = gamma - BASELINE_GAMMA
  const relativeBeta = beta - BASELINE_BETA

  // gamma: -90 (左) 到 90 (右)，映射到 rotateY: -15 到 15
  // beta: -180 到 180，通常设备使用时在 -45 到 45 之间，映射到 rotateX: -15 到 15
  const maxTilt = 15

  // 限制相对 beta 范围在 -45 到 45 之间（正常使用范围）
  const clampedBeta = Math.max(-45, Math.min(45, relativeBeta))

  const rotateY = (relativeGamma / 90) * maxTilt
  const rotateX = -(clampedBeta / 45) * maxTilt

  return { x: rotateX, y: rotateY }
}

// 传感器事件处理
function handleDeviceOrientation(event) {
  if (event.gamma !== null && event.beta !== null) {
    containerRotate.value = calculateTiltFromSensor(event.gamma, event.beta)
  }
}

// 启动传感器检测
function startSensorDetection() {
  // 标记正在检测中，此时显示传感器数据
  isSensorDetecting.value = true

  // 事件处理器，用于保存数据、检测变化和实时倾斜
  function detectionHandler(event) {
    if (event.gamma !== null && event.beta !== null) {
      // 保存原始传感器数据用于显示
      sensorData.value = {
        alpha: event.alpha || 0,
        beta: event.beta,
        gamma: event.gamma
      }

      // 记录初始值并检测变化（相对于基准值的变化）
      if (initialGamma.value === null) {
        initialGamma.value = event.gamma
        initialBeta.value = event.beta
        initialAlpha.value = event.alpha || 0
      } else if (!hasSensorChanged.value && !useSensorTilt.value) {
        // 计算相对于基准值的当前读数
        const relativeGamma = event.gamma - BASELINE_GAMMA
        const relativeBeta = event.beta - BASELINE_BETA
        const initialRelativeGamma = initialGamma.value - BASELINE_GAMMA
        const initialRelativeBeta = initialBeta.value - BASELINE_BETA

        // 检测相对于基准值的变化阈值（> 2度视为有变化）
        const gammaDiff = Math.abs(relativeGamma - initialRelativeGamma)
        const betaDiff = Math.abs(relativeBeta - initialRelativeBeta)
        if (gammaDiff > 2 || betaDiff > 2) {
          hasSensorChanged.value = true
          // 直接激活传感器倾斜模式
          useSensorTilt.value = true
          // 移除鼠标事件监听
          document.removeEventListener('mousemove', handleMouseMove)
          document.removeEventListener('mouseleave', handleMouseLeave)
        }
      }

      // 如果已激活传感器模式，实时更新倾斜（相对于基准值）
      if (useSensorTilt.value) {
        containerRotate.value = calculateTiltFromSensor(event.gamma, event.beta, event.alpha)
      }
    }
  }

  // 添加监听，持续保存和显示数据
  window.addEventListener('deviceorientation', detectionHandler)

  // 5秒后停止检测状态，但不移除事件监听
  setTimeout(() => {
    isSensorDetecting.value = false
    // 如果5秒后仍未激活传感器模式，说明无变化
    if (!useSensorTilt.value) {
      useSensorTilt.value = false
    }
  }, 5000)
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseleave', handleMouseLeave)

  // 启动传感器检测（5秒内检测传感器是否可用）
  startSensorDetection()

  // 触发卡片跃出动画
  setTimeout(() => {
    showFirstCard.value = true
  }, 100)
  setTimeout(() => {
    showSecondCard.value = true
  }, 400)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseleave', handleMouseLeave)

  // 清理传感器相关监听和定时器
  window.removeEventListener('deviceorientation', handleDeviceOrientation)
  if (sensorCheckInterval) {
    clearInterval(sensorCheckInterval)
  }

  if (rafId) {
    cancelAnimationFrame(rafId)
  }
})
</script>

<style scoped>
.home {
  min-height: 100vh;
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

.cards-container {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  will-change: transform;
  transform: rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg));
  transition: transform 0.1s ease-out;
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
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  position: absolute;
  top: 50%;
  left: 50%;
  opacity: 0;
}

/* 第一个卡片 - 从中心跃出到偏左上 */
.card-first {
  transform: translate(-50%, -50%) scale(0.3);
  transition: top 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
              left 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
              opacity 0.4s ease,
              transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card-first.animate {
  opacity: 1;
  top: 35%;
  left: 30%;
  transform: translate(-50%, -50%) scale(1);
  transition: top 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
              left 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
              opacity 0.4s ease,
              transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 第二个卡片 - 从中心跃出到偏右下 */
.card-second {
  transform: translate(-50%, -50%) scale(0.3);
  transition: top 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
              left 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
              opacity 0.4s ease,
              transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card-second.animate {
  opacity: 1;
  top: 65%;
  left: 70%;
  transform: translate(-50%, -50%) scale(1);
  transition: top 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
              left 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
              opacity 0.4s ease,
              transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
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

/* 传感器数据显示样式 */
.sensor-data {
  margin-top: 1.5rem;
  padding: 1rem;
  background: var(--primary-bg);
  border-radius: 0.5rem;
  border: 1px solid var(--glass-border);
}

.sensor-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.375rem 0;
  font-size: 0.875rem;
}

.sensor-item:not(:last-child) {
  border-bottom: 1px solid var(--glass-border);
}

.sensor-label {
  color: var(--muted);
  font-weight: 500;
}

.sensor-value {
  color: var(--primary);
  font-family: monospace;
  font-weight: 600;
}

/* 响应式适配 - 窄屏 */
@media (max-width: 768px) {
  .home {
    padding: 1rem;
  }

  .card {
    padding: 1.5rem 1rem;
    max-width: none;
    width: 80%;
  }

  .card-first.animate {
    top: 38%;
    left: 3%;
    transform: translate(0, -50%) scale(1);
  }

  .card-second.animate {
    top: 60%;
    left: auto;
    right: 3%;
    transform: translate(0, -50%) scale(1);
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
    padding: 1.25rem 1rem;
    width: 80%;
  }

  .card-first.animate {
    top: 36%;
    left: 3%;
    transform: translate(0, -50%) scale(1);
  }

  .card-second.animate {
    top: 55%;
    left: auto;
    right: 3%;
    transform: translate(0, -50%) scale(1);
  }

  .card h1 {
    font-size: 1.125rem;
  }

  .card p {
    font-size: 0.875rem;
    line-height: 1.4;
  }
}

.floating-menus {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 100;
  display: flex;
  gap: 0.75rem;
}

.menu-container {
  position: relative;
}

.icon-card {
  background-color: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  cursor: pointer;
  transition: all 0.2s ease, background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.icon-card:hover {
  transform: scale(1.05);
  border-color: var(--primary-border);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.icon {
  font-size: 1.5rem;
  color: var(--foreground);
  transition: color 0.3s ease;
}

.dropdown-menu {
  position: absolute;
  bottom: calc(100% + 0.5rem);
  right: 3%;
  background-color: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 0.75rem;
  padding: 0.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  min-width: 140px;
  transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.theme-dropdown {
  min-width: 180px;
}

.menu-section {
  padding: 0.25rem 0;
}

.menu-divider {
  height: 1px;
  background-color: var(--glass-border);
  margin: 0.5rem 0;
}

/* 颜色选项样式 - 网格布局 */
.color-grid {
  display: flex;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem 0.5rem;
  justify-content: flex-start;
}

.color-btn {
  position: relative;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid transparent;
  background: transparent;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.color-btn:hover {
  transform: scale(1.1);
}

.color-btn.active {
  border-color: var(--primary);
}

.color-dot {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background-color: var(--color-dot);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.color-check {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-check .check {
  font-size: 0.75rem;
  color: #ffffff;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
}

.menu-title {
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: color 0.3s ease;
}

.menu-options {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.menu-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  color: var(--foreground);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s ease, background-color 0.3s ease, color 0.3s ease;
  text-align: left;
  width: 100%;
}

.menu-option:hover {
  background-color: var(--muted-bg);
}

.menu-option.active {
  background-color: var(--primary-bg);
  color: var(--primary);
}

.option-icon {
  font-size: 1rem;
}

.option-label {
  flex: 1;
}

.check-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.check {
  font-size: 0.875rem;
}

/* 菜单动画 */
.menu-enter-active,
.menu-leave-active {
  transition: all 0.2s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

.menu-enter-to,
.menu-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
