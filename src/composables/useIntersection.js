import { ref, onMounted, onUnmounted } from 'vue'

export function useIntersection(options = {}) {
  const {
    threshold = 0.2,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true
  } = options

  const elementRef = ref(null)
  const isIntersecting = ref(false)
  let observer = null

  onMounted(() => {
    if (!elementRef.value) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isIntersecting.value = true
            if (triggerOnce) {
              observer.unobserve(entry.target)
            }
          } else if (!triggerOnce) {
            isIntersecting.value = false
          }
        })
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(elementRef.value)
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    elementRef,
    isIntersecting
  }
}
