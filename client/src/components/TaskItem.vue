<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useI18n } from 'vue-i18n'
import DeleteConfirmation from './DeleteConfirmation.vue'

const { t } = useI18n()
const store = useTaskStore()
const categoryStore = useCategoryStore()
const emit = defineEmits(['edit-task'])
const showMenu = ref(false)
const showDeleteConfirm = ref(false)
const menuButton = ref(null)
const dropdownPosition = ref('bottom') // 'bottom' or 'top'

const props = defineProps({
  task: Object,
  layout: {
    type: String,
    default: 'list'
  }
})

onMounted(() => {
  // Load categories if not already loaded
  if (categoryStore.categories.length === 0) {
    categoryStore.fetchCategories()
  }
})

const parseBackendDate = (dateStr) => {
  if (!dateStr) return null;
  let safeStr = dateStr;
  if (!safeStr.includes('T')) {
    safeStr = safeStr.replace(' ', 'T');
  }
  if (!safeStr.endsWith('Z') && !safeStr.includes('+') && !safeStr.match(/-\d{2}:\d{2}$/)) {
    safeStr += 'Z';
  }
  return new Date(safeStr);
}

// Format date in international format
const formatDate = (dateString) => {
  if (!dateString) return '—'

  const date = parseBackendDate(dateString)
  const isCurrentYear = date.getFullYear() === new Date().getFullYear()
  
  return date.toLocaleDateString(undefined, {
    year: isCurrentYear ? undefined : 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const isOverdue = (dateString) => {
  if (props.task.status === 'completed' || !dateString) return false;
  const due = parseBackendDate(dateString);
  due.setHours(0,0,0,0);
  const today = new Date();
  today.setHours(0,0,0,0);
  return due < today;
}

// Check if date is today
const isToday = (dateString) => {
  if (!dateString) return false
  const today = new Date()
  const date = parseBackendDate(dateString)
  return date.toDateString() === today.toDateString()
}

// Check if date is tomorrow
const isTomorrow = (dateString) => {
  if (!dateString) return false
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const date = parseBackendDate(dateString)
  return date.toDateString() === tomorrow.toDateString()
}

// Get relative date text
const getRelativeDate = computed(() => {
  if (!props.task.due_date) return null

  if (isToday(props.task.due_date)) return t('tasks.item.today')
  if (isTomorrow(props.task.due_date)) return t('tasks.item.tomorrow')

  return null
})

const categoryColors = {
  General:  { bg: 'var(--stat-blue-bg)', color: 'var(--stat-blue-text)' },
  Work:     { bg: 'var(--stat-yellow-bg)', color: 'var(--stat-yellow-text)' },
  Personal: { bg: 'var(--stat-green-bg)', color: 'var(--stat-green-text)' },
  Urgent:   { bg: 'var(--stat-red-bg)', color: 'var(--stat-red-text)' },
}

const getCategoryStyle = (cat) => {
  const c = categoryColors[cat] || categoryColors['General'] // All custom categories will use General's colors for now
  return `background-color: ${c.bg}; color: ${c.color};`
}

// Format time
const formatTime = (dateString) => {
  if (!dateString) return null
  const date = parseBackendDate(dateString)
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit'
  })
}

// Priority config
const priorityConfig = {
  low:    { label: 'Low',    bg: 'var(--stat-green-bg)', color: 'var(--stat-green-text)' },
  medium: { label: 'Medium', bg: 'var(--stat-yellow-bg)', color: 'var(--stat-yellow-text)' },
  high:   { label: 'High',   bg: 'var(--stat-red-bg)', color: 'var(--stat-red-text)' },
}

const getPriorityStyle = (priority) => {
  const p = priorityConfig[priority]
  if (!p) return ''
  return `background-color: ${p.bg}; color: ${p.color};`
}

const getPriorityLabel = (priority) => {
  if (!priority) return priority;
  const p = priority.toLowerCase();
  if (p === 'low') return t('tasks.priority.low')
  if (p === 'medium') return t('tasks.priority.medium')
  if (p === 'high') return t('tasks.priority.high')
  return priority
}

const confirmDelete = () => {
  showMenu.value = false
  showDeleteConfirm.value = true
}

const toggleMenu = (event) => {
  if (!showMenu.value) {
    // Calculate if dropdown would go off-screen
    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const dropdownHeight = 100 // Approximate height of dropdown menu
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top

    // Position dropdown above if not enough space below
    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      dropdownPosition.value = 'top'
    } else {
      dropdownPosition.value = 'bottom'
    }
  }
  showMenu.value = !showMenu.value
}

