import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import {
  applyTheme,
  getSavedTheme,
  getSystemMode,
  createCustomTheme,
  registerCustomTheme,
  availableThemes,
} from '@/config/theme.config'

export const useThemeStore = defineStore('theme', () => {
  // 状态 - mode 支持 'light' | 'dark' | 'auto'
  const mode = ref('auto')
  const themeName = ref('purple')
  const customThemes = ref(new Map())

  // 计算属性 - 实际生效的模式（auto 时根据系统决定）
  const effectiveMode = computed(() => {
    if (mode.value === 'auto') {
      return getSystemMode()
    }
    return mode.value
  })

  const isDark = computed(() => effectiveMode.value === 'dark')
  const isAuto = computed(() => mode.value === 'auto')
  const currentTheme = computed(() => themeName.value)
  const availableThemeList = computed(() => [...availableThemes, ...customThemes.value.keys()])

  // 监听 effectiveMode 变化，自动应用主题
  watch(effectiveMode, (newMode) => {
    applyTheme(newMode, themeName.value, mode.value)
  })

  // 初始化主题
  function initTheme() {
    const saved = getSavedTheme()
    mode.value = saved.mode
    themeName.value = saved.themeName
    applyTheme(effectiveMode.value, themeName.value, mode.value)
  }

  // 切换明暗模式（light -> dark -> auto -> light）
  function toggleMode() {
    const modes = ['light', 'dark', 'auto']
    const currentIndex = modes.indexOf(mode.value)
    const nextIndex = (currentIndex + 1) % modes.length
    setMode(modes[nextIndex])
  }

  // 设置模式
  function setMode(newMode) {
    if (newMode === 'light' || newMode === 'dark' || newMode === 'auto') {
      mode.value = newMode
      localStorage.setItem('theme-mode', newMode)
      applyTheme(effectiveMode.value, themeName.value, mode.value)
    }
  }

  // 切换主题色
  function setThemeColor(name) {
    if (availableThemes.includes(name) || customThemes.value.has(name)) {
      themeName.value = name
      localStorage.setItem('theme-color', name)
      applyTheme(effectiveMode.value, themeName.value, mode.value)
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

    const handleChange = () => {
      // 只在 auto 模式下响应系统主题变化
      if (mode.value === 'auto') {
        applyTheme(getSystemMode(), themeName.value, mode.value)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }

  // 重置为系统默认
  function resetToSystem() {
    localStorage.removeItem('theme-mode')
    localStorage.removeItem('theme-color')
    mode.value = 'auto'
    themeName.value = 'purple'
    applyTheme(getSystemMode(), 'purple', 'auto')
  }

  return {
    // 状态
    mode,
    themeName,
    customThemes,

    // 计算属性
    effectiveMode,
    isDark,
    isAuto,
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
