<script setup>
import { onMounted, onUnmounted, computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { useCalendarStore } from '@/stores/calendarStore'
import { useI18n } from 'vue-i18n'
import NewTaskModal from '@/components/NewTaskModal.vue'

import CalendarHeader from '@/components/calendar/CalendarHeader.vue'
import CalendarSidebar from '@/components/calendar/CalendarSidebar.vue'
import MonthView from '@/components/calendar/MonthView.vue'
import WeekView from '@/components/calendar/WeekView.vue'
import DayView from '@/components/calendar/DayView.vue'
import YearView from '@/components/calendar/YearView.vue'
import TaskDrawer from '@/components/calendar/TaskDrawer.vue'
import TaskDetailPanel from '@/components/calendar/TaskDetailPanel.vue'
import CalendarLoading from '@/components/calendar/CalendarLoading.vue'

const taskStore = useTaskStore()
const calendarStore = useCalendarStore()
const { t } = useI18n()

// Pre-fill the date when opening the new task modal
const newTaskPrefilledDate = computed(() => {
  if (!calendarStore.newTaskPrefilledDate) return ''
  // Format as datetime-local: YYYY-MM-DDTHH:MM
  return calendarStore.newTaskPrefilledDate + 'T00:00'
})

onMounted(async () => {
  if (!taskStore.hasFetched) {
    await taskStore.fetchTasks()
  }
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

async function handleRefresh() {
  await taskStore.fetchTasks()
}

function handleKeydown(e) {
  // Skip if user is typing in an input
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName)) return

  if (e.key === 'ArrowLeft') calendarStore.navigate(-1)
  else if (e.key === 'ArrowRight') calendarStore.navigate(1)
  else if (e.key === 't' || e.key === 'T') calendarStore.goToToday()
  else if (e.key === 'n' || e.key === 'N') calendarStore.openNewTask()
  else if (e.key === 'Escape') {
    calendarStore.closeDrawer()
    calendarStore.closeDetail()
    calendarStore.closeNewTask()
  }
}

// Wrap new-task modal close
function handleModalClose() {
  calendarStore.closeNewTask()
  // Refresh tasks after creation
  taskStore.fetchTasks()
}
</script>

<template>
  <div class="calendar-page">
    <!-- Main Calendar Header (navigation, view switcher, search, etc.) -->
    <CalendarHeader @refresh="handleRefresh" />

    <!-- Body: Sidebar + Main View -->
    <div class="calendar-body">
      <!-- Left Sidebar: Mini calendar + Filters -->
      <CalendarSidebar />

      <!-- Main Calendar Area -->
      <main class="calendar-main">
        <!-- Loading skeleton -->
        <CalendarLoading v-if="taskStore.initialLoading" />

        <!-- Views (animated transition) -->
        <Transition name="view-switch" mode="out-in">
          <MonthView v-if="calendarStore.activeView === 'month'" />
          <WeekView v-else-if="calendarStore.activeView === 'week'" />
          <DayView  v-else-if="calendarStore.activeView === 'day'" />
          <YearView v-else-if="calendarStore.activeView === 'year'" />
        </Transition>
      </main>
    </div>

    <!-- Overlays (teleported to body) -->
    <TaskDrawer />
    <TaskDetailPanel />

    <!-- New Task Modal (reusing existing modal with date pre-fill) -->
    <NewTaskModal
      :is-open="calendarStore.isNewTaskOpen"
      :task-to-edit="null"
      :prefilled-date="newTaskPrefilledDate"
      @close="handleModalClose"
    />

    <!-- Keyboard Shortcuts Hint -->
    <div class="kb-hint">
      <kbd>←</kbd><kbd>→</kbd> {{ t('calendar.shortcuts.navigate') }} &nbsp;·&nbsp;
      <kbd>T</kbd> {{ t('calendar.shortcuts.today') }} &nbsp;·&nbsp;
      <kbd>N</kbd> {{ t('calendar.shortcuts.new_task') }} &nbsp;·&nbsp;
      <kbd>Esc</kbd> {{ t('calendar.shortcuts.close') }}
    </div>
  </div>
</template>

<style scoped>
.calendar-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  position: relative;
}

.calendar-body {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.calendar-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

/* View transition */
.view-switch-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.view-switch-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.view-switch-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.view-switch-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Keyboard shortcut hint */
.kb-hint {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  color: var(--text-muted);
  background: var(--card-bg);
  border: 1px solid var(--border-light);
  padding: 5px 14px;
  border-radius: 20px;
  white-space: nowrap;
  z-index: 5;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  pointer-events: none;
}

kbd {
  display: inline-block;
  background: var(--hover-bg);
  border: 1px solid var(--border-light);
  border-radius: 4px;
  padding: 1px 5px;
  font-size: 10px;
  font-family: inherit;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0 2px;
}

@media (max-width: 768px) {
  .calendar-body {
    flex-direction: column;
  }

  .kb-hint {
    display: none;
  }
}
</style>
