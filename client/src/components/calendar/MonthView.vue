<script setup>
import { computed } from 'vue'
import { useCalendarStore } from '@/stores/calendarStore'
import { useCalendar } from '@/composables/useCalendar'
import CalendarCell from './CalendarCell.vue'
import CalendarEmptyState from './CalendarEmptyState.vue'

const calendarStore = useCalendarStore()
const { buildMonthGrid, isSameMonth, toDateKey, DAYS_OF_WEEK } = useCalendar()

const grid = computed(() => buildMonthGrid(calendarStore.currentDate))

function getTasksForDate(date) {
  const key = toDateKey(date)
  return calendarStore.tasksByDate[key] || []
}
</script>

<template>
  <div class="month-view">
    <!-- Day of Week Headers -->
    <div class="month-dow-row">
      <div v-for="day in DAYS_OF_WEEK" :key="day" class="month-dow-cell">
        {{ day }}
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="month-grid">
      <CalendarCell
        v-for="(date, idx) in grid"
        :key="idx"
        :date="date"
        :tasks="getTasksForDate(date)"
        :is-current-month="isSameMonth(date, calendarStore.currentDate)"
      />
    </div>

    <!-- Empty state when no tasks at all in current month -->
    <CalendarEmptyState
      v-if="Object.keys(calendarStore.tasksByDate).length === 0"
    />
  </div>
</template>

<style scoped>
.month-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.month-dow-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: var(--bg-main);
  border-bottom: 1px solid var(--border-light);
}

.month-dow-cell {
  padding: 8px 8px;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-align: center;
}

.month-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, minmax(100px, 1fr));
  flex: 1;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .month-grid {
    grid-template-rows: repeat(6, minmax(60px, auto));
  }
  .month-dow-cell {
    padding: 6px 4px;
    font-size: 10px;
  }
}

@media (max-width: 480px) {
  .month-grid {
    grid-template-rows: repeat(6, minmax(50px, auto));
  }
  .month-dow-cell {
    padding: 4px 2px;
    font-size: 9px;
    letter-spacing: 0;
  }
}
</style>
