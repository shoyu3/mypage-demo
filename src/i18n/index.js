import { createI18n } from 'vue-i18n'
import zh from './locales/zh.json'
import en from './locales/en.json'

const STORAGE_KEY = 'app-locale'
const SUPPORTED_LOCALES = ['zh', 'en']

function getBrowserLocale() {
  const browserLang = navigator.language || navigator.userLanguage
  const lang = browserLang.toLowerCase()
  if (lang.startsWith('zh')) {
    return 'zh'
  }
  return 'en'
}

function getInitialLocale() {
  const savedLocale = localStorage.getItem(STORAGE_KEY)
  if (savedLocale && SUPPORTED_LOCALES.includes(savedLocale)) {
    return savedLocale
  }
  return getBrowserLocale()
}

export function setLocale(i18nInstance, locale) {
  if (SUPPORTED_LOCALES.includes(locale)) {
    // 支持传入 i18n 实例或 locale ref 对象
    if (i18nInstance.global) {
      // 传入的是 i18n 实例
      i18nInstance.global.locale.value = locale
    } else if (typeof i18nInstance === 'string') {
      // 传入的是 locale ref 的 value
      // 这种情况下需要导入 i18n 实例
      i18n.global.locale.value = locale
    } else if (i18nInstance.value !== undefined) {
      // 传入的是 locale ref 对象
      i18nInstance.value = locale
    }
    localStorage.setItem(STORAGE_KEY, locale)
    document.documentElement.setAttribute('lang', locale)
  }
}

const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages: {
    zh,
    en
  }
})

document.documentElement.setAttribute('lang', i18n.global.locale.value)

export default i18n
