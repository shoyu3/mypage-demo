<template>
  <span ref="elementRef" class="count-up">{{ displayValue }}</span>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  end: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    default: 1500
  },
  suffix: {
    type: String,
    default: ''
  },
  prefix: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['complete'])

const elementRef = ref(null)
const displayValue = ref(props.prefix + '0' + props.suffix)
const hasStarted = ref(false)
let animationId = null
let observer = null

const animate = () => {
  if (hasStarted.value) return
  hasStarted.value = true
  const startTime = performance.now()
  const startValue = 0

  const step = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / props.duration, 1)
    
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    const currentValue = Math.floor(startValue + (props.end - startValue) * easeOutQuart)
    
    displayValue.value = props.prefix + currentValue + props.suffix

    if (progress < 1) {
      animationId = requestAnimationFrame(step)
    } else {
      displayValue.value = props.prefix + props.end + props.suffix
      emit('complete')
    }
  }

  animationId = requestAnimationFrame(step)
}

const start = () => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  hasStarted.value = false
  animate()
}

defineExpose({ start })

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasStarted.value) {
          animate()
          observer.disconnect()
        }
      })
    },
    { threshold: 0.1 }
  )

  if (elementRef.value) {
    observer.observe(elementRef.value)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})

watch(() => props.end, () => {
  hasStarted.value = false
  displayValue.value = props.prefix + '0' + props.suffix
  // 清除之前的动画
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  // 如果元素已经在视口内，直接开始动画
  if (elementRef.value) {
    const rect = elementRef.value.getBoundingClientRect()
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0
    if (isInViewport) {
      animate()
    }
  }
})
</script>

<style scoped>
.count-up {
  font-variant-numeric: tabular-nums;
}
</style>
