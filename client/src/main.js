// Import Vue's createApp function to initialize the application
import { createApp } from 'vue'
// Import Pinia for state management
import { createPinia } from 'pinia'

// Import the root App component
import App from './App.vue'
// Import router
import router from './router'
// Import auth store to initialize authentication
import { useAuthStore } from './stores/authStore'
import { useLanguageStore } from './stores/languageStore'
import { useThemeStore } from './stores/themeStore'
import './index.css'
import i18n from './i18n'

// Create Pinia instance
const pinia = createPinia()

// Create the Vue application instance
const app = createApp(App)

// Register Pinia plugin for state management
app.use(pinia)

// Register router
app.use(router)

// Register i18n
app.use(i18n)

/**
 * ============================================
 * INITIALIZE AUTHENTICATION
 * ============================================
 *
 * This runs when app starts
 *
 * If user has token in localStorage:
 * 1. Set token in axios headers
 * 2. Fetch user data from backend
 *
 * This allows user to stay logged in after page refresh!
 */
const authStore = useAuthStore()
authStore.initAuth()

// Initialize language preferences
const languageStore = useLanguageStore()
languageStore.initLanguage()

// Initialize theme
const themeStore = useThemeStore()
themeStore.initTheme()

// Mount the app to the DOM element with id="app"
app.mount('#app')