const executeDelete = async () => {
  showDeleteConfirm.value = false
  await store.deleteTask(props.task.id)
}

const startEditing = () => {
  showMenu.value = false
  emit('edit-task', props.task)
}

const toggleTask = async () => {
  await store.toggleTask(props.task.id)
}
</script>

<template>
  <div class="task-item-row" :class="{ 'is-completed': task.completed, 'is-grid': layout === 'grid' }">
    <div class="task-main-info">
      <div class="checkbox-wrapper" @click="toggleTask">
        <div class="custom-checkbox" :class="{ 'checked': task.completed }">
          <svg v-if="task.completed" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="14"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
        </div>
      </div>
      
      <span class="task-title" :class="{ 'completed-text': task.completed }" :title="task.title">
        {{ task.title }}
      </span>
      
      <div class="task-meta">
        <span class="meta-tag category-tag">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="12"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
          {{ task.category?.name || 'General' }}
        </span>
        
        <div class="date-range-badge" v-if="task.start_date || task.due_date">
          <div class="date-item start-date-item" v-if="task.start_date">
             <span class="date-label">{{ t('tasks.item.start') }}</span>
             <span class="date-value">
               {{ formatDate(task.start_date) }}
               <span class="time-text">{{ formatTime(task.start_date) }}</span>
             </span>
          </div>
          
          <div class="date-separator" v-if="task.start_date && task.due_date">
             <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="12"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </div>

          <div class="date-item due-date-item" v-if="task.due_date" :class="{ 'is-overdue': isOverdue(task.due_date) }">
             <span class="date-label">{{ t('tasks.item.due') }}</span>
             <span class="date-value">
               {{ getRelativeDate || formatDate(task.due_date) }}
               <span class="time-text">{{ formatTime(task.due_date) }}</span>
             </span>
          </div>
        </div>
      </div>
    </div>

    <div class="task-actions-area">
      <span v-if="task.priority" class="priority-badge" :class="'priority-' + task.priority">
        {{ getPriorityLabel(task.priority) }}
      </span>

      <div class="actions-wrapper">
        <button @click.stop="toggleMenu" ref="menuButton" class="action-menu-btn" :title="t('tasks.item.actions')">
          <svg fill="currentColor" viewBox="0 0 20 20" width="20" height="20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
          </svg>
        </button>

        <div v-if="showMenu" @click.stop="showMenu = false" class="menu-overlay"></div>

        <div v-if="showMenu" class="dropdown-menu" :class="{ 'dropdown-menu-top': dropdownPosition === 'top' }">
          <button @click.stop="startEditing" class="dropdown-item">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="14" style="margin-right: 6px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            {{ t('tasks.item.edit') }}
          </button>
          <button @click.stop="confirmDelete" class="dropdown-item delete-item">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="14" style="margin-right: 6px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            {{ t('tasks.item.delete') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmation 
      :show="showDeleteConfirm" 
      @cancel="showDeleteConfirm = false" 
      @confirm="executeDelete" 
    />
  </div>
</template>

<style scoped>
.task-item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-light);
  gap: 16px;
  position: relative;
}

