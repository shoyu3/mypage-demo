<template>
  <div ref="wrapperRef" class="glow-card-wrapper" :class="{ 'is-animated': isVisible }">
    <div class="glow-card" :class="{ 'with-glow': showGlow }">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  showGlow: {
    type: Boolean,
    default: true
  },
  threshold: {
    type: Number,
    default: 0.2
  }
})

const wrapperRef = ref(null)
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

  if (wrapperRef.value) {
    observer.observe(wrapperRef.value)
  }
})
</script>

<style scoped>
.glow-card-wrapper {
  position: relative;
  opacity: 0;
  transform: translateY(30px) rotateX(5deg);
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.glow-card-wrapper.is-animated {
  opacity: 1;
  transform: translateY(0) rotateX(0);
}

.glow-card {
  position: relative;
  background-color: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 1rem;
  padding: 2rem;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
}

.glow-card.with-glow::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 1rem;
  padding: 2px;
  background: linear-gradient(
    135deg,
    var(--primary) 0%,
    transparent 50%,
    var(--primary) 100%
  );
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
  animation: glow-rotate 4s linear infinite;
}

.glow-card-wrapper.is-animated .glow-card.with-glow::before {
  opacity: 1;
}

@keyframes glow-rotate {
  0% {
    filter: hue-rotate(0deg);
  }
  100% {
    filter: hue-rotate(360deg);
  }
}

.glow-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(var(--primary-rgb), 0.15);
}
</style>
