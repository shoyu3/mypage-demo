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
      </div>
    </div>
    <FloatingControls />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import FloatingControls from '@/components/FloatingControls.vue'
import {
  calculateContainerTilt,
  calculateTiltFromSensor,
  BASELINE_GAMMA,
  BASELINE_BETA,
} from '@/utils/tilt.js'

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
let detectionHandlerRef = null

// 传感器原始数据（用于显示）
const sensorData = ref({ alpha: 0, beta: 0, gamma: 0 })

// 计算容器样式
const containerStyle = computed(() => ({
  '--rotate-x': `${containerRotate.value.x}deg`,
  '--rotate-y': `${containerRotate.value.y}deg`,
}))

// 鼠标移动处理（使用 requestAnimationFrame 节流）
let rafId = null
function handleMouseMove(event) {
  // 如果使用传感器倾斜，则不处理鼠标移动
  if (useSensorTilt.value) return
  if (rafId) return
  if (!cardsContainerRef.value) return

  rafId = requestAnimationFrame(() => {
    const rect = cardsContainerRef.value.getBoundingClientRect()
    containerRotate.value = calculateContainerTilt(event.clientX, event.clientY, rect)
    rafId = null
  })
}

// 鼠标离开页面时重置倾斜
function handleMouseLeave() {
  containerRotate.value = { x: 0, y: 0 }
}

// 启动传感器检测
function startSensorDetection() {
  // 标记正在检测中，此时显示传感器数据
  isSensorDetecting.value = true

  // 事件处理器，用于保存数据、检测变化和实时倾斜
  detectionHandlerRef = function detectionHandler(event) {
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
  window.addEventListener('deviceorientation', detectionHandlerRef)

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
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseleave', handleMouseLeave)

  // 清理传感器相关监听和定时器
  if (detectionHandlerRef) {
    window.removeEventListener('deviceorientation', detectionHandlerRef)
  }
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
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  position: absolute;
  top: 50%;
  left: 50%;
  opacity: 0;
}

/* 第一个卡片 - 从中心跃出到上方偏左 10% */
.card-first {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.3);
  transition: opacity 0.4s ease,
              transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card-first.animate {
  opacity: 1;
  transform: translate(calc(-50% - 10vw), calc(-50% - 15vh)) scale(1);
  transition: opacity 0.4s ease,
              transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 第二个卡片 - 从中心跃出到下方偏右 10% */
.card-second {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.3);
  transition: opacity 0.4s ease,
              transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card-second.animate {
  opacity: 1;
  transform: translate(calc(-50% + 10vw), calc(-50% + 15vh)) scale(1);
  transition: opacity 0.4s ease,
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
