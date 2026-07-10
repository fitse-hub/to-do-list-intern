<template>
  <div class="language-switcher" ref="dropdownRef">
    <button
      type="button"
      @click="toggleDropdown"
      class="lang-btn"
      :class="{ 'active': isOpen }"
      aria-haspopup="true"
      :aria-expanded="isOpen"
    >
      <svg class="globe-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
      <span class="lang-text">{{ currentLanguageName }}</span>
      <svg
        class="chevron-icon"
        :class="{ 'open': isOpen }"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </button>

    <transition name="fade">
      <div v-if="isOpen" class="lang-dropdown" role="menu">
        <button
          v-for="locale in supportedLocales"
          :key="locale.code"
          @click="selectLanguage(locale.code)"
          class="lang-option"
          :class="{ 'active': currentLocale === locale.code }"
          role="menuitem"
        >
          <span class="lang-flag">{{ locale.flag }}</span>
          <span class="lang-name">{{ locale.name }}</span>
          
          <svg v-if="currentLocale === locale.code" class="check-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useLanguage } from '../../composables/useLanguage'

const { currentLocale, currentLanguageName, supportedLocales, changeLanguage } = useLanguage()

const isOpen = ref(false)
const dropdownRef = ref(null)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectLanguage = (code) => {
  changeLanguage(code)
  isOpen.value = false
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
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
.language-switcher {
  position: relative;
  display: inline-block;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.lang-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-white, #FFFFFF);
  border: 1px solid var(--border-light, #E5E7EB);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-dark, #1F2937);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.lang-btn:hover, .lang-btn.active {
  background-color: #F9FAFB;
  border-color: #D1D5DB;
}

.globe-icon {
  width: 18px;
  height: 18px;
  color: var(--text-muted, #6B7280);
}

.lang-text {
  line-height: 1;
}

.chevron-icon {
  width: 16px;
  height: 16px;
  color: var(--text-muted, #6B7280);
  transition: transform 0.2s ease;
}

.chevron-icon.open {
  transform: rotate(180deg);
}

.lang-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--bg-white, #FFFFFF);
  border: 1px solid var(--border-light, #E5E7EB);
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  min-width: 160px;
  z-index: 100;
  padding: 6px;
}

.lang-option {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: 6px;
  text-align: left;
  font-size: 14px;
  color: var(--text-dark, #1F2937);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.lang-option:hover {
  background-color: #F3F4F6;
}

.lang-option.active {
  color: var(--primary, #3B82F6);
  font-weight: 600;
  background-color: #EFF6FF;
}

.lang-flag {
  margin-right: 10px;
  font-size: 16px;
}

.lang-name {
  flex-grow: 1;
}

.check-icon {
  width: 16px;
  height: 16px;
  color: var(--primary, #3B82F6);
  margin-left: 8px;
}

/* Vue Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
