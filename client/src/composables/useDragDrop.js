import { useCalendarStore } from '@/stores/calendarStore'

/**
 * Drag-and-drop composable for calendar task rescheduling.
 * Uses the native HTML5 drag-and-drop API.
 */
export function useDragDrop() {
  const calendarStore = useCalendarStore()

  /** Called on the draggable task element */
  function onDragStart(event, task) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('taskId', String(task.id))
    event.dataTransfer.setData('fromDate', task.due_date?.slice(0, 10) || '')
    calendarStore.startDrag(task.id, task.due_date?.slice(0, 10) || '')

    // Add a subtle drag ghost opacity via class
    const el = event.currentTarget
    setTimeout(() => el?.classList.add('dragging'), 0)
  }

  /** Called when drag ends (regardless of drop success) */
  function onDragEnd(event) {
    const el = event.currentTarget
    el?.classList.remove('dragging')
    calendarStore.endDrag()
  }

  /** Called on a calendar day cell (drop target) */
  function onDragOver(event) {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    event.currentTarget?.classList.add('drag-over')
  }

  function onDragLeave(event) {
    event.currentTarget?.classList.remove('drag-over')
  }

  async function onDrop(event, toDateStr) {
    event.preventDefault()
    event.currentTarget?.classList.remove('drag-over')
    await calendarStore.dropTaskOnDate(toDateStr)
  }

  return {
    onDragStart,
    onDragEnd,
    onDragOver,
    onDragLeave,
    onDrop,
  }
}
