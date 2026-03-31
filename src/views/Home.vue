<template>
  <div class="home">
    <h1>{{ $t('home.title') }}</h1>
    <p>{{ $t('home.description') }}</p>
    
    <div class="counter-section">
      <h2>{{ $t('counter.title') }}</h2>
      <p>{{ $t('counter.count') }}: {{ counter.count }}</p>
      <p>{{ $t('counter.double') }}: {{ counter.doubleCount }}</p>
      <div class="buttons">
        <button @click="counter.decrement">{{ $t('counter.decrement') }}</button>
        <button @click="counter.increment">{{ $t('counter.increment') }}</button>
        <button @click="counter.reset">{{ $t('counter.reset') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCounterStore } from '../stores/counter.js'

const counter = useCounterStore()
</script>

<style scoped>
.home {
  padding: 20px;
}

.counter-section {
  margin-top: 30px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.buttons {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #42b883;
  color: white;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background: #3aa876;
}
</style>
