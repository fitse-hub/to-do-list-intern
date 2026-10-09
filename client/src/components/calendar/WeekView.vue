<script setup>
import { computed } from 'vue'
import { useCalendarStore } from '@/stores/calendarStore'
import { useCalendar } from '@/composables/useCalendar'
import { useDragDrop } from '@/composables/useDragDrop'
import CalendarTask from './CalendarTask.vue'

const calendarStore = useCalendarStore()
const { buildWeekDays, isToday, isSameDay, toDateKey, MONTHS, DAYS_OF_WEEK, MONTHS_SHORT } = useCalendar()
const { onDragOver, onDragLeave, onDrop } = useDragDrop()

const weekDays = computed(() => buildWeekDays(calendarStore.currentDate))

function getTasksForDate(date) {
  const key = toDateKey(date)
  return calendarStore.tasksByDate[key] || []
}

function formatDayHeader(date) {
  return {
    num: date.getDate(),
    name: DAYS_OF_WEEK.value[date.getDay()],
    month: MONTHS_SHORT.value[date.getMonth()],
  }
}

function handleDblClick(date) {
  calendarStore.openNewTask(toDateKey(date))
}
</script>

<template>
  <div class="week-view">
    <!-- Column Headers -->
    <div class="week-header-row">
      <div class="week-time-gutter"></div>
      <div
        v-for="day in weekDays"
        :key="toDateKey(day)"
        :class="['week-day-header', { today: isToday(day) }]"
        @click="calendarStore.selectDate(new Date(day))"
      >
        <span class="week-day-name">{{ formatDayHeader(day).name }}</span>
        <span :class="['week-day-num', { 'today-badge': isToday(day) }]">
          {{ formatDayHeader(day).num }}
        </span>
        <span class="week-day-month">{{ formatDayHeader(day).month }}</span>
      </div>
    </div>

    <!-- Day Columns with Tasks -->
    <div class="week-body">
      <div class="week-time-gutter">
        <div v-for="h in 24" :key="h" class="week-hour-label">
          {{ String(h - 1).padStart(2, '0') }}:00
        </div>
      </div>

      <div
        v-for="day in weekDays"
        :key="toDateKey(day)"
        :class="['week-day-col', { today: isToday(day) }]"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @drop="onDrop($event, toDateKey(day))"
        @dblclick="handleDblClick(day)"
      >
        <!-- Hour grid lines -->
        <div v-for="h in 24" :key="h" class="week-hour-line"></div>

        <!-- Tasks stacked at the top of the column -->
        <div class="week-tasks-overlay">
          <CalendarTask
            v-for="task in getTasksForDate(day)"
            :key="task.id"
            :task="task"
          />
          <div v-if="getTasksForDate(day).length === 0" class="week-empty-col"
               @click.stop="calendarStore.selectDate(new Date(day))">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.week-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.week-header-row {
  display: flex;
  border-bottom: 1px solid var(--border-light);
  background: var(--bg-main);
  position: sticky;
  top: 0;
  z-index: 5;
}

.week-time-gutter {
  width: 56px;
  flex-shrink: 0;
  border-right: 1px solid var(--border-light);
}

.week-day-header {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 4px;
  border-right: 1px solid var(--border-light);
  cursor: pointer;
  transition: background 0.12s;
  gap: 2px;
}

.week-day-header:hover { background: var(--hover-bg); }
.week-day-header.today { background: rgba(59,130,246,0.06); }

.week-day-name {
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

.week-day-num {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-dark);
  line-height: 1;
}

.week-day-num.today-badge {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.week-day-month {
  font-size: 10px;
  color: var(--text-muted);
}

.week-body {
  flex: 1;
  display: flex;
  overflow-y: auto;
}

.week-time-gutter {
  width: 56px;
  flex-shrink: 0;
  border-right: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
}

.week-hour-label {
  height: 52px;
  padding: 4px 6px 0;
  font-size: 10px;
  font-weight: 600;
  color: var(--text-muted);
  flex-shrink: 0;
  text-align: right;
}

.week-day-col {
  flex: 1;
  border-right: 1px solid var(--border-light);
  position: relative;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  min-height: calc(52px * 24);
}

.week-day-col.today {
  background: rgba(59,130,246,0.03);
}

.week-day-col:global(.drag-over) {
  background: rgba(59,130,246,0.08) !important;
  outline: 2px dashed var(--primary);
  outline-offset: -2px;
}

.week-hour-line {
  height: 52px;
  border-bottom: 1px solid var(--border-light);
  flex-shrink: 0;
  opacity: 0.5;
}

.week-tasks-overlay {
  position: absolute;
  top: 8px;
  left: 4px;
  right: 4px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  pointer-events: all;
}

.week-empty-col {
  height: 100%;
  min-height: 52px;
}

@media (max-width: 768px) {
  .week-header-row {
    flex-wrap: nowrap;
    overflow-x: auto;
  }
  .week-time-gutter {
    width: 40px;
  }
  .week-hour-label {
    height: 44px;
    font-size: 9px;
    padding: 3px 4px 0;
  }
  .week-day-header {
    padding: 8px 2px;
    min-width: 42px;
  }
  .week-day-name {
    font-size: 9px;
  }
  .week-day-num {
    font-size: 16px;
  }
  .week-day-num.today-badge {
    width: 28px;
    height: 28px;
    font-size: 13px;
  }
  .week-day-month {
    font-size: 8px;
  }
  .week-day-col {
    min-width: 42px;
    min-height: calc(44px * 24);
  }
  .week-hour-line {
    height: 44px;
  }
  .week-tasks-overlay {
    left: 2px;
    right: 2px;
  }
}

@media (max-width: 480px) {
  .week-time-gutter {
    width: 32px;
  }
  .week-hour-label {
    height: 38px;
    font-size: 8px;
    padding: 2px 2px 0;
  }
  .week-day-header {
    padding: 6px 1px;
    min-width: 36px;
  }
  .week-day-name {
    font-size: 8px;
  }
  .week-day-num {
    font-size: 14px;
  }
  .week-day-num.today-badge {
    width: 24px;
    height: 24px;
    font-size: 11px;
  }
  .week-day-col {
    min-width: 36px;
    min-height: calc(38px * 24);
  }
  .week-hour-line {
    height: 38px;
  }
  .week-tasks-overlay {
    left: 1px;
    right: 1px;
    gap: 2px;
  }
}
</style>
