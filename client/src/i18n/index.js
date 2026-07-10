import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import am from './locales/am.json'

// Supported languages
export const SUPPORTED_LOCALES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'am', name: 'አማርኛ', flag: '🇪🇹' }
]

export const DEFAULT_LOCALE = 'en'

// Setup Vue I18n instance
export const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: DEFAULT_LOCALE, 
  fallbackLocale: DEFAULT_LOCALE,
  messages: {
    en,
    am
  },
  // Ensure components don't re-render fully but smoothly transition text
  globalInjection: true 
})

export default i18n
