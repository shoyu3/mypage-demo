/**
 * 主题配置文件
 * 提供浅色/深色模式 + 三种主题色切换
 * 支持自定义色值接口
 */

// 基础颜色配置
const baseColors = {
  light: {
    background: '#ffffff',
    foreground: '#08060d',
    muted: '#6b6375',
    border: '#e5e4e7',
    'muted-bg': '#f4f3ec',
  },
  dark: {
    background: '#16171d',
    foreground: '#f3f4f6',
    muted: '#9ca3af',
    border: '#2e303a',
    'muted-bg': '#1f2028',
  },
}

// 主题色配置 - 三种可切换的主题色
const themeColors = {
  // 粉色主题 (默认)
  purple: {
    light: {
      primary: '#e5adb7',
      'primary-hover': '#d49aa5',
      'primary-bg': 'rgba(229, 173, 183, 0.1)',
      'primary-border': 'rgba(229, 173, 183, 0.5)',
    },
    dark: {
      primary: '#e5adb7',
      'primary-hover': '#d49aa5',
      'primary-bg': 'rgba(229, 173, 183, 0.15)',
      'primary-border': 'rgba(229, 173, 183, 0.5)',
    },
  },
  // 蓝色主题
  blue: {
    light: {
      primary: '#3b82f6',
      'primary-hover': '#2563eb',
      'primary-bg': 'rgba(59, 130, 246, 0.1)',
      'primary-border': 'rgba(59, 130, 246, 0.5)',
    },
    dark: {
      primary: '#60a5fa',
      'primary-hover': '#3b82f6',
      'primary-bg': 'rgba(96, 165, 250, 0.15)',
      'primary-border': 'rgba(96, 165, 250, 0.5)',
    },
  },
  // 绿色主题
  green: {
    light: {
      primary: '#10b981',
      'primary-hover': '#059669',
      'primary-bg': 'rgba(16, 185, 129, 0.1)',
      'primary-border': 'rgba(16, 185, 129, 0.5)',
    },
    dark: {
      primary: '#34d399',
      'primary-hover': '#10b981',
      'primary-bg': 'rgba(52, 211, 153, 0.15)',
      'primary-border': 'rgba(52, 211, 153, 0.5)',
    },
  },
  // 橙色主题
  orange: {
    light: {
      primary: '#f97316',
      'primary-hover': '#ea580c',
      'primary-bg': 'rgba(249, 115, 22, 0.1)',
      'primary-border': 'rgba(249, 115, 22, 0.5)',
    },
    dark: {
      primary: '#fb923c',
      'primary-hover': '#f97316',
      'primary-bg': 'rgba(251, 146, 60, 0.15)',
      'primary-border': 'rgba(251, 146, 60, 0.5)',
    },
  },
}

// 生成 CSS 变量的函数
export function generateCSSVariables(mode, themeName) {
  const base = baseColors[mode]
  const theme = themeColors[themeName][mode]

  // 毛玻璃效果背景色 - 根据模式切换
  const glassBg = mode === 'dark' ? 'rgba(22, 23, 29, 0.7)' : 'rgba(255, 255, 255, 0.7)'
  const glassBorder = mode === 'dark' ? 'rgba(46, 48, 58, 0.5)' : 'rgba(255, 255, 255, 0.3)'

  return {
    '--background': base.background,
    '--foreground': base.foreground,
    '--muted': base.muted,
    '--border': base.border,
    '--muted-bg': base['muted-bg'],
    '--primary': theme.primary,
    '--primary-hover': theme['primary-hover'],
    '--primary-bg': theme['primary-bg'],
    '--primary-border': theme['primary-border'],
    '--glass-bg': glassBg,
    '--glass-border': glassBorder,
  }
}

// 应用 CSS 变量到文档
// userMode: 用户设置的模式（可能是 'auto'），用于保存到 localStorage
export function applyTheme(mode, themeName, userMode = mode) {
  const variables = generateCSSVariables(mode, themeName)
  const root = document.documentElement

  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })

  // 设置 data 属性用于 Tailwind 选择器（使用实际生效的模式）
  root.setAttribute('data-mode', mode)
  root.setAttribute('data-theme', themeName)

  // 保存到 localStorage（保存用户设置的模式，保留 'auto'）
  localStorage.setItem('theme-mode', userMode)
  localStorage.setItem('theme-color', themeName)
}

// 获取系统主题模式
export function getSystemMode() {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// 获取保存的主题设置
export function getSavedTheme() {
  const savedMode = localStorage.getItem('theme-mode')
  return {
    // 默认为 'auto'，支持 'light' | 'dark' | 'auto'
    mode: savedMode || 'auto',
    themeName: localStorage.getItem('theme-color') || 'purple',
  }
}

// 自定义主题色接口
export function createCustomTheme(name, colors) {
  return {
    name,
    light: {
      primary: colors.primary,
      'primary-hover': colors.primaryHover || colors.primary,
      'primary-bg': colors.primaryBg || `${colors.primary}1a`,
      'primary-border': colors.primaryBorder || `${colors.primary}80`,
    },
    dark: {
      primary: colors.primaryDark || colors.primary,
      'primary-hover': colors.primaryHoverDark || colors.primaryHover || colors.primary,
      'primary-bg': colors.primaryBgDark || `${colors.primaryDark || colors.primary}26`,
      'primary-border': colors.primaryBorderDark || `${colors.primaryDark || colors.primary}80`,
    },
  }
}

// 注册自定义主题
export function registerCustomTheme(themeConfig) {
  themeColors[themeConfig.name] = {
    light: themeConfig.light,
    dark: themeConfig.dark,
  }
}

// 导出配置
export { baseColors, themeColors }
export const availableThemes = ['purple', 'blue', 'orange', 'green']
