<template>
  <div class="home">
    <div class="card">
      <h1>{{ $t('home.title') }}</h1>
      <p>{{ $t('home.description') }}</p>
    </div>
    <div class="floating-menus">
      <!-- 语言切换菜单 -->
      <div class="menu-container" ref="langMenuContainer">
        <div class="icon-card" @click.stop="toggleLangMenu">
          <icon-lucide-languages class="icon" />
        </div>
        <Transition name="menu">
          <div v-if="isLangMenuOpen" class="dropdown-menu">
            <div class="menu-title">{{ $t('language.switch') || 'Language' }}</div>
            <div class="menu-options">
              <button v-for="option in langOptions" :key="option.value" class="menu-option"
                :class="{ active: currentLocale === option.value }" @click="selectLocale(option.value)">
                <span class="option-icon">{{ option.icon }}</span>
                <span class="option-label">{{ option.label }}</span>
                <span v-if="currentLocale === option.value" class="check-icon">
                  <icon-lucide-check class="check" />
                </span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
      <!-- 主题切换菜单 -->
      <div class="menu-container" ref="menuContainer">
        <div class="icon-card" @click.stop="toggleMenu">
          <icon-lucide-palette class="icon" />
        </div>
        <Transition name="menu">
          <div v-if="isMenuOpen" class="dropdown-menu theme-dropdown">
            <!-- 模式选择 -->
            <div class="menu-section">
              <div class="menu-title">{{ $t('theme.mode') || '主题模式' }}</div>
              <div class="menu-options">
                <button v-for="option in themeOptions" :key="option.value" class="menu-option"
                  :class="{ active: themeStore.mode === option.value }" @click="selectMode(option.value)">
                  <span class="option-icon">{{ option.icon }}</span>
                  <span class="option-label">{{ option.label }}</span>
                  <span v-if="themeStore.mode === option.value" class="check-icon">
                    <icon-lucide-check class="check" />
                  </span>
                </button>
              </div>
            </div>
            <!-- 分隔线 -->
            <div class="menu-divider"></div>
            <!-- 颜色选择 -->
            <div class="menu-section">
              <div class="menu-title">{{ $t('theme.color') || '主题颜色' }}</div>
              <div class="color-grid">
                <button v-for="color in colorOptions" :key="color.value" class="color-btn"
                  :class="{ active: themeStore.themeName === color.value }" :style="{ '--color-dot': color.color }"
                  @click="selectColor(color.value)" :title="color.label">
                  <span class="color-dot"></span>
                  <span v-if="themeStore.themeName === color.value" class="color-check">
                    <icon-lucide-check class="check" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/stores/theme'
import { setLocale } from '@/i18n'

const themeStore = useThemeStore()
const { locale } = useI18n()

// 主题菜单
const isMenuOpen = ref(false)
const menuContainer = ref(null)

// 语言菜单
const isLangMenuOpen = ref(false)
const langMenuContainer = ref(null)

const currentLocale = computed(() => locale.value)

const { t } = useI18n()

const themeOptions = computed(() => [
  { value: 'auto', label: t('theme.auto'), icon: '🌓' },
  { value: 'light', label: t('theme.light'), icon: '☀️' },
  { value: 'dark', label: t('theme.dark'), icon: '🌙' },
])

const colorOptions = [
  { value: 'purple', label: '紫色', color: '#aa3bff' },
  { value: 'blue', label: '蓝色', color: '#3b82f6' },
  { value: 'green', label: '绿色', color: '#10b981' },
]

const langOptions = [
  { value: 'zh', label: '中文', icon: '🇨🇳' },
  { value: 'en', label: 'English', icon: '🇬🇧' },
]

// 主题菜单控制
function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) {
    isLangMenuOpen.value = false
  }
}

function closeMenu() {
  isMenuOpen.value = false
}

function selectMode(mode) {
  themeStore.setMode(mode)
}

function selectColor(colorName) {
  themeStore.setThemeColor(colorName)
}

// 语言菜单控制
function toggleLangMenu() {
  isLangMenuOpen.value = !isLangMenuOpen.value
  if (isLangMenuOpen.value) {
    isMenuOpen.value = false
  }
}

function closeLangMenu() {
  isLangMenuOpen.value = false
}

function selectLocale(newLocale) {
  setLocale(locale, newLocale)
  closeLangMenu()
}

// 点击外部关闭菜单
function handleClickOutside(event) {
  if (menuContainer.value && !menuContainer.value.contains(event.target)) {
    closeMenu()
  }
  if (langMenuContainer.value && !langMenuContainer.value.contains(event.target)) {
    closeLangMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--background) 0%, var(--primary-bg) 100%);
  padding: 1.5rem;
  transition: background-color 0.3s ease;
}

.card {
  background-color: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 1rem;
  padding: 3rem 4rem;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.card h1 {
  color: var(--foreground);
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  transition: color 0.3s ease;
}

.card p {
  color: var(--muted);
  font-size: 1.125rem;
  line-height: 1.6;
  transition: color 0.3s ease;
}

.floating-menus {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 100;
  display: flex;
  gap: 0.75rem;
}

.menu-container {
  position: relative;
}

.icon-card {
  background-color: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  cursor: pointer;
  transition: all 0.2s ease, background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.icon-card:hover {
  transform: scale(1.05);
  border-color: var(--primary-border);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.icon {
  font-size: 1.5rem;
  color: var(--foreground);
  transition: color 0.3s ease;
}

.dropdown-menu {
  position: absolute;
  bottom: calc(100% + 0.5rem);
  right: 0;
  background-color: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 0.75rem;
  padding: 0.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  min-width: 140px;
  transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.theme-dropdown {
  min-width: 180px;
}

.menu-section {
  padding: 0.25rem 0;
}

.menu-divider {
  height: 1px;
  background-color: var(--glass-border);
  margin: 0.5rem 0;
}

/* 颜色选项样式 - 网格布局 */
.color-grid {
  display: flex;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem 0.5rem;
  justify-content: flex-start;
}

.color-btn {
  position: relative;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid transparent;
  background: transparent;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.color-btn:hover {
  transform: scale(1.1);
}

.color-btn.active {
  border-color: var(--primary);
}

.color-dot {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background-color: var(--color-dot);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.color-check {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-check .check {
  font-size: 0.75rem;
  color: #ffffff;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
}

.menu-title {
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: color 0.3s ease;
}

.menu-options {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.menu-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  color: var(--foreground);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s ease, background-color 0.3s ease, color 0.3s ease;
  text-align: left;
  width: 100%;
}

.menu-option:hover {
  background-color: var(--muted-bg);
}

.menu-option.active {
  background-color: var(--primary-bg);
  color: var(--primary);
}

.option-icon {
  font-size: 1rem;
}

.option-label {
  flex: 1;
}

.check-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.check {
  font-size: 0.875rem;
}

/* 菜单动画 */
.menu-enter-active,
.menu-leave-active {
  transition: all 0.2s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

.menu-enter-to,
.menu-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
