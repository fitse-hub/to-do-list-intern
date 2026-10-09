import { defineStore } from 'pinia'
import { useTaskStore } from './taskStore'

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    activeView: 'month',          // 'day' | 'week' | 'month' | 'year'
    currentDate: new Date(),      // The anchor date for navigation
    selectedDate: null,           // Date clicked by the user (for drawer)
    selectedTask: null,           // Task clicked (for detail panel)
    isDrawerOpen: false,
    isDetailOpen: false,
    isNewTaskOpen: false,
    newTaskPrefilledDate: null,   // Date to pre-fill when creating from calendar
    searchQuery: '',
    filters: {
      categories: [],   // [] = all categories selected
      priorities: [],   // [] = all priorities
      statuses: [],     // [] = all statuses
    },
    dragging: {
      taskId: null,
      fromDate: null,
    },
  }),

  getters: {
    /**
     * Tasks filtered by the current sidebar filters + search query.
     * Returns tasks with a valid due_date only (needed to place on calendar).
     */
    filteredTasks(state) {
      const taskStore = useTaskStore()
      let tasks = taskStore.tasks

      // Filter: search
      if (state.searchQuery.trim()) {
        const q = state.searchQuery.toLowerCase()
        tasks = tasks.filter(t =>
          t.title?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.category?.name?.toLowerCase().includes(q)
        )
      }

      // Filter: categories
      if (state.filters.categories.length > 0) {
        tasks = tasks.filter(t =>
          state.filters.categories.includes(t.category?.id)
        )
      }

      // Filter: priorities
      if (state.filters.priorities.length > 0) {
        tasks = tasks.filter(t =>
          state.filters.priorities.includes(t.priority)
        )
      }

      // Filter: statuses
      if (state.filters.statuses.length > 0) {
        tasks = tasks.filter(t =>
          state.filters.statuses.includes(t.status)
        )
      }

      return tasks
    },

    /**
     * Map of date-string (YYYY-MM-DD) → tasks[]
     * Only tasks with a due_date are included.
     */
    tasksByDate(state) {
      const taskStore = useTaskStore()
      // Use filteredTasks getter
      const tasks = this.filteredTasks
      const map = {}
      for (const task of tasks) {
        if (!task.due_date) continue
        const dateKey = task.due_date.slice(0, 10)
        if (!map[dateKey]) map[dateKey] = []
        map[dateKey].push(task)
      }
      return map
    },
  },

  actions: {
    setView(view) {
      this.activeView = view
    },

    goToToday() {
      this.currentDate = new Date()
    },

    navigate(direction) {
      const d = new Date(this.currentDate)
      if (this.activeView === 'month') {
        d.setMonth(d.getMonth() + direction)
      } else if (this.activeView === 'week') {
        d.setDate(d.getDate() + direction * 7)
      } else if (this.activeView === 'day') {
        d.setDate(d.getDate() + direction)
      } else if (this.activeView === 'year') {
        d.setFullYear(d.getFullYear() + direction)
      }
      this.currentDate = d
    },

    selectDate(date) {
      this.selectedDate = date
      this.isDrawerOpen = true
      this.isDetailOpen = false
    },

    closeDrawer() {
      this.isDrawerOpen = false
      this.selectedDate = null
    },

    selectTask(task) {
      this.selectedTask = task
      this.isDetailOpen = true
    },

    closeDetail() {
      this.isDetailOpen = false
      this.selectedTask = null
    },

    openNewTask(date = null) {
      this.newTaskPrefilledDate = date
      this.isNewTaskOpen = true
    },

    closeNewTask() {
      this.isNewTaskOpen = false
      this.newTaskPrefilledDate = null
    },

    toggleCategoryFilter(categoryId) {
      const idx = this.filters.categories.indexOf(categoryId)
      if (idx === -1) {
        this.filters.categories.push(categoryId)
      } else {
        this.filters.categories.splice(idx, 1)
      }
    },

    togglePriorityFilter(priority) {
      const idx = this.filters.priorities.indexOf(priority)
      if (idx === -1) {
        this.filters.priorities.push(priority)
      } else {
        this.filters.priorities.splice(idx, 1)
      }
    },

    toggleStatusFilter(status) {
      const idx = this.filters.statuses.indexOf(status)
      if (idx === -1) {
        this.filters.statuses.push(status)
      } else {
        this.filters.statuses.splice(idx, 1)
      }
    },

    clearFilters() {
      this.filters = { categories: [], priorities: [], statuses: [] }
      this.searchQuery = ''
    },

    startDrag(taskId, fromDate) {
      this.dragging = { taskId, fromDate }
    },

    endDrag() {
      this.dragging = { taskId: null, fromDate: null }
    },

    async dropTaskOnDate(toDateStr) {
      if (!this.dragging.taskId) return
      const taskStore = useTaskStore()
      const task = taskStore.tasks.find(t => t.id === this.dragging.taskId)
      if (!task) { this.endDrag(); return }
      if (task.due_date?.slice(0, 10) === toDateStr) { this.endDrag(); return }

      // Optimistically update local state
      const originalDate = task.due_date
      task.due_date = toDateStr + 'T00:00:00.000Z'

      try {
        await taskStore.updateTask({ ...task, due_date: toDateStr })
      } catch {
        // Rollback on error
        task.due_date = originalDate
      } finally {
        this.endDrag()
      }
    },
  },
})
