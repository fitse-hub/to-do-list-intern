/**
 * Task status color system for the calendar.
 * Provides consistent color classes based on task status.
 */
export function useCalendarFilters() {

  /**
   * Returns CSS classes and color info for a task pill based on its status.
   */
  function getTaskColor(task) {
    switch (task.status) {
      case 'completed':
        return {
          bg: 'var(--stat-green-bg)',
          text: 'var(--stat-green-text)',
          border: 'var(--stat-green-text)',
          dot: '#22C55E',
          label: 'Completed',
        }
      case 'failed':
        return {
          bg: 'var(--stat-red-bg)',
          text: 'var(--stat-red-text)',
          border: 'var(--stat-red-text)',
          dot: '#EF4444',
          label: 'Failed',
        }
      case 'archived':
        return {
          bg: 'rgba(107,114,128,0.12)',
          text: '#6B7280',
          border: '#6B7280',
          dot: '#6B7280',
          label: 'Archived',
        }
      default: {
        // Differentiate between overdue (pending past due date) and in-progress / pending
        const isOverdue = isTaskOverdue(task)
        if (isOverdue) {
          return {
            bg: 'var(--stat-orange-bg)',
            text: 'var(--stat-orange-text)',
            border: 'var(--stat-orange-text)',
            dot: '#F97316',
            label: 'Overdue',
          }
        }
        return {
          bg: 'var(--stat-blue-bg)',
          text: 'var(--stat-blue-text)',
          border: 'var(--stat-blue-text)',
          dot: '#3B82F6',
          label: 'Pending',
        }
      }
    }
  }

  /**
   * Is the task past its due date and not completed?
   */
  function isTaskOverdue(task) {
    if (task.status === 'completed') return false
    if (!task.due_date) return false
    const due = new Date(task.due_date)
    due.setHours(0, 0, 0, 0)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return due < today
  }

  /**
   * Priority color mapping.
   */
  function getPriorityColor(priority) {
    switch (priority) {
      case 'high': return { bg: 'var(--stat-red-bg)', text: 'var(--stat-red-text)' }
      case 'medium': return { bg: 'var(--stat-yellow-bg)', text: 'var(--stat-yellow-text)' }
      case 'low': return { bg: 'var(--stat-green-bg)', text: 'var(--stat-green-text)' }
      default: return { bg: 'var(--hover-bg)', text: 'var(--text-muted)' }
    }
  }

  return {
    getTaskColor,
    isTaskOverdue,
    getPriorityColor,
  }
}
