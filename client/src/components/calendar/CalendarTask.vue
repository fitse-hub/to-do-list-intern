<script setup>
import { useCalendarStore } from '@/stores/calendarStore'
import { useCalendarFilters } from '@/composables/useCalendarFilters'
import { useDragDrop } from '@/composables/useDragDrop'

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
  compact: {
    type: Boolean,
    default: false,
  },
})

const calendarStore = useCalendarStore()
const { getTaskColor } = useCalendarFilters()
const { onDragStart, onDragEnd } = useDragDrop()

const color = getTaskColor(props.task)
</script>

<template>
  <div
    class="cal-task-pill"
    :class="{ compact }"
    :style="{
      background: color.bg,
      color: color.text,
      borderLeft: `3px solid ${color.border}`,
    }"
    draggable="true"
    @dragstart="onDragStart($event, task)"
    @dragend="onDragEnd($event)"
    @click.stop="calendarStore.selectTask(task)"
    :title="task.title"
  >
    <span class="task-dot" :style="{ background: color.dot }"></span>
    <span class="task-pill-title">{{ task.title }}</span>
    <span v-if="task.priority && !compact" class="task-priority-badge" :style="{ opacity: 0.8 }">
      {{ task.priority[0].toUpperCase() }}
    </span>
  </div>
</template>

<style scoped>
.cal-task-pill {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 7px 3px 5px;
  border-radius: 5px;
  font-size: 11.5px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
}

.cal-task-pill:hover {
  transform: translateX(1px);
  filter: brightness(0.95);
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}

.cal-task-pill:global(.dragging) {
  opacity: 0.4;
  cursor: grabbing;
}

.task-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.task-pill-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 11.5px;
}

.task-priority-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 1px 4px;
  border-radius: 3px;
  background: rgba(0,0,0,0.08);
  flex-shrink: 0;
}

.cal-task-pill.compact {
  padding: 2px 5px;
  font-size: 11px;
}

@media (max-width: 768px) {
  .cal-task-pill {
    padding: 2px 5px 2px 4px;
    font-size: 10px;
    gap: 3px;
  }
  .task-dot {
    width: 5px;
    height: 5px;
  }
  .task-pill-title {
    font-size: 10px;
  }
  .task-priority-badge {
    display: none;
  }
}

@media (max-width: 480px) {
  .cal-task-pill {
    padding: 1px 3px 1px 3px;
    font-size: 9px;
    border-left-width: 2px !important;
    border-radius: 3px;
  }
  .task-dot {
    display: none;
  }
  .task-pill-title {
    font-size: 9px;
  }
}
</style>
