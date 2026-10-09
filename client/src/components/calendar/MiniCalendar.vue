<script setup>
import { ref, computed } from 'vue'
import { useCalendarStore } from '@/stores/calendarStore'
import { useCalendar } from '@/composables/useCalendar'

const calendarStore = useCalendarStore()
const { buildMonthGrid, isToday, isSameDay, isSameMonth, toDateKey, DAYS_OF_WEEK, MONTHS } = useCalendar()

// Mini calendar has its own navigation state
const miniDate = ref(new Date())

const year = computed(() => miniDate.value.getFullYear())
const month = computed(() => MONTHS.value[miniDate.value.getMonth()])

const grid = computed(() => buildMonthGrid(miniDate.value))

function prevMonth() {
  const d = new Date(miniDate.value)
  d.setMonth(d.getMonth() - 1)
  miniDate.value = d
}

function nextMonth() {
  const d = new Date(miniDate.value)
  d.setMonth(d.getMonth() + 1)
  miniDate.value = d
}

function selectDay(date) {
  // Update the main calendar's current date and open drawer
  calendarStore.currentDate = new Date(date)
  calendarStore.selectDate(new Date(date))
}

function isSelected(date) {
  if (!calendarStore.selectedDate) return false
  return isSameDay(date, calendarStore.selectedDate)
}

const daysShort = computed(() => DAYS_OF_WEEK.value.map(d => d[0]))
</script>

<template>
  <div class="mini-cal">
    <div class="mini-cal-header">
      <button class="mini-nav" @click="prevMonth">‹</button>
      <span class="mini-month-label">{{ month }} {{ year }}</span>
      <button class="mini-nav" @click="nextMonth">›</button>
    </div>

    <div class="mini-cal-grid">
      <span v-for="(d, idx) in daysShort" :key="idx" class="mini-dow">{{ d }}</span>
      <button
        v-for="(date, idx) in grid"
        :key="idx"
        :class="[
          'mini-day',
          { 'other-month': !isSameMonth(date, miniDate) },
          { 'today': isToday(date) },
          { 'selected': isSelected(date) },
        ]"
        @click="selectDay(date)"
      >
        {{ date.getDate() }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.mini-cal {
  user-select: none;
}

.mini-cal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.mini-month-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-dark);
}

.mini-nav {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 18px;
  cursor: pointer;
  line-height: 1;
  padding: 0 4px;
  transition: color 0.12s;
}

.mini-nav:hover { color: var(--primary); }

.mini-cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.mini-dow {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-muted);
  text-align: center;
  padding: 2px 0 4px;
}

.mini-day {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  background: transparent;
  font-size: 11px;
  color: var(--text-dark);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.12s;
  font-family: inherit;
  margin: 0 auto;
}

.mini-day:hover {
  background: var(--hover-bg);
}

.mini-day.other-month {
  color: var(--text-muted);
  opacity: 0.4;
}

.mini-day.today {
  background: var(--primary);
  color: white;
  font-weight: 700;
}

.mini-day.selected:not(.today) {
  background: rgba(59,130,246,0.15);
  color: var(--primary);
  font-weight: 700;
}
</style>
