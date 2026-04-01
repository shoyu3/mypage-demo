<template>
  <span class="count-up">{{ displayValue }}</span>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

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
  },
  startOnMount: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['complete'])

const displayValue = ref(props.prefix + '0' + props.suffix)
let animationId = null

const animate = () => {
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
  animate()
}

defineExpose({ start })

onMounted(() => {
  if (props.startOnMount) {
    animate()
  }
})

watch(() => props.end, () => {
  if (props.startOnMount) {
    animate()
  }
})
</script>

<style scoped>
.count-up {
  font-variant-numeric: tabular-nums;
}
</style>
