<template>
  <div class="app">
    <nav class="navbar">
      <div class="nav-links">
        <router-link to="/">{{ $t('nav.home') }}</router-link>
        <router-link to="/about">{{ $t('nav.about') }}</router-link>
      </div>
      <div class="language-switcher">
        <span>{{ $t('language.switch') }}:</span>
        <button 
          v-for="lang in languages" 
          :key="lang.code"
          :class="{ active: currentLocale === lang.code }"
          @click="changeLanguage(lang.code)"
        >
          {{ lang.label }}
        </button>
      </div>
    </nav>
    
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const currentLocale = computed(() => locale.value)

const languages = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'English' }
]

const changeLanguage = (lang) => {
  locale.value = lang
}
</script>

<style scoped>
.app {
  max-width: 1200px;
  margin: 0 auto;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #35495e;
  color: white;
}

.nav-links a {
  color: white;
  text-decoration: none;
  margin-right: 20px;
  font-size: 16px;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: #42b883;
}

.language-switcher {
  display: flex;
  align-items: center;
  gap: 10px;
}

.language-switcher button {
  padding: 5px 12px;
  border: 1px solid #42b883;
  background: transparent;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.language-switcher button.active {
  background: #42b883;
  color: white;
}

.language-switcher button:hover {
  background: #42b883;
}

main {
  padding: 20px;
}
</style>
