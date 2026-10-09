<script setup>
import { computed } from 'vue'
import { useCalendarStore } from '@/stores/calendarStore'
import { useTaskStore } from '@/stores/taskStore'
import { useCalendar } from '@/composables/useCalendar'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const calendarStore = useCalendarStore()
const taskStore = useTaskStore()
const { getHeaderTitle } = useCalendar()
const router = useRouter()
const { t } = useI18n()

const emit = defineEmits(['new-task', 'refresh'])

const views = ['Day', 'Week', 'Month', 'Year']

const title = computed(() =>
  getHeaderTitle(calendarStore.currentDate, calendarStore.activeView)
)
</script>

<template>
  <header class="cal-header">
    <!-- Left: Navigation -->
    <div class="cal-header-left">
      <button class="cal-nav-btn" @click="calendarStore.navigate(-1)" title="Previous">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button class="cal-today-btn" @click="calendarStore.goToToday()">{{ t('calendar.header.today') }}</button>

      <button class="cal-nav-btn" @click="calendarStore.navigate(1)" title="Next">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <h2 class="cal-title">{{ title }}</h2>
    </div>

    <!-- Center: View Switcher -->
    <div class="cal-view-switcher">
      <button
        v-for="view in views"
        :key="view"
        :class="['cal-view-btn', { active: calendarStore.activeView === view.toLowerCase() }]"
        @click="calendarStore.setView(view.toLowerCase())"
      >
        {{ t(`calendar.header.${view.toLowerCase()}`) }}
        <span v-if="view === 'Month'" class="default-badge">{{ t('calendar.header.default') }}</span>
      </button>
    </div>

    <!-- Right: Actions -->
    <div class="cal-header-right">
      <!-- Search -->
      <div class="cal-search-wrap">
        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="cal-search-icon">
          <circle cx="11" cy="11" r="8"/><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          v-model="calendarStore.searchQuery"
          class="cal-search"
          :placeholder="t('calendar.header.search_placeholder')"
          type="text"
        />
      </div>

      <!-- Refresh -->
      <button 
        class="cal-icon-btn" 
        :class="{ 'is-refreshing': taskStore.loading }" 
        title="Refresh" 
        @click="$emit('refresh')"
      >
        <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>

      <!-- New Task -->
      <button class="cal-new-task-btn" @click="calendarStore.openNewTask()">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        {{ t('calendar.header.new_task') }}
      </button>
    </div>
  </header>
</template>

<style scoped>
.cal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 20px;
  background: var(--card-bg);
  border-bottom: 1px solid var(--border-light);
  flex-wrap: wrap;
  position: sticky;
  top: 0;
  z-index: 10;
}

.cal-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cal-nav-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid var(--border-light);
  background: var(--bg-main);
  color: var(--text-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
}

.cal-nav-btn:hover {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.cal-today-btn {
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid var(--border-light);
  background: var(--bg-main);
  color: var(--text-dark);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}

.cal-today-btn:hover {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.cal-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0;
  letter-spacing: -0.3px;
  min-width: 200px;
}

.cal-view-switcher {
  display: flex;
  background: var(--bg-main);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  padding: 3px;
  gap: 2px;
}

.cal-view-btn {
  padding: 6px 14px;
  border-radius: 7px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.18s;
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 5px;
}

.cal-view-btn:hover {
  color: var(--text-dark);
  background: var(--hover-bg);
}

.cal-view-btn.active {
  background: var(--primary);
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(59,130,246,0.25);
}

.default-badge {
  font-size: 10px;
  background: rgba(255,255,255,0.25);
  padding: 1px 5px;
  border-radius: 4px;
  display: none;
}

.cal-view-btn.active .default-badge {
  display: inline;
}

.cal-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cal-search-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.cal-search-icon {
  position: absolute;
  left: 10px;
  color: var(--text-muted);
  pointer-events: none;
}

.cal-search {
  padding: 7px 12px 7px 32px;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  background: var(--bg-main);
  color: var(--text-dark);
  font-size: 13px;
  font-family: inherit;
  width: 180px;
  transition: all 0.2s;
}

.cal-search:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
  width: 220px;
}

.cal-icon-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid var(--border-light);
  background: var(--bg-main);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
}

.cal-icon-btn:hover {
  color: var(--primary-color);
  background: var(--primary-light);
}

.cal-icon-btn.is-refreshing svg {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

.cal-new-task-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  border: none;
  background: var(--primary);
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
  box-shadow: 0 2px 8px rgba(59,130,246,0.3);
}

.cal-new-task-btn:hover {
  background: #2563EB;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59,130,246,0.4);
}

@media (max-width: 900px) {
  .cal-title { font-size: 15px; min-width: auto; }
  .cal-search { display: none; }
  .cal-search-wrap { display: none; }
  .default-badge { display: none !important; }
}

@media (max-width: 768px) {
  .cal-header {
    padding: 10px 12px;
    gap: 8px;
  }
  .cal-header-left {
    flex: 1;
    min-width: 0;
  }
  .cal-title {
    font-size: 14px;
    min-width: unset;
  }
  .cal-view-switcher {
    order: 3;
    width: 100%;
    justify-content: center;
  }
  .cal-view-btn {
    padding: 6px 10px;
    font-size: 12px;
  }
  .cal-header-right {
    gap: 6px;
  }
  .cal-new-task-btn {
    padding: 6px 10px;
    font-size: 12px;
  }
  .cal-new-task-btn svg {
    display: block;
  }
  .cal-nav-btn {
    width: 30px;
    height: 30px;
  }
  .cal-today-btn {
    padding: 5px 10px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .cal-header {
    padding: 8px 10px;
    gap: 6px;
  }
  .cal-title {
    font-size: 13px;
  }
  .cal-view-btn {
    padding: 5px 8px;
    font-size: 11px;
  }
  .cal-new-task-btn span {
    display: none;
  }
  .cal-new-task-btn {
    padding: 7px;
  }
}
</style>
