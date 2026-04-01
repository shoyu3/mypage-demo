<template>
  <div
    ref="elementRef"
    class="fade-in-up"
    :class="{ 'is-visible': isVisible, 'from-left': direction === 'left', 'from-right': direction === 'right' }"
    :style="{ transitionDelay: `${delay}ms` }"
  >
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  delay: {
    type: Number,
    default: 0
  },
  direction: {
    type: String,
    default: 'up',
    validator: (value) => ['up', 'left', 'right'].includes(value)
  },
  threshold: {
    type: Number,
    default: 0.2
  }
})

const elementRef = ref(null)
const isVisible = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: props.threshold,
      rootMargin: '0px 0px -50px 0px'
    }
  )

  if (elementRef.value) {
    observer.observe(elementRef.value)
  }
})
</script>

<style scoped>
.fade-in-up {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-in-up.from-left {
  transform: translateX(-50px);
}

.fade-in-up.from-right {
  transform: translateX(50px);
}

.fade-in-up.is-visible {
  opacity: 1;
  transform: translateY(0) translateX(0);
}
</style>
