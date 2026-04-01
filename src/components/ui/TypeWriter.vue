<template>
  <span class="type-writer">
    {{ displayText }}<span class="cursor" :class="{ 'blink': showCursor && isTyping }">|</span>
  </span>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

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
  },
  startOnMount: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['complete'])

const displayText = ref('')
const isTyping = ref(false)
let timeoutId = null

const type = () => {
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
  type()
}

defineExpose({ start })

onMounted(() => {
  if (props.startOnMount) {
    type()
  }
})

watch(() => props.text, () => {
  if (props.startOnMount) {
    type()
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