/* Grid Layout Overrides */
.task-item-row.is-grid {
  flex-direction: column;
  align-items: flex-start;
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 16px;
  background: var(--card-bg);
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.task-item-row.is-grid .task-main-info {
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.task-item-row.is-grid .task-title {
  white-space: normal;
  max-width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.task-item-row.is-grid .task-meta {
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding-left: 28px;
}

.task-item-row.is-grid .checkbox-wrapper {
  position: absolute;
  top: 16px;
  left: 16px;
}

.task-item-row.is-grid .task-title {
  padding-left: 32px; /* space for checkbox */
}

.task-item-row.is-grid .task-actions-area {
  width: 100%;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border-light);
}

.task-item-row:last-child {
  border-bottom: none;
}

.task-main-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 4px;
}

.custom-checkbox {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.2s;
  background-color: transparent;
}

.custom-checkbox.checked {
  background-color: var(--success-text);
  border-color: var(--success-text);
}

.task-title {
  font-weight: 600;
  color: var(--text-dark);
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

.completed-text {
  color: var(--text-muted);
  text-decoration: line-through;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.meta-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
}

.category-tag svg {
  color: var(--primary); /* Blue folder icon */
}

/* Date Range Badge UI */
.date-range-badge {
  display: inline-flex;
  align-items: stretch;
  background-color: var(--card-bg);
  border: 1px solid var(--border-light);
  border-radius: 6px;
  overflow: hidden;
  font-size: 11px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
}

.date-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
}

.date-label {
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  font-size: 9px;
  letter-spacing: 0.5px;
}

.date-value {
  font-weight: 600;
  color: var(--text-muted);
}

.date-separator {
  color: var(--text-muted);
  display: flex;
  align-items: center;
  padding: 0 4px;
  background-color: var(--hover-bg);
  border-left: 1px solid var(--border-light);
  border-right: 1px solid var(--border-light);
}

.time-text {
  color: var(--text-muted);
  margin-left: 2px;
  font-weight: 500;
  font-size: 10px;
}

.due-date-item.is-overdue {
  background-color: var(--danger-bg);
}
.due-date-item.is-overdue .date-label {
  color: var(--danger-text);
}
.due-date-item.is-overdue .date-value {
  color: var(--danger-text);
}
.due-date-item.is-overdue .time-text {
  color: var(--danger-text);
}

.start-date-item {
  background-color: var(--hover-bg);
}

.task-actions-area {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.priority-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.priority-high { background-color: var(--stat-red-bg); color: var(--danger-text); }
.priority-medium { background-color: var(--stat-orange-bg); color: var(--stat-orange-text); }
.priority-low { background-color: var(--stat-green-bg); color: var(--stat-green-text); }

.actions-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-menu-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-menu-btn:hover {
  background-color: var(--hover-bg);
  color: var(--text-dark);
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  background: var(--card-bg);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  min-width: 150px;
  padding: 4px;
  z-index: 50;
  display: flex;
  flex-direction: column;
}

.dropdown-menu-top {
  top: auto;
  bottom: calc(100% + 4px);
}

.dropdown-item {
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s;
  text-align: left;
}

.dropdown-item:hover {
  background-color: var(--hover-bg);
}

.delete-item {
  color: var(--danger-text);
}

.delete-item:hover {
  background-color: var(--danger-bg);
}

@media (max-width: 768px) {
  .task-main-info {
    flex-wrap: wrap;
    gap: 8px;
  }
  .task-title {
    max-width: 100%;
    flex: 1 1 100%;
    font-size: 14px;
  }
  .task-meta {
    padding-left: 28px; /* Align with text, offset checkbox */
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 8px;
  }
  .task-actions-area {
    position: absolute;
    top: 12px;
    right: 0;
  }

  /* Date badge improvements for mobile */
  .date-range-badge {
    flex-wrap: wrap;
    font-size: 10px;
  }

  .date-item {
    padding: 3px 6px;
  }

  /* Grid card mobile refinements */
  .task-item-row.is-grid {
    padding: 14px;
  }

  .task-item-row.is-grid .task-meta {
    padding-left: 0;
  }

  .task-item-row.is-grid .task-title {
    padding-left: 28px;
    font-size: 14px;
  }

  .task-item-row.is-grid .task-actions-area {
    position: relative;
    top: auto;
    right: auto;
  }
}
</style>
