<script setup>
import { onMounted, onUnmounted, computed, ref } from 'vue'
import { useCalendarStore } from '@/stores/calendarStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useI18n } from 'vue-i18n'
import MiniCalendar from './MiniCalendar.vue'

const calendarStore = useCalendarStore()
const categoryStore = useCategoryStore()
const { t } = useI18n()

const isMobile = ref(false)
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  categoryStore.fetchCategories()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

const priorities = computed(() => [
  { label: t('calendar.sidebar.priorities.high'), value: 'high', dot: '#EF4444' },
  { label: t('calendar.sidebar.priorities.medium'), value: 'medium', dot: '#EAB308' },
  { label: t('calendar.sidebar.priorities.low'), value: 'low', dot: '#22C55E' },
])

const statuses = computed(() => [
  { label: t('calendar.sidebar.statuses.todo'), value: 'todo' },
  { label: t('calendar.sidebar.statuses.completed'), value: 'completed' },
  { label: t('calendar.sidebar.statuses.failed'), value: 'failed' },
  { label: t('calendar.sidebar.statuses.archived'), value: 'archived' },
])
</script>

<template>
  <aside class="cal-sidebar">

    <!-- Mini Calendar -->
    <section class="sidebar-section mini-cal-section">
      <MiniCalendar />
    </section>

    <div class="sidebar-filters-container">
      <!-- Projects / Categories -->
      <details class="sidebar-section" :open="!isMobile">
        <summary class="sidebar-section-title">
          <div class="summary-inner">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {{ t('calendar.sidebar.projects') }}
          </div>
          <svg class="chevron" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
        </summary>
        <div class="details-content">
          <div v-if="categoryStore.loading" class="sidebar-loading">{{ t('calendar.sidebar.loading') }}</div>
          <div v-else-if="categoryStore.categories.length === 0" class="sidebar-empty">{{ t('calendar.sidebar.no_categories') }}</div>
          <label
            v-for="cat in categoryStore.categories"
            :key="cat.id"
            class="sidebar-filter-row"
          >
            <input
              type="checkbox"
              class="cal-checkbox"
              :checked="calendarStore.filters.categories.includes(cat.id)"
              @change="calendarStore.toggleCategoryFilter(cat.id)"
            />
            <span class="cat-dot" :style="{ background: cat.color || 'var(--primary)' }"></span>
            <span class="filter-label">{{ cat.name }}</span>
          </label>
        </div>
      </details>

      <!-- Priority -->
      <details class="sidebar-section" :open="!isMobile">
        <summary class="sidebar-section-title">
          <div class="summary-inner">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            {{ t('calendar.sidebar.priority') }}
          </div>
          <svg class="chevron" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
        </summary>
        <div class="details-content">
          <label
            v-for="p in priorities"
            :key="p.value"
            class="sidebar-filter-row"
          >
            <input
              type="checkbox"
              class="cal-checkbox"
              :checked="calendarStore.filters.priorities.includes(p.value)"
              @change="calendarStore.togglePriorityFilter(p.value)"
            />
            <span class="cat-dot" :style="{ background: p.dot }"></span>
            <span class="filter-label">{{ p.label }}</span>
          </label>
        </div>
      </details>

      <!-- Status -->
      <details class="sidebar-section" :open="!isMobile">
        <summary class="sidebar-section-title">
          <div class="summary-inner">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3"/>
            </svg>
            {{ t('calendar.sidebar.status') }}
          </div>
          <svg class="chevron" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
        </summary>
        <div class="details-content">
          <label
            v-for="s in statuses"
            :key="s.value"
            class="sidebar-filter-row"
          >
            <input
              type="checkbox"
              class="cal-checkbox"
              :checked="calendarStore.filters.statuses.includes(s.value)"
              @change="calendarStore.toggleStatusFilter(s.value)"
            />
            <span class="filter-label">{{ s.label }}</span>
          </label>
        </div>
      </details>

      <!-- Legend -->
      <details class="sidebar-section legend-section" :open="!isMobile">
        <summary class="sidebar-section-title">
          <div class="summary-inner">{{ t('calendar.sidebar.legend') }}</div>
          <svg class="chevron" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
        </summary>
        <div class="details-content">
          <div class="legend-row"><span class="legend-dot completed"></span>{{ t('calendar.sidebar.statuses.completed') }}</div>
          <div class="legend-row"><span class="legend-dot pending"></span>{{ t('calendar.sidebar.statuses.todo') }}</div>
          <div class="legend-row"><span class="legend-dot overdue"></span>{{ t('calendar.sidebar.overdue') }}</div>
          <div class="legend-row"><span class="legend-dot failed"></span>{{ t('calendar.sidebar.statuses.failed') }}</div>
          <div class="legend-row"><span class="legend-dot archived"></span>{{ t('calendar.sidebar.statuses.archived') }}</div>
        </div>
      </details>
      
      <!-- Clear Filters -->
      <button
        v-if="calendarStore.filters.categories.length || calendarStore.filters.priorities.length || calendarStore.filters.statuses.length"
        class="clear-filters-btn"
        @click="calendarStore.clearFilters()"
      >
        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        {{ t('calendar.sidebar.clear_filters') }}
      </button>
    </div>

  </aside>
