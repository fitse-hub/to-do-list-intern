<script setup>
import { computed } from 'vue'
import { useCalendarStore } from '@/stores/calendarStore'
import { useCalendar } from '@/composables/useCalendar'
import { useCalendarFilters } from '@/composables/useCalendarFilters'
import { useI18n } from 'vue-i18n'
import CalendarTask from './CalendarTask.vue'

const calendarStore = useCalendarStore()
const { toDateKey, MONTHS, DAYS_OF_WEEK } = useCalendar()
const { getTaskColor, getPriorityColor } = useCalendarFilters()
const { t } = useI18n()

const selectedDate = computed(() => calendarStore.selectedDate)
const dateKey = computed(() => selectedDate.value ? toDateKey(selectedDate.value) : null)

const tasks = computed(() => {
  if (!dateKey.value) return []
  return calendarStore.tasksByDate[dateKey.value] || []
})

const dateLabel = computed(() => {
  if (!selectedDate.value) return ''
  const d = selectedDate.value
  const days = DAYS_OF_WEEK.value
  return `${days[d.getDay()]}, ${MONTHS.value[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
})

function close() {
  calendarStore.closeDrawer()
}

function addTask() {
  calendarStore.openNewTask(dateKey.value)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="calendarStore.isDrawerOpen" class="drawer-backdrop" @click.self="close">
        <aside class="task-drawer">
          <!-- Drawer Header -->
          <div class="drawer-header">
            <div class="drawer-header-info">
              <div class="drawer-date-badge">
                <span class="drawer-date-num">{{ selectedDate?.getDate() }}</span>
                <span class="drawer-date-month">{{ selectedDate ? MONTHS[selectedDate.getMonth()].slice(0,3) : '' }}</span>
              </div>
              <div>
                <h3 class="drawer-title">{{ dateLabel }}</h3>
                <p class="drawer-subtitle">{{ tasks.length }} {{ tasks.length === 1 ? t('calendar.drawer.task_scheduled') : t('calendar.drawer.tasks_scheduled') }}</p>
              </div>
            </div>
            <button class="drawer-close" @click="close">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Task List -->
          <div class="drawer-body">
            <div v-if="tasks.length === 0" class="drawer-empty">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <p>{{ t('calendar.drawer.no_tasks') }}</p>
            </div>

            <div
              v-for="task in tasks"
              :key="task.id"
              class="drawer-task-row"
              :style="{ borderLeft: `4px solid ${getTaskColor(task).border}` }"
              @click="calendarStore.selectTask(task)"
            >
              <div class="drawer-task-indicator" :style="{ background: getTaskColor(task).dot }"></div>
              <div class="drawer-task-body">
                <span class="drawer-task-title">{{ task.title }}</span>
                <div class="drawer-task-meta">
                  <span
                    class="drawer-task-priority"
                    :style="{
                      background: getPriorityColor(task.priority).bg,
                      color: getPriorityColor(task.priority).text
                    }"
                    v-if="task.priority"
                  >
                    {{ task.priority }}
                  </span>
                  <span class="drawer-task-cat" v-if="task.category">{{ task.category.name }}</span>
                  <span class="drawer-task-status">{{ getTaskColor(task).label }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Add Task Button -->
          <div class="drawer-footer">
            <button class="drawer-add-btn" @click="addTask">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
              </svg>
              {{ t('calendar.drawer.add_task') }}
            </button>
          </div>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0,0,0,0.18);
  backdrop-filter: blur(1px);
  display: flex;
  justify-content: flex-end;
}

.task-drawer {
  width: 360px;
  max-width: 100vw;
  height: 100%;
  background: var(--card-bg);
  border-left: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 32px rgba(0,0,0,0.12);
  overflow: hidden;
}

/* Transition */
.drawer-enter-active { transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1); }
.drawer-leave-active { transition: transform 0.22s ease-in; }
.drawer-enter-from, .drawer-leave-to { transform: translateX(100%); }

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 16px;
  border-bottom: 1px solid var(--border-light);
  background: var(--bg-main);
}

.drawer-header-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.drawer-date-badge {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: var(--primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 14px rgba(59,130,246,0.3);
}

.drawer-date-num {
  font-size: 22px;
  font-weight: 800;
  color: white;
  line-height: 1;
}

.drawer-date-month {
  font-size: 10px;
  font-weight: 700;
  color: rgba(255,255,255,0.8);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.drawer-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0;
}

.drawer-subtitle {
  font-size: 12px;
  color: var(--text-muted);
  margin: 3px 0 0;
}

.drawer-close {
  width: 32px;
  height: 32px;
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

.drawer-close:hover {
  color: var(--danger-text);
  border-color: var(--danger-text);
  background: var(--danger-bg);
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 0;
}

.drawer-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  gap: 12px;
  color: var(--text-muted);
  text-align: center;
}

.drawer-empty p {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}

.drawer-task-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px 12px 12px;
  margin: 0 12px 4px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.14s;
  background: var(--bg-main);
}

.drawer-task-row:hover {
  box-shadow: 0 2px 10px rgba(0,0,0,0.07);
  transform: translateX(2px);
}

.drawer-task-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.drawer-task-body {
  flex: 1;
  min-width: 0;
}

.drawer-task-title {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.drawer-task-meta {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
}

.drawer-task-priority {
  font-size: 10.5px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
  text-transform: capitalize;
}

.drawer-task-cat {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
}

.drawer-task-status {
  font-size: 11px;
  color: var(--text-muted);
}

.drawer-footer {
  padding: 16px;
  border-top: 1px solid var(--border-light);
}

.drawer-add-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border-radius: 10px;
  border: 2px dashed var(--primary);
  background: rgba(59,130,246,0.05);
  color: var(--primary);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}

.drawer-add-btn:hover {
  background: rgba(59,130,246,0.1);
  border-style: solid;
}
</style>
