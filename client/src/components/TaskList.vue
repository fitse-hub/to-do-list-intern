<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import TaskItem from './TaskItem.vue'
import SkeletonLoader from './common/SkeletonLoader.vue'

const { t } = useI18n()
const router = useRouter()
const store = useTaskStore()
const categoryStore = useCategoryStore()

function goToCalendar() {
  router.push('/calendar')
}

const searchQuery = ref('')
const filterStatus = ref('All Statuses')
const filterCategory = ref('All Categories')
const filterPriority = ref('All Priorities')
const filterDate = ref('All Time')
const sortBy = ref('Due Date')
const sortDesc = ref(false)
const showDropdowns = ref(false)
const showCustomize = ref(false)
const viewLayout = ref('list') // 'list' or 'grid'

const resetFilters = () => {
  searchQuery.value = ''
  filterStatus.value = 'All Statuses'
  filterCategory.value = 'All Categories'
  filterPriority.value = 'All Priorities'
  filterDate.value = 'All Time'
  sortBy.value = 'Due Date'
  sortDesc.value = false
}

onMounted(() => {
  store.fetchTasks()
  categoryStore.fetchCategories()
})

// --- Utility: parse a backend UTC date string into a proper local Date ---
const parseBackendDateToDate = (dateStr) => {
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

// Expanded state for groups
const expandedGroups = ref({})

const toggleGroup = (group) => {
  if (expandedGroups.value[group] === undefined) {
    expandedGroups.value[group] = false
  } else {
    expandedGroups.value[group] = !expandedGroups.value[group]
  }
}

// Group logic
const groupedTasks = computed(() => {
  let filtered = store.tasks

  // Apply new filters
  filtered = filtered.filter(task => {
    // Search
    let matchSearch = true
    if (searchQuery.value.trim() !== '') {
      const q = searchQuery.value.toLowerCase()
      const titleMatch = task.title?.toLowerCase().includes(q)
      const descMatch = task.description?.toLowerCase().includes(q)
      const catMatch = task.category?.name?.toLowerCase().includes(q)
      matchSearch = titleMatch || descMatch || catMatch
    }

    // Status
    let matchStatus = true
    if (filterStatus.value === 'Todo') {
      matchStatus = task.status !== 'completed'
    } else if (filterStatus.value === 'Completed') {
      matchStatus = task.status === 'completed'
    } else if (filterStatus.value === 'Overdue') {
      const today = new Date()
      today.setHours(0,0,0,0)
      if (task.status === 'completed' || !task.due_date) {
        matchStatus = false
      } else {
        const due = parseBackendDateToDate(task.due_date)
        due.setHours(0,0,0,0)
        matchStatus = due < today
      }
    }

    // Category
    const matchCategory = filterCategory.value === 'All Categories' || (task.category?.name || 'General') === filterCategory.value
    
    // Priority
    let matchPriority = true
    if (filterPriority.value !== 'All Priorities') {
      matchPriority = task.priority === filterPriority.value.toLowerCase()
    }
    
    // Date
    let matchDate = true
    if (filterDate.value !== 'All Time') {
      if (!task.due_date) {
        matchDate = false
      } else {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const due = parseBackendDateToDate(task.due_date)
        due.setHours(0, 0, 0, 0)
        
        if (filterDate.value === 'Today') {
          matchDate = due.getTime() === today.getTime()
        } else if (filterDate.value === 'This Week') {
          const day = today.getDay()
          const diffToMonday = today.getDate() - day + (day === 0 ? -6 : 1)
          const monday = new Date(today)
          monday.setDate(diffToMonday)
          monday.setHours(0, 0, 0, 0)
          
          const sunday = new Date(monday)
          sunday.setDate(monday.getDate() + 6)
          sunday.setHours(23, 59, 59, 999)
          
          matchDate = due >= monday && due <= sunday
        }
      }
    }
    
    return matchSearch && matchStatus && matchCategory && matchPriority && matchDate
  })

  // Sort tasks
  filtered.sort((a, b) => {
    let result = 0
    if (sortBy.value === 'Due Date') {
      if (!a.due_date && !b.due_date) result = 0
      else if (!a.due_date) result = 1
      else if (!b.due_date) result = -1
      else result = parseBackendDateToDate(a.due_date) - parseBackendDateToDate(b.due_date)
    } else if (sortBy.value === 'Priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1, null: 0, undefined: 0, '': 0 }
      const pA = priorityOrder[a.priority?.toLowerCase()] || 0
      const pB = priorityOrder[b.priority?.toLowerCase()] || 0
      
      if (pA !== pB) {
        result = pB - pA // High first by default
      } else {
        if (!a.due_date && !b.due_date) result = 0
        else if (!a.due_date) result = 1
        else if (!b.due_date) result = -1
        else result = parseBackendDateToDate(a.due_date) - parseBackendDateToDate(b.due_date)
      }
    }
    
    return sortDesc.value ? -result : result
  })

  // Now group them
  const result = []
  
  if (sortBy.value === 'Due Date') {
    const dateGroups = {}
    const noDateTasks = []
    const completedTasks = []
    
    filtered.forEach(t => {
      if (t.status === 'completed') {
        completedTasks.push(t)
        return
      }
      
      if (!t.due_date) {
        noDateTasks.push(t)
        return
      }
      
      // Get local YYYY-MM-DD
      const due = parseBackendDateToDate(t.due_date)
      const year = due.getFullYear()
      const month = String(due.getMonth() + 1).padStart(2, '0')
      const day = String(due.getDate()).padStart(2, '0')
      const dateKey = `${year}-${month}-${day}`
      
      if (!dateGroups[dateKey]) {
        dateGroups[dateKey] = []
      }
      dateGroups[dateKey].push(t)
    })
    
    // Sort the date keys
    const sortedDateKeys = Object.keys(dateGroups).sort((a, b) => {
      return sortDesc.value ? b.localeCompare(a) : a.localeCompare(b)
    })
    
    const formatDisplayDate = (dateString) => {
      // Use T12:00:00 to avoid timezone shift when parsing
      const d = new Date(dateString + 'T12:00:00')
      return `📅 ${d.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}`
    }
    
    if (filterStatus.value !== 'Completed') {
      if (sortDesc.value && noDateTasks.length > 0) {
        result.push({ name: '📅 No Date', tasks: noDateTasks })
      }
      
      sortedDateKeys.forEach(dateKey => {
        result.push({ name: formatDisplayDate(dateKey), tasks: dateGroups[dateKey] })
      })
      
      if (!sortDesc.value && noDateTasks.length > 0) {
        result.push({ name: '📅 No Date', tasks: noDateTasks })
      }
    }

    if ((filterStatus.value === 'All Statuses' || filterStatus.value === 'Completed') && completedTasks.length) {
      result.push({ name: 'Completed', tasks: completedTasks })
    }
    
  } else if (sortBy.value === 'Priority') {
    const groups = {
      'High Priority': [],
      'Medium Priority': [],
      'Low Priority': [],
      'No Priority': [],
      'Completed': []
    }
    
    filtered.forEach(t => {
      if (t.status === 'completed') {
        groups.Completed.push(t)
        return
      }
      
      const p = t.priority?.toLowerCase()
      if (p === 'high') groups['High Priority'].push(t)
      else if (p === 'medium') groups['Medium Priority'].push(t)
      else if (p === 'low') groups['Low Priority'].push(t)
      else groups['No Priority'].push(t)
    })
    
    const groupOrder = sortDesc.value 
      ? ['No Priority', 'Low Priority', 'Medium Priority', 'High Priority']
      : ['High Priority', 'Medium Priority', 'Low Priority', 'No Priority']
      
    if (filterStatus.value !== 'Completed') {
      groupOrder.forEach(g => {
        if (groups[g].length) result.push({ name: g, tasks: groups[g] })
      })
    }
    
    if ((filterStatus.value === 'All Statuses' || filterStatus.value === 'Completed') && groups.Completed.length) {
      result.push({ name: 'Completed', tasks: groups.Completed })
    }
  }

  return result
})
</script>

<template>
  <div class="task-list-container">
    <!-- Filters Card -->
    <div class="filters-card">
      <div class="search-section">
        <div class="search-input-wrapper">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" class="search-icon"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input v-model="searchQuery" type="text" :placeholder="t('tasks.filters.search_placeholder')" class="search-input" />
        </div>
        <!-- Calendar Icon Button -->
        <button class="tl-calendar-btn" @click="goToCalendar" title="View in Calendar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="3"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <circle cx="8"  cy="15" r="1.1" fill="currentColor" stroke="none"/>
            <circle cx="12" cy="15" r="1.1" fill="currentColor" stroke="none"/>
            <circle cx="16" cy="15" r="1.1" fill="currentColor" stroke="none"/>
            <circle cx="8"  cy="19" r="1.1" fill="currentColor" stroke="none"/>
            <circle cx="12" cy="19" r="1.1" fill="currentColor" stroke="none"/>
          </svg>
          <span>Calendar</span>
        </button>
      </div>

      <div class="filter-toggle-container">
        <div class="filter-label-icon" @click="showDropdowns = !showDropdowns">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          <span style="font-weight: 700; color: var(--text-dark);">{{ t('tasks.filters.title') }}</span>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="14" class="chevron-toggle" :class="{ rotated: showDropdowns }"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
        </div>
        
        <div class="customize-dropdown-wrapper" style="position: relative;">
          <div class="customize-btn" @click="showCustomize = !showCustomize">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            <span>{{ t('tasks.filters.view') }}: {{ viewLayout === 'list' ? t('tasks.filters.list_view') : t('tasks.filters.grid_view') }}</span>
          </div>
          
          <!-- Dropdown backdrop -->
          <div v-if="showCustomize" @click="showCustomize = false" style="position: fixed; inset: 0; z-index: 10;"></div>
          
          <div v-show="showCustomize" class="customize-dropdown">
            <button class="dropdown-item" :class="{active: viewLayout==='list'}" @click="viewLayout='list'; showCustomize=false">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              {{ t('tasks.filters.list_view') }}
            </button>
            <button class="dropdown-item" :class="{active: viewLayout==='grid'}" @click="viewLayout='grid'; showCustomize=false">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              {{ t('tasks.filters.grid_view') }}
            </button>
          </div>
        </div>
      </div>

      <div class="filters-row" v-show="showDropdowns">
        <div class="filters-left">
          <div class="filter-group">
            <label>{{ t('tasks.filters.status') }}</label>
            <select v-model="filterStatus">
              <option value="All Statuses">{{ t('tasks.filters.all_statuses') }}</option>
              <option value="Todo">{{ t('tasks.stats.todo') }}</option>
              <option value="Completed">{{ t('tasks.stats.completed') }}</option>
              <option value="Overdue">{{ t('tasks.stats.overdue') }}</option>
            </select>
          </div>

          <div class="filter-group">
            <label>{{ t('tasks.filters.category') }}</label>
          <select v-model="filterCategory">
            <option value="All Categories">{{ t('tasks.filters.all_categories') }}</option>
            <option v-for="catName in categoryStore.categoryNames" :key="catName" :value="catName">
              {{ catName }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label>{{ t('tasks.filters.priority') }}</label>
          <select v-model="filterPriority">
            <option value="All Priorities">{{ t('tasks.filters.all_priorities') }}</option>
            <option value="High">{{ t('tasks.priority.high') }}</option>
            <option value="Medium">{{ t('tasks.priority.medium') }}</option>
            <option value="Low">{{ t('tasks.priority.low') }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label>{{ t('tasks.filters.date') }}</label>
          <select v-model="filterDate">
            <option value="All Time">{{ t('tasks.filters.all_time') }}</option>
            <option value="Today">{{ t('tasks.filters.today') }}</option>
            <option value="This Week">{{ t('tasks.filters.this_week') }}</option>
          </select>
        </div>
      </div>

      <div class="filters-right">
        <div class="filter-group">
          <label>{{ t('tasks.filters.sort_by') }}</label>
          <select v-model="sortBy">
            <option value="Due Date">{{ t('tasks.filters.due_date') }}</option>
            <option value="Priority">{{ t('tasks.filters.priority') }}</option>
          </select>
        </div>
        
        <button class="icon-btn sort-dir-btn" @click="sortDesc = !sortDesc" title="Toggle Sort Direction">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" v-if="!sortDesc"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" v-else><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 4l-4 4m0 0l-4-4m4 4V4" /></svg>
        </button>

        <button class="reset-btn" @click="resetFilters">{{ t('tasks.filters.reset') }}</button>
      </div>
      </div>
    </div>

    <!-- Loading Skeletons -->
    <div v-if="store.initialLoading" class="task-group" style="opacity: 0.7;">
      <div class="group-header" style="pointer-events: none;">
        <SkeletonLoader width="120px" height="24px" />
        <SkeletonLoader type="circle" width="24px" height="24px" />
      </div>
      <div class="group-content" :class="{ 'is-grid': viewLayout === 'grid' }">
        <div v-for="i in 4" :key="i" class="task-item-row" :class="{ 'is-grid': viewLayout === 'grid' }" style="border-bottom: 1px solid var(--border-light); padding: 16px 0;">
          <div class="task-main-info" style="width: 100%; display: flex; gap: 16px;">
            <SkeletonLoader type="circle" width="24px" height="24px" />
            <div style="flex: 1;">
              <SkeletonLoader width="60%" height="20px" style="margin-bottom: 12px;" />
              <div style="display: flex; gap: 12px;">
                <SkeletonLoader width="80px" height="20px" borderRadius="12px" />
                <SkeletonLoader width="140px" height="20px" borderRadius="6px" />
              </div>
            </div>
            <SkeletonLoader width="60px" height="24px" borderRadius="6px" style="align-self: flex-start;" v-if="viewLayout === 'list'" />
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="!store.initialLoading && groupedTasks.length === 0" style="padding: 40px; text-align: center; color: var(--text-muted);">
      <div style="margin-bottom: 16px;">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="48" style="opacity: 0.5; margin: 0 auto;">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <p style="font-size: 16px; font-weight: 500;">{{ t('tasks.list.no_tasks') }}</p>
      <p style="font-size: 14px; margin-top: 4px;">{{ t('tasks.list.no_tasks_sub') }}</p>
    </div>

    <div v-for="group in groupedTasks" :key="group.name" class="task-group">
      <div class="group-header" @click="toggleGroup(group.name)">
        <h3 class="group-title">
          {{ group.name === 'Overdue' ? t('tasks.list.groups.overdue') : 
             group.name === 'Today' ? t('tasks.list.groups.today') : 
             group.name === 'Upcoming' ? t('tasks.list.groups.upcoming') : 
             group.name === 'Completed' ? t('tasks.list.groups.completed') : 
             group.name === 'High Priority' ? t('tasks.list.groups.high_priority') : 
             group.name === 'Medium Priority' ? t('tasks.list.groups.medium_priority') : 
             group.name === 'Low Priority' ? t('tasks.list.groups.low_priority') : 
             group.name === 'No Priority' ? t('tasks.list.groups.no_priority') : group.name 
          }}
        </h3>
        <div class="group-actions">
          <span class="group-count">{{ group.tasks.length }}</span>
          <svg 
            class="chevron-icon" 
            :class="{ 'rotated': expandedGroups[group.name] === false }"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
          </svg>
        </div>
      </div>
      
      <div v-show="expandedGroups[group.name] !== false" class="group-content" :class="{ 'is-grid': viewLayout === 'grid' }">
        <TaskItem
          v-for="task in group.tasks"
          :key="task.id"
          :task="task"
          :layout="viewLayout"
          @edit-task="$emit('edit-task', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-list-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.task-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.group-header:hover {
  background-color: var(--bg-main);
}

.group-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0;
}

.group-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.group-count {
  background-color: var(--hover-bg);
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
}

.chevron-icon {
  color: var(--text-muted);
  transition: transform 0.2s;
}

.chevron-icon.rotated {
  transform: rotate(180deg);
}

.group-content {
  display: flex;
  flex-direction: column;
  background: var(--card-bg);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 8px 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.group-content.is-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
}

/* Filters styling */
.filters-card {
  display: flex;
  flex-direction: column;
  background: var(--card-bg);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  gap: 16px;
}

.search-section {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-light);
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 600px;
  background: var(--hover-bg);
  padding: 12px 20px;
  border-radius: 30px;
  border: 1px solid var(--border-light);
  transition: all 0.2s;
}

