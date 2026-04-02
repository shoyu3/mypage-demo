<template>
  <span ref="elementRef" class="type-writer">
    {{ displayText }}<span class="cursor" :class="{ 'blink': showCursor && isTyping }">|</span>
  </span>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  speed: {
    type: Number,
    default: 80
  },
  delay: {
    type: Number,
    default: 0
  },
  showCursor: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['complete'])

const elementRef = ref(null)
const displayText = ref('')
const isTyping = ref(false)
const hasStarted = ref(false)
let timeoutId = null
let observer = null

const type = () => {
  if (hasStarted.value) return
  hasStarted.value = true
  isTyping.value = true
  displayText.value = ''
  let index = 0

  const typeChar = () => {
    if (index < props.text.length) {
      displayText.value += props.text.charAt(index)
      index++
      timeoutId = setTimeout(typeChar, props.speed)
    } else {
      isTyping.value = false
      emit('complete')
    }
  }

  timeoutId = setTimeout(typeChar, props.delay)
}

const start = () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  hasStarted.value = false
  type()
}

defineExpose({ start })

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasStarted.value) {
          type()
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
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})

watch(() => props.text, () => {
  hasStarted.value = false
  displayText.value = ''
  isTyping.value = false
  // 清除之前的 timeout
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
  // 重新创建 IntersectionObserver，以便在元素进入视口时触发打字
  if (observer) {
    observer.disconnect()
  }
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasStarted.value) {
          type()
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
</script>

<style scoped>
.type-writer {
  white-space: pre-wrap;
}

.cursor {
  color: var(--primary);
  font-weight: 300;
}

.cursor.blink {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
</style>
