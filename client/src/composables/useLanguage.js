import { computed } from 'vue'
import { useLanguageStore } from '../stores/languageStore'

export function useLanguage() {
  const languageStore = useLanguageStore()
  
  const currentLocale = computed(() => languageStore.currentLocale)
  const currentLanguageName = computed(() => languageStore.currentLanguageName)
  const currentLanguageFlag = computed(() => languageStore.currentLanguageFlag)
  const supportedLocales = computed(() => languageStore.supportedLocales)
  
  const changeLanguage = (localeCode) => {
    languageStore.setLanguage(localeCode)
  }
  
  return {
    currentLocale,
    currentLanguageName,
    currentLanguageFlag,
    supportedLocales,
    changeLanguage
  }
}
