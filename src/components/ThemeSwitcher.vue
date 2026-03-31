<template>
  <div class="theme-switcher">
    <!-- 明暗模式切换 -->
    <button
      class="mode-toggle"
      :class="{ 'is-dark': themeStore.isDark, 'is-auto': themeStore.isAuto }"
      @click="themeStore.toggleMode()"
      :title="modeTitle"
    >
      <span class="mode-icon">
        {{ modeIcon }}
      </span>
      <span v-if="themeStore.isAuto" class="auto-badge">A</span>
    </button>

    <!-- 主题色选择 -->
    <div class="color-picker">
      <button
        v-for="theme in availableThemes"
        :key="theme"
        class="color-option"
        :class="{ active: themeStore.currentTheme === theme }"
        :style="getThemeStyle(theme)"
        @click="themeStore.setThemeColor(theme)"
        :title="getThemeLabel(theme)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { themeColors } from '@/config/theme.config'

const themeStore = useThemeStore()

const availableThemes = ['purple', 'blue', 'green']

const themeLabels = {
  purple: '紫色主题',
  blue: '蓝色主题',
  green: '绿色主题',
}

const modeIcon = computed(() => {
  if (themeStore.isAuto) return '🌓'
  return themeStore.isDark ? '🌙' : '☀️'
})

const modeTitle = computed(() => {
  if (themeStore.isAuto) return '当前为自动模式（跟随系统），点击切换到浅色模式'
  return themeStore.isDark ? '当前为深色模式，点击切换到自动模式' : '当前为浅色模式，点击切换到深色模式'
})

function getThemeLabel(theme) {
  return themeLabels[theme] || theme
}

function getThemeStyle(theme) {
  const colors = themeColors[theme]
  const isDark = themeStore.isDark
  const primary = isDark ? colors.dark.primary : colors.light.primary

  return {
    backgroundColor: primary,
  }
}
</script>

<style scoped>
.theme-switcher {
  @apply flex items-center gap-3;
}

.mode-toggle {
  @apply relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300;
  background: var(--muted-bg);
  border: 1px solid var(--border);

  &:hover {
    border-color: var(--primary-border);
    box-shadow: var(--shadow);
  }

  &.is-dark {
    background: var(--primary-bg);
  }

  &.is-auto {
    background: linear-gradient(135deg, var(--primary-bg) 50%, var(--muted-bg) 50%);
  }
}

.mode-icon {
  @apply text-lg;
}

.auto-badge {
  @apply absolute -top-1 -right-1 text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full;
  background: var(--primary);
  color: white;
  font-size: 10px;
}

.color-picker {
  @apply flex items-center gap-2;
}

.color-option {
  @apply h-6 w-6 rounded-full cursor-pointer transition-all duration-200;
  border: 2px solid transparent;

  &:hover {
    @apply scale-110;
    border-color: var(--border);
  }

  &.active {
    @apply scale-110;
    border-color: var(--foreground);
    box-shadow: 0 0 0 2px var(--background), 0 0 0 4px var(--primary);
  }
}
</style>
