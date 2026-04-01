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
  enableSensor: {
    type: Boolean,
    default: true
  },
  sensorTimeout: {
    type: Number,
    default: 5000
  }
})

const containerRef = ref(null)
const containerRotate = ref({ x: 0, y: 0 })

const useSensorTilt = ref(false)
const hasSensorChanged = ref(false)
const initialGamma = ref(null)
const initialBeta = ref(null)
const isSensorDetecting = ref(false)
let detectionHandlerRef = null

const containerStyle = computed(() => ({
  '--rotate-x': `${containerRotate.value.x}deg`,
  '--rotate-y': `${containerRotate.value.y}deg`,
}))

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

function handleMouseLeave() {
  containerRotate.value = { x: 0, y: 0 }
}

function startSensorDetection() {
  if (!props.enableSensor) return

  isSensorDetecting.value = true

  detectionHandlerRef = function detectionHandler(event) {
    if (event.gamma !== null && event.beta !== null) {
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
  position: relative;
  width: 100%;
  will-change: transform;
  transform: rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg));
  transition: transform 0.1s ease-out;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