</template>

<style scoped>
.cal-sidebar {
  width: 220px;
  min-width: 200px;
  flex-shrink: 0;
  background: var(--card-bg);
  border-right: 1px solid var(--border-light);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-bottom: 24px;
}

.sidebar-section {
  padding: 16px 16px 12px;
  border-bottom: 1px solid var(--border-light);
}

details.sidebar-section {
  padding: 12px 16px;
}

.sidebar-section:last-child {
  border-bottom: none;
}

.sidebar-section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--text-muted);
  margin: 0;
  cursor: pointer;
  list-style: none; /* Hide default arrow */
}

/* Hide default arrow in webkit */
.sidebar-section-title::-webkit-details-marker {
  display: none;
}

.summary-inner {
  display: flex;
  align-items: center;
  gap: 6px;
}

.chevron {
  transition: transform 0.2s ease;
}

details[open] .chevron {
  transform: rotate(180deg);
}

.details-content {
  margin-top: 12px;
  max-height: 135px;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.details-content::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.sidebar-filter-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 4px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.12s;
  margin-bottom: 2px;
}

.sidebar-filter-row:hover {
  background: var(--hover-bg);
}

.cal-checkbox {
  width: 15px;
  height: 15px;
  accent-color: var(--primary);
  cursor: pointer;
  flex-shrink: 0;
}

.cat-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.filter-label {
  font-size: 13px;
  color: var(--text-dark);
  font-weight: 500;
}

.sidebar-loading,
.sidebar-empty {
  font-size: 12px;
  color: var(--text-muted);
  padding: 4px;
}

.clear-filters-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 8px 16px;
  padding: 7px 12px;
  border-radius: 8px;
  border: 1px solid var(--danger-text);
  background: var(--danger-bg);
  color: var(--danger-text);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}

.clear-filters-btn:hover {
  opacity: 0.8;
}

.legend-section {
  margin-top: auto;
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-muted);
  padding: 3px 0;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.legend-dot.completed { background: #22C55E; }
.legend-dot.pending   { background: #3B82F6; }
.legend-dot.overdue   { background: #F97316; }
.legend-dot.failed    { background: #EF4444; }
.legend-dot.archived  { background: #6B7280; }

@media (max-width: 768px) {
  .cal-sidebar {
    width: 100%;
    min-width: unset;
    flex-shrink: 0;
    border-right: none;
    border-bottom: 1px solid var(--border-light);
    max-height: none;
    flex-direction: column;
    padding: 0;
    gap: 0;
  }
  
  .sidebar-filters-container {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    gap: 8px;
    padding: 12px 16px;
    background: var(--bg-main);
    border-top: 1px solid var(--border-light);
    -webkit-overflow-scrolling: touch;
  }

  .sidebar-section {
    padding: 16px;
    border-bottom: none;
  }

  details.sidebar-section {
    flex: 0 0 auto;
    min-width: 160px;
    background: var(--card-bg);
    border: 1px solid var(--border-light);
    border-radius: 10px;
    padding: 10px 14px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  }
  
  .details-content {
    margin-top: 10px;
  }

  .legend-section {
    margin-top: 0;
  }
  
  .clear-filters-btn {
    flex: 0 0 auto;
    margin: 0;
    align-self: flex-start;
    height: 38px;
  }
}

@media (max-width: 480px) {
  .sidebar-filters-container {
    padding: 10px 12px;
    gap: 6px;
  }
  details.sidebar-section {
    min-width: 140px;
    padding: 8px 12px;
  }
  .sidebar-section-title {
    font-size: 10px;
  }
  .filter-label {
    font-size: 12px;
  }
}
</style>
