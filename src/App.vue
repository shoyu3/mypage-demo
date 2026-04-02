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
}

function onBeforeLeave() {
}

function onAfterEnter() {
  isFirstLoad.value = false
}
</script>

<style>
/* 防止页面切换时出现滚动条 */
html, body {
  overflow: hidden;
  height: 100%;
}

#app {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 页面切换动画容器 */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

.page-enter-to,
.page-leave-from {
  opacity: 1;
}
</style>
