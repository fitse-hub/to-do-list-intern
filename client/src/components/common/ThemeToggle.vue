<script setup>
import { useThemeStore } from '@/stores/themeStore'

const themeStore = useThemeStore()
</script>

<template>
  <button 
    class="theme-toggle-btn" 
    :class="{ 'is-dark': themeStore.isDark }"
    @click="themeStore.toggleTheme()"
    aria-label="Toggle Dark Mode"
  >
    <div class="toggle-track">
      <div class="toggle-thumb">
        <!-- Sun icon -->
        <svg class="icon-sun" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"></circle>
          <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
        </svg>
        <!-- Moon icon -->
        <svg class="icon-moon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
        </svg>
      </div>
    </div>
  </button>
</template>

<style scoped>
.theme-toggle-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  outline: none;
}

.toggle-track {
  width: 54px;
  height: 28px;
  background-color: #E5E7EB;
  border-radius: 30px;
  position: relative;
  transition: background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

.is-dark .toggle-track {
  background-color: #1F2937;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 24px;
  height: 24px;
  background-color: #FFFFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55), background-color 0.4s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.is-dark .toggle-thumb {
  transform: translateX(26px);
  background-color: #111827;
}

.icon-sun, .icon-moon {
  position: absolute;
  width: 14px;
  height: 14px;
  transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55), stroke 0.4s ease;
}

.icon-sun {
  stroke: #F59E0B; /* Orange for sun */
  opacity: 1;
  transform: rotate(0) scale(1);
}

.is-dark .icon-sun {
  opacity: 0;
  transform: rotate(-90deg) scale(0.5);
}

.icon-moon {
  stroke: #60A5FA; /* Blue for moon */
  opacity: 0;
  transform: rotate(90deg) scale(0.5);
}

.is-dark .icon-moon {
  opacity: 1;
  transform: rotate(0) scale(1);
}

/* Hover effects */
.theme-toggle-btn:hover .toggle-track {
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1), 0 0 0 2px rgba(59, 130, 246, 0.3);
}
.is-dark.theme-toggle-btn:hover .toggle-track {
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.5), 0 0 0 2px rgba(96, 165, 250, 0.3);
}
</style>