.search-input-wrapper:focus-within {
  background: var(--card-bg);
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-icon {
  color: var(--text-muted);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: var(--text-dark);
  background: transparent;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.tl-calendar-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--card-bg);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  color: var(--primary);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  margin-left: 16px;
}

.tl-calendar-btn:hover {
  border-color: var(--primary);
  background: rgba(59,130,246,0.05);
  transform: translateY(-1px);
}

.filter-toggle-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.customize-dropdown-wrapper {
  position: relative;
}

.customize-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 14px;
  border-radius: 8px;
  transition: background 0.2s;
  background: var(--card-bg);
  border: 1px solid var(--border-light);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-dark);
}

.customize-btn:hover {
  background: var(--hover-bg);
}

.customize-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  background: var(--card-bg);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
  min-width: 140px;
  padding: 4px;
  z-index: 20;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-align: left;
}

.dropdown-item:hover {
  background: var(--hover-bg);
}

.dropdown-item.active {
  color: var(--primary);
  background: var(--stat-blue-bg);
}

.filter-label-icon {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 8px;
  transition: background 0.2s;
  user-select: none;
}

.filter-label-icon:hover {
  background: var(--hover-bg);
}

.chevron-toggle {
  color: var(--text-muted);
  transition: transform 0.3s;
}

