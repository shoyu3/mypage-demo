<template>
  <div
    ref="containerRef"
    class="tilt-container"
    :style="containerStyle"
  >
    <slot />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  calculateContainerTilt,
  calculateTiltFromSensor,
  BASELINE_GAMMA,
  BASELINE_BETA,
} from '@/utils/tilt.js'

const props = defineProps({
  // 是否启用传感器倾斜
  enableSensor: {
    type: Boolean,
    default: true
  },
  // 传感器检测超时时间（毫秒）
  sensorTimeout: {
    type: Number,
    default: 5000
  }
})

const containerRef = ref(null)
const containerRotate = ref({ x: 0, y: 0 })

// 传感器相关状态
const useSensorTilt = ref(false)
const hasSensorChanged = ref(false)
const initialGamma = ref(null)
const initialBeta = ref(null)
const isSensorDetecting = ref(false)
let detectionHandlerRef = null

// 计算容器样式
const containerStyle = computed(() => ({
  '--rotate-x': `${containerRotate.value.x}deg`,
  '--rotate-y': `${containerRotate.value.y}deg`,
}))

// 鼠标移动处理（使用 requestAnimationFrame 节流）
let rafId = null
function handleMouseMove(event) {
  if (useSensorTilt.value) return
  if (rafId) return
  if (!containerRef.value) return

  rafId = requestAnimationFrame(() => {
    const rect = containerRef.value.getBoundingClientRect()
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
  if (!props.enableSensor) return

  isSensorDetecting.value = true

  detectionHandlerRef = function detectionHandler(event) {
    if (event.gamma !== null && event.beta !== null) {
      // 记录初始值并检测变化
      if (initialGamma.value === null) {
        initialGamma.value = event.gamma
        initialBeta.value = event.beta
      } else if (!hasSensorChanged.value && !useSensorTilt.value) {
        const relativeGamma = event.gamma - BASELINE_GAMMA
        const relativeBeta = event.beta - BASELINE_BETA
        const initialRelativeGamma = initialGamma.value - BASELINE_GAMMA
        const initialRelativeBeta = initialBeta.value - BASELINE_BETA

        const gammaDiff = Math.abs(relativeGamma - initialRelativeGamma)
        const betaDiff = Math.abs(relativeBeta - initialRelativeBeta)

        if (gammaDiff > 2 || betaDiff > 2) {
          hasSensorChanged.value = true
          useSensorTilt.value = true
          document.removeEventListener('mousemove', handleMouseMove)
          document.removeEventListener('mouseleave', handleMouseLeave)
        }
      }

      // 如果已激活传感器模式，实时更新倾斜
      if (useSensorTilt.value) {
        containerRotate.value = calculateTiltFromSensor(event.gamma, event.beta, event.alpha)
      }
    }
  }

  window.addEventListener('deviceorientation', detectionHandlerRef)

  setTimeout(() => {
    isSensorDetecting.value = false
    if (!useSensorTilt.value) {
      useSensorTilt.value = false
    }
  }, props.sensorTimeout)
}

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseleave', handleMouseLeave)
  startSensorDetection()
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseleave', handleMouseLeave)

  if (detectionHandlerRef) {
    window.removeEventListener('deviceorientation', detectionHandlerRef)
  }

  if (rafId) {
    cancelAnimationFrame(rafId)
  }
})
</script>

<style scoped>
.tilt-container {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  will-change: transform;
  transform: rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg));
  transition: transform 0.1s ease-out;
  pointer-events: none;
}

.tilt-container > * {
  pointer-events: auto;
}
</style>
