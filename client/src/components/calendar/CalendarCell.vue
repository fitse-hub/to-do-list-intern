<script setup>
import { ref, computed } from 'vue'
import { useCalendarStore } from '@/stores/calendarStore'
import { useCalendar } from '@/composables/useCalendar'
import { useDragDrop } from '@/composables/useDragDrop'
import CalendarTask from './CalendarTask.vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  date: { type: Date, required: true },
  tasks: { type: Array, default: () => [] },
  isCurrentMonth: { type: Boolean, default: true },
})

const calendarStore = useCalendarStore()
const { isToday, toDateKey } = useCalendar()
const { onDragOver, onDragLeave, onDrop } = useDragDrop()
const { t } = useI18n()

const MAX_VISIBLE = 3
const showAll = ref(false)

const dateKey = computed(() => toDateKey(props.date))
const visibleTasks = computed(() => showAll.value ? props.tasks : props.tasks.slice(0, MAX_VISIBLE))
const overflow = computed(() => Math.max(0, props.tasks.length - MAX_VISIBLE))

function handleClick() {
  calendarStore.selectDate(new Date(props.date))
}

function handleDblClick() {
  calendarStore.openNewTask(dateKey.value)
}
</script>

<template>
  <div
    class="cal-cell"
    :class="{
      'other-month': !isCurrentMonth,
      'today': isToday(date),
    }"
    @click="handleClick"
    @dblclick.stop="handleDblClick"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop($event, dateKey)"
  >
    <!-- Date Number -->
    <div class="cell-date-wrap">
      <span class="cell-date" :class="{ 'today-badge': isToday(date) }">
        {{ date.getDate() }}
      </span>
    </div>

    <!-- Task Pills -->
    <div class="cell-tasks" @click.stop>
      <CalendarTask
        v-for="task in visibleTasks"
        :key="task.id"
        :task="task"
        compact
      />

      <!-- Overflow badge -->
      <button
        v-if="overflow > 0 && !showAll"
        class="overflow-badge"
        @click.stop="showAll = true"
      >
        {{ t('calendar.common.more_tasks', { count: overflow }) }}
      </button>
      <button
        v-if="showAll && overflow > 0"
        class="overflow-badge collapse"
        @click.stop="showAll = false"
      >
        {{ t('calendar.common.show_less') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.cal-cell {
  min-height: 100px;
  padding: 6px 6px 4px;
  border-right: 1px solid var(--border-light);
  border-bottom: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  gap: 3px;
  cursor: pointer;
  transition: background 0.12s;
  position: relative;
}

.cal-cell:hover {
  background: var(--hover-bg);
}

.cal-cell.other-month {
  background: var(--bg-main);
  opacity: 0.6;
}

.cal-cell.today {
  background: rgba(59,130,246,0.04);
}

/* Drag over state */
.cal-cell:global(.drag-over) {
  background: rgba(59,130,246,0.08) !important;
  outline: 2px dashed var(--primary);
  outline-offset: -2px;
}

.cell-date-wrap {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 2px;
}

.cell-date {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--text-muted);
  line-height: 1;
}

.today-badge {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  animation: pulse-ring 2s ease-in-out infinite;
}

@keyframes pulse-ring {
  0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.4); }
  50% { box-shadow: 0 0 0 5px rgba(59,130,246,0); }
}

.cell-tasks {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.overflow-badge {
  font-size: 10.5px;
  font-weight: 600;
  color: var(--primary);
  background: rgba(59,130,246,0.08);
  border: none;
  border-radius: 4px;
  padding: 2px 6px;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: background 0.12s;
  margin-top: 1px;
}

.overflow-badge:hover {
  background: rgba(59,130,246,0.16);
}

.overflow-badge.collapse {
  color: var(--text-muted);
  background: var(--hover-bg);
}

@media (max-width: 768px) {
  .cal-cell {
    min-height: 60px;
    padding: 4px 3px 2px;
    gap: 2px;
  }
  .cell-date {
    font-size: 11px;
  }
  .today-badge {
    width: 20px;
    height: 20px;
    font-size: 10px;
  }
  .overflow-badge {
    font-size: 9px;
    padding: 1px 4px;
  }
}

@media (max-width: 480px) {
  .cal-cell {
    min-height: 46px;
    padding: 2px 2px 1px;
    gap: 1px;
  }
  .cell-date {
    font-size: 10px;
  }
  .today-badge {
    width: 18px;
    height: 18px;
    font-size: 9px;
  }
  .cell-tasks {
    gap: 1px;
  }
}
</style>
