<template>
  <router-view v-slot="{ Component }">
    <transition
      name="page"
      mode="out-in"
      appear
      @before-enter="onBeforeEnter"
      @before-leave="onBeforeLeave"
      @after-enter="onAfterEnter"
    >
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup>
import { ref, provide } from 'vue'

const isFirstLoad = ref(true)
provide('isFirstLoad', isFirstLoad)

function onBeforeEnter() {
  document.body.style.overflow = 'hidden'
}

function onBeforeLeave() {
  document.body.style.overflow = 'hidden'
}

function onAfterEnter() {
  const delay = isFirstLoad.value ? 1200 : 400
  setTimeout(() => {
    document.body.style.overflow = ''
  }, delay)
  isFirstLoad.value = false
}
</script>

<style>
/* 页面切换动画 - 原页面向下移动同时淡出 */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.page-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
