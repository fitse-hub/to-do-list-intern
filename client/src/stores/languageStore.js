import { defineStore } from 'pinia'
import { i18n, SUPPORTED_LOCALES, DEFAULT_LOCALE } from '../i18n'

export const useLanguageStore = defineStore('language', {
  state: () => ({
    currentLocale: DEFAULT_LOCALE,
    supportedLocales: SUPPORTED_LOCALES
  }),
  
  getters: {
    currentLanguageName: (state) => {
      const locale = state.supportedLocales.find(l => l.code === state.currentLocale)
      return locale ? locale.name : 'English'
    },
    currentLanguageFlag: (state) => {
      const locale = state.supportedLocales.find(l => l.code === state.currentLocale)
      return locale ? locale.flag : '🌐'
    }
  },
  
  actions: {
    setLanguage(localeCode) {
      if (!this.supportedLocales.find(l => l.code === localeCode)) {
        console.warn(`Locale ${localeCode} is not supported.`)
        return
      }
      
      // Update Pinia state
      this.currentLocale = localeCode
      
      // Update Vue I18n instance immediately
      i18n.global.locale.value = localeCode
      
      // Save to localStorage
      localStorage.setItem('user-language', localeCode)
      
      // Update document direction if RTL is needed in the future
      // document.documentElement.setAttribute('dir', localeCode === 'ar' ? 'rtl' : 'ltr')
      document.documentElement.setAttribute('lang', localeCode)
    },
    
    initLanguage() {
      // 1. Check local storage
      const savedLanguage = localStorage.getItem('user-language')
      if (savedLanguage && this.supportedLocales.find(l => l.code === savedLanguage)) {
        this.setLanguage(savedLanguage)
        return
      }
      
      // 2. Check browser language (navigator.language)
      const browserLang = navigator.language.split('-')[0] // e.g., 'en-US' -> 'en'
      if (this.supportedLocales.find(l => l.code === browserLang)) {
        this.setLanguage(browserLang)
        return
      }
      
      // 3. Fallback to default
      this.setLanguage(DEFAULT_LOCALE)
    }
  }
})
