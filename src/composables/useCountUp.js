import { ref, onMounted } from 'vue'

export function useCountUp(options = {}) {
  const {
    start = 0,
    end = 100,
    duration = 1500,
    startOnMount = false
  } = options

  const currentValue = ref(start)
  let animationId = null

  const animate = () => {
    const startTime = performance.now()
    const startValue = start

    const step = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      currentValue.value = Math.floor(startValue + (end - startValue) * easeOutQuart)

      if (progress < 1) {
        animationId = requestAnimationFrame(step)
      } else {
        currentValue.value = end
      }
    }

    animationId = requestAnimationFrame(step)
  }

  const start = () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    animate()
  }

  const stop = () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
  }

  onMounted(() => {
    if (startOnMount) {
      animate()
    }
  })

  return {
    currentValue,
    start,
    stop
  }
}
