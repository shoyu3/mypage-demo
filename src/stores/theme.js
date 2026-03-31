import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import {
  applyTheme,
  getSavedTheme,
  createCustomTheme,
  registerCustomTheme,
  availableThemes,
} from '@/config/theme.config'

export const useThemeStore = defineStore('theme', () => {
  // 状态
  const mode = ref('light')
  const themeName = ref('purple')
  const customThemes = ref(new Map())

  // 计算属性
  const isDark = computed(() => mode.value === 'dark')
  const currentTheme = computed(() => themeName.value)
  const availableThemeList = computed(() => [...availableThemes, ...customThemes.value.keys()])

  // 初始化主题
  function initTheme() {
    const saved = getSavedTheme()
    mode.value = saved.mode
    themeName.value = saved.themeName
    applyTheme(mode.value, themeName.value)
  }

  // 切换明暗模式
  function toggleMode() {
    mode.value = mode.value === 'light' ? 'dark' : 'light'
    applyTheme(mode.value, themeName.value)
  }

  // 设置模式
  function setMode(newMode) {
    if (newMode === 'light' || newMode === 'dark') {
      mode.value = newMode
      applyTheme(mode.value, themeName.value)
    }
  }

  // 切换主题色
  function setThemeColor(name) {
    if (availableThemes.includes(name) || customThemes.value.has(name)) {
      themeName.value = name
      applyTheme(mode.value, themeName.value)
    }
  }

  // 添加自定义主题
  function addCustomTheme(name, colors) {
    const customTheme = createCustomTheme(name, colors)
    registerCustomTheme(customTheme)
    customThemes.value.set(name, customTheme)

    // 如果这是第一个自定义主题，自动切换
    if (customThemes.value.size === 1) {
      setThemeColor(name)
    }
  }

  // 删除自定义主题
  function removeCustomTheme(name) {
    if (customThemes.value.has(name)) {
      customThemes.value.delete(name)
      // 如果当前使用的是被删除的主题，切换到默认主题
      if (themeName.value === name) {
        setThemeColor('purple')
      }
    }
  }

  // 监听系统主题变化
  function listenToSystemTheme() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e) => {
      // 只在用户没有手动设置过主题时自动切换
      const hasUserPreference = localStorage.getItem('theme-mode')
      if (!hasUserPreference) {
        setMode(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }

  // 重置为系统默认
  function resetToSystem() {
    localStorage.removeItem('theme-mode')
    localStorage.removeItem('theme-color')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setMode(prefersDark ? 'dark' : 'light')
    setThemeColor('purple')
  }

  return {
    // 状态
    mode,
    themeName,
    customThemes,

    // 计算属性
    isDark,
    currentTheme,
    availableThemeList,

    // 方法
    initTheme,
    toggleMode,
    setMode,
    setThemeColor,
    addCustomTheme,
    removeCustomTheme,
    listenToSystemTheme,
    resetToSystem,
  }
})
