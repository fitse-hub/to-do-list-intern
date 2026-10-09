<script setup>
import { computed } from 'vue'
import { useCalendarStore } from '@/stores/calendarStore'
import { useCalendar } from '@/composables/useCalendar'
import { useCalendarFilters } from '@/composables/useCalendarFilters'
import CalendarTask from './CalendarTask.vue'
import CalendarEmptyState from './CalendarEmptyState.vue'
import { useI18n } from 'vue-i18n'

const calendarStore = useCalendarStore()
const { buildDayHours, isToday, toDateKey, MONTHS, DAYS_OF_WEEK } = useCalendar()
const { getTaskColor } = useCalendarFilters()
const { t } = useI18n()

const hours = buildDayHours()

const dateKey = computed(() => toDateKey(calendarStore.currentDate))
const tasks = computed(() => calendarStore.tasksByDate[dateKey.value] || [])

const dayTitle = computed(() => {
  const d = calendarStore.currentDate
  const days = DAYS_OF_WEEK.value
  return `${days[d.getDay()]}, ${MONTHS.value[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
})

function handleDblClick() {
  calendarStore.openNewTask(dateKey.value)
}

function getHourForTask(task) {
  if (!task.start_date && !task.due_date) return -1
  const dateStr = task.start_date || task.due_date
  try {
    const d = new Date(dateStr.includes('T') ? dateStr : dateStr + 'T00:00:00Z')
    return d.getHours()
  } catch {
    return -1
  }
}

const untimedTasks = computed(() => tasks.value.filter(t => getHourForTask(t) < 0))
</script>

<template>
  <div class="day-view">
    <!-- Day Header -->
    <div class="day-view-header">
      <div class="day-header-title" :class="{ today: isToday(calendarStore.currentDate) }">
        <span class="day-header-num" :class="{ 'today-badge': isToday(calendarStore.currentDate) }">
          {{ calendarStore.currentDate.getDate() }}
        </span>
        <div class="day-header-info">
          <span class="day-header-dayname">{{ dayTitle }}</span>
          <span class="day-header-task-count">{{ tasks.length }} {{ tasks.length === 1 ? t('calendar.common.task_count', { count: '' }).trim() : t('calendar.common.tasks_count', { count: '' }).trim() }}</span>
        </div>
      </div>
      <button class="day-add-btn" @click="calendarStore.openNewTask(dateKey)">
        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        {{ t('calendar.common.add_task') }}
      </button>
    </div>

    <!-- Empty state -->
    <CalendarEmptyState v-if="tasks.length === 0" @create="calendarStore.openNewTask(dateKey)" />

    <!-- Hour Timeline -->
    <div v-else class="day-timeline" @dblclick="handleDblClick">
      <div v-for="hour in hours" :key="hour.hour" class="day-hour-row">
        <span class="day-hour-label">{{ hour.label }}</span>
        <div class="day-hour-content">
          <!-- Show tasks in this hour slot (matching by rough time or just stack them all) -->
          <template v-for="task in tasks" :key="task.id">
            <div
              v-if="getHourForTask(task) === hour.hour"
              class="day-task-block"
              :style="{ background: getTaskColor(task).bg, borderLeft: `4px solid ${getTaskColor(task).border}`, color: getTaskColor(task).text }"
              @click="calendarStore.selectTask(task)"
            >
              <div class="day-task-title">{{ task.title }}</div>
              <div class="day-task-meta">
                <span class="day-task-priority">{{ task.priority || t('calendar.detail.none') }}</span>
                <span v-if="task.category" class="day-task-cat">{{ task.category.name }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- All Tasks Panel (when tasks have no specific time) -->
    <div v-if="tasks.length > 0 && untimedTasks.length > 0" class="day-untimed-section">
      <h4 class="day-untimed-label">{{ t('calendar.common.all_day') }}</h4>
      <div class="day-untimed-tasks">
        <CalendarTask v-for="task in untimedTasks" :key="task.id" :task="task" />
      </div>
    </div>
  </div>
</template>


<style scoped>
.day-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.day-view-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-light);
  background: var(--bg-main);
}

.day-header-title {
  display: flex;
  align-items: center;
  gap: 14px;
}

.day-header-num {
  font-size: 36px;
  font-weight: 800;
  color: var(--text-dark);
  line-height: 1;
}

.day-header-num.today-badge {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 16px rgba(59,130,246,0.35);
}

.day-header-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.day-header-dayname {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-dark);
}

.day-header-task-count {
  font-size: 13px;
  color: var(--text-muted);
}

.day-add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: var(--primary);
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}

.day-add-btn:hover {
  background: #2563EB;
  transform: translateY(-1px);
}

.day-timeline {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.day-hour-row {
  display: flex;
  min-height: 60px;
  border-bottom: 1px solid var(--border-light);
}

.day-hour-label {
  width: 64px;
  padding: 8px 12px 0 0;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-align: right;
  flex-shrink: 0;
  border-right: 1px solid var(--border-light);
}

.day-hour-content {
  flex: 1;
  padding: 6px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.day-task-block {
  border-radius: 8px;
  padding: 10px 14px;
  cursor: pointer;
  transition: all 0.15s;
}

.day-task-block:hover {
  transform: translateX(2px);
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.day-task-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.day-task-meta {
  display: flex;
  gap: 8px;
  font-size: 12px;
  opacity: 0.8;
}

.day-task-priority {
  text-transform: capitalize;
  font-weight: 500;
}

.day-task-cat {
  font-weight: 500;
}

.day-untimed-section {
  border-top: 2px solid var(--border-light);
  padding: 16px 24px;
  background: var(--bg-main);
}

.day-untimed-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--text-muted);
  margin: 0 0 10px;
}

.day-untimed-tasks {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
