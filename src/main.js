import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import i18n from './i18n'
import { useThemeStore } from './stores/theme'

const app = createApp(App)

app.use(pinia)

// 初始化主题 - 在挂载前执行
const themeStore = useThemeStore()
themeStore.initTheme()
themeStore.listenToSystemTheme()

app.use(router)
app.use(i18n)

app.mount('#app')