.chevron-toggle.rotated {
  transform: rotate(180deg);
}

.filters-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.filters-left {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
  flex: 1;
}

.filters-right {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.filter-group label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
}

.filter-group select {
  padding: 8px 32px 8px 12px;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-dark);
  background-color: var(--card-bg);
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  outline: none;
  cursor: pointer;
  min-width: 130px;
  width: 100%;
}

.filter-group select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  background: var(--card-bg);
  color: var(--primary);
  cursor: pointer;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: var(--stat-blue-bg);
  border-color: var(--primary);
}

.reset-btn {
  padding: 0 16px;
  height: 36px;
  background: var(--hover-bg);
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  transition: background 0.2s;
}

.reset-btn:hover {
  background: var(--active-bg);
}

/* ===== Responsive: Tablet ===== */
@media (max-width: 992px) {
  .group-content.is-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

/* ===== Responsive: Mobile ===== */
@media (max-width: 768px) {
  .task-list-container {
    gap: 16px;
  }

  .filters-card {
    padding: 12px 14px;
    gap: 12px;
  }

  /* Search */
  .search-section {
    padding-bottom: 12px;
  }

  .search-input-wrapper {
    max-width: none;
    padding: 10px 16px;
  }

  .search-input {
    font-size: 14px;
  }

  /* Filter toggle row */
  .filter-toggle-container {
    flex-wrap: wrap;
    gap: 8px;
  }

  .filter-label-icon {
    padding: 6px 8px;
  }

  .filter-label-icon span {
    font-size: 13px;
  }

  .customize-btn {
    padding: 7px 10px;
    font-size: 12px;
  }

  /* Filter dropdowns: 2-column grid on mobile */
  .filters-row {
    flex-direction: column;
    gap: 12px;
  }

  .filters-left {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    width: 100%;
  }

  .filters-right {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    width: 100%;
  }

  .filter-group {
    min-width: 0;
  }

  .filter-group select {
    min-width: unset;
    width: 100%;
    font-size: 12px;
    padding: 8px 28px 8px 10px;
  }

  .filter-group label {
    font-size: 10px;
  }

  .reset-btn {
    font-size: 12px;
    padding: 0 12px;
    height: 34px;
    flex: 1;
  }

  .icon-btn {
    width: 34px;
    height: 34px;
  }

  /* Grid view: single column on small mobile */
  .group-content.is-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .group-header {
    padding: 4px 4px;
  }

  .group-title {
    font-size: 14px;
  }

  .group-content {
    padding: 8px 12px;
    border-radius: 10px;
  }
}

@media (max-width: 480px) {
  .filters-left {
    grid-template-columns: 1fr 1fr;
  }

  .customize-btn span {
    display: none;
  }

  .customize-btn {
    padding: 7px;
  }
}
</style>

