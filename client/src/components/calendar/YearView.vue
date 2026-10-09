<script setup>
import { computed } from 'vue'
import { useCalendarStore } from '@/stores/calendarStore'
import { useCalendar } from '@/composables/useCalendar'
import { useI18n } from 'vue-i18n'

const calendarStore = useCalendarStore()
const { buildYearMonths, buildMonthGrid, toDateKey, isToday, isSameMonth, DAYS_OF_WEEK } = useCalendar()
const { t } = useI18n()

const year = computed(() => calendarStore.currentDate.getFullYear())
const months = computed(() => buildYearMonths(year.value))

function getTaskCountForDate(date) {
  const key = toDateKey(date)
  return (calendarStore.tasksByDate[key] || []).length
}

function getMonthTaskCount(monthObj) {
  let count = 0
  for (let d = 1; d <= monthObj.lastDay.getDate(); d++) {
    const date = new Date(year.value, monthObj.month, d)
    count += getTaskCountForDate(date)
  }
  return count
}

function getHeatmapIntensity(count) {
  if (count === 0) return 0
  if (count === 1) return 1
  if (count <= 3) return 2
  if (count <= 6) return 3
  return 4
}

function navigateToMonth(monthObj) {
  const d = new Date(year.value, monthObj.month, 1)
  calendarStore.currentDate = d
  calendarStore.setView('month')
}

const daysShort = computed(() => DAYS_OF_WEEK.value.map(d => d[0]))
</script>

<template>
  <div class="year-view">
    <div class="year-grid">
      <div
        v-for="monthObj in months"
        :key="monthObj.month"
        class="year-month-card"
        @click="navigateToMonth(monthObj)"
      >
        <div class="year-month-header">
          <span class="year-month-name">{{ monthObj.shortName }}</span>
          <span class="year-month-count" v-if="getMonthTaskCount(monthObj) > 0">
            {{ getMonthTaskCount(monthObj) }} {{ getMonthTaskCount(monthObj) === 1 ? t('calendar.common.task_count', { count: '' }).trim() : t('calendar.common.tasks_count', { count: '' }).trim() }}
          </span>
        </div>

        <!-- Mini heatmap grid -->
        <div class="year-mini-grid">
          <!-- Day of week headers -->
          <span v-for="d in daysShort" :key="d" class="year-mini-dow">{{ d }}</span>
          <!-- Day cells -->
          <div
            v-for="(date, idx) in monthObj.grid"
            :key="idx"
            :class="[
              'year-day-cell',
              `heat-${getHeatmapIntensity(isSameMonth(date, monthObj.firstDay) ? getTaskCountForDate(date) : 0)}`,
              { 'today': isToday(date) && isSameMonth(date, monthObj.firstDay) },
              { 'other-month': !isSameMonth(date, monthObj.firstDay) },
            ]"
            :title="isSameMonth(date, monthObj.firstDay) ? `${date.getDate()}: ${getTaskCountForDate(date)} task(s)` : ''"
          ></div>
        </div>
      </div>
    </div>

    <!-- Heatmap Legend -->
    <div class="year-legend">
      <span class="legend-label">{{ t('reports.insights.less') }}</span>
      <div class="heat-0 legend-swatch"></div>
      <div class="heat-1 legend-swatch"></div>
      <div class="heat-2 legend-swatch"></div>
      <div class="heat-3 legend-swatch"></div>
      <div class="heat-4 legend-swatch"></div>
      <span class="legend-label">{{ t('reports.insights.more') }}</span>
    </div>
  </div>
</template>

<style scoped>
.year-view {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.year-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.year-month-card {
  background: var(--card-bg);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 14px 12px;
  cursor: pointer;
  transition: all 0.18s;
}

.year-month-card:hover {
  border-color: var(--primary);
  box-shadow: 0 4px 16px rgba(59,130,246,0.12);
  transform: translateY(-2px);
}

.year-month-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.year-month-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-dark);
}

.year-month-count {
  font-size: 10.5px;
  font-weight: 600;
  color: var(--primary);
  background: rgba(59,130,246,0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.year-mini-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.year-mini-dow {
  font-size: 8px;
  font-weight: 600;
  color: var(--text-muted);
  text-align: center;
  padding-bottom: 3px;
}

.year-day-cell {
  aspect-ratio: 1;
  border-radius: 2px;
  transition: transform 0.1s;
}

.year-day-cell:hover {
  transform: scale(1.3);
}

.year-day-cell.other-month {
  opacity: 0;
}

.year-day-cell.today {
  border-radius: 50%;
  outline: 2px solid var(--primary);
  outline-offset: 1px;
}

/* Heatmap colors */
.heat-0 { background: var(--hover-bg); }
.heat-1 { background: rgba(59,130,246,0.2); }
.heat-2 { background: rgba(59,130,246,0.4); }
.heat-3 { background: rgba(59,130,246,0.65); }
.heat-4 { background: rgba(59,130,246,0.9); }

.year-legend {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: flex-end;
}

.legend-label {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
}

.legend-swatch {
  width: 14px;
  height: 14px;
  border-radius: 3px;
}

@media (max-width: 900px) {
  .year-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 600px) {
  .year-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
