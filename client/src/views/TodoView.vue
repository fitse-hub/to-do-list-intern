<script setup>
import { onMounted, ref, computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import TaskList from '@/components/TaskList.vue'
import NewTaskModal from '@/components/NewTaskModal.vue'
import SkeletonLoader from '@/components/common/SkeletonLoader.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useTaskStore()
const isModalOpen = ref(false)
const taskToEdit = ref(null)

const openEditModal = (task) => {
  taskToEdit.value = task
  isModalOpen.value = true
}

const openNewTaskModal = () => {
  taskToEdit.value = null
  isModalOpen.value = true
}

onMounted(() => {
  store.fetchTasks()
})

const stats = computed(() => {
  const all = store.tasks.length
  const completed = store.tasks.filter(t => t.status === 'completed').length
  const pending = store.tasks.filter(t => t.status !== 'completed').length // Using anything not completed as pending for UI simplicity
  
  const today = new Date()
  today.setHours(0,0,0,0)
  
  const overdue = store.tasks.filter(t => {
    if (t.status === 'completed') return false
    if (!t.due_date) return false
    const due = new Date(t.due_date)
    due.setHours(0,0,0,0)
    return due < today
  }).length
  
  return { all, completed, pending, overdue }
})
</script>

<template>
  <section class="tasks-page-wrapper">
    <!-- Stat Cards -->
    <div class="todo-stats-container">
      <template v-if="store.initialLoading">
        <div v-for="i in 4" :key="i" class="todo-stat-card">
          <SkeletonLoader width="56px" height="56px" borderRadius="16px" />
          <div class="todo-stat-body" style="width: 100%;">
            <SkeletonLoader width="50%" height="12px" style="margin-bottom: 4px;" />
            <SkeletonLoader width="40px" height="28px" style="margin-bottom: 4px;" />
            <SkeletonLoader width="60%" height="10px" />
          </div>
        </div>
      </template>
      <template v-else>
      <div class="todo-stat-card">
        <div class="todo-stat-icon blue-icon">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
        </div>
        <div class="todo-stat-body">
          <span class="todo-stat-label">{{ t('tasks.stats.all') }}</span>
          <span class="todo-stat-value blue-text">{{ stats.all }}</span>
          <span class="todo-stat-sub">{{ t('tasks.stats.all_sub') }}</span>
        </div>
      </div>

      <div class="todo-stat-card">
        <div class="todo-stat-icon green-icon">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div class="todo-stat-body">
          <span class="todo-stat-label">{{ t('tasks.stats.completed') }}</span>
          <span class="todo-stat-value green-text">{{ stats.completed }}</span>
          <span class="todo-stat-sub">{{ t('tasks.stats.completed_sub') }}</span>
        </div>
      </div>

      <div class="todo-stat-card">
        <div class="todo-stat-icon orange-icon">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div class="todo-stat-body">
          <span class="todo-stat-label">{{ t('tasks.stats.todo') }}</span>
          <span class="todo-stat-value orange-text">{{ stats.pending }}</span>
          <span class="todo-stat-sub">{{ t('tasks.stats.todo_sub') }}</span>
        </div>
      </div>

      <div class="todo-stat-card">
        <div class="todo-stat-icon purple-icon">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
        <div class="todo-stat-body">
          <span class="todo-stat-label">{{ t('tasks.stats.overdue') }}</span>
          <span class="todo-stat-value purple-text">{{ stats.overdue }}</span>
          <span class="todo-stat-sub">{{ t('tasks.stats.overdue_sub') }}</span>
        </div>
      </div>
      </template>
    </div>

    <!-- Task List -->
    <TaskList @edit-task="openEditModal" />

    <!-- Floating Action Button -->
    <button @click="openNewTaskModal" class="fab-btn" :title="t('tasks.modal.create_title')">
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
    </button>

    <NewTaskModal 
      :is-open="isModalOpen" 
      :task-to-edit="taskToEdit"
      @close="isModalOpen = false; taskToEdit = null" 
    />
  </section>
</template>

<style scoped>
.tasks-page-wrapper {
  width: 100%;
  padding-bottom: 80px; /* space for FAB */
}

.todo-stats-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.todo-stat-card {
  background: white;
  border: 1px solid #F0F0F0;
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}

.todo-stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.todo-stat-icon svg {
  width: 28px;
  height: 28px;
}

.blue-icon  { background: #EFF6FF; color: #3B82F6; }
.green-icon { background: #ECFDF5; color: #10B981; }
.orange-icon{ background: #FFF7ED; color: #F97316; }
.purple-icon{ background: #FAF5FF; color: #A855F7; }

.blue-text  { color: #3B82F6; }
.green-text { color: #10B981; }
.orange-text{ color: #F97316; }
.purple-text{ color: #A855F7; }

.todo-stat-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.todo-stat-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.todo-stat-value {
  font-size: 32px;
  font-weight: 800;
  line-height: 1.1;
}

.todo-stat-sub {
  font-size: 12px;
  color: #9CA3AF;
  font-weight: 400;
  margin-top: 4px;
}



.fab-btn {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #3B82F6;
  color: white;
  border: none;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  z-index: 50;
}

.fab-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 14px 20px -3px rgba(59, 130, 246, 0.5);
}

.fab-btn:active {
  transform: translateY(2px) scale(0.95);
}

@media (max-width: 992px) {
  .todo-stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .fab-btn {
    bottom: 90px; /* Above bottom nav */
    right: 20px;
  }

  .todo-stats-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 16px;
  }

  .todo-stat-card {
    padding: 16px;
    gap: 12px;
    border-radius: 12px;
  }

  .todo-stat-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
  }

  .todo-stat-icon svg {
    width: 22px;
    height: 22px;
  }

  .todo-stat-value {
    font-size: 24px;
  }

  .todo-stat-label {
    font-size: 12px;
  }

  .todo-stat-sub {
    font-size: 11px;
  }
}

@media (max-width: 400px) {
  .todo-stat-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 14px 10px;
    gap: 8px;
  }

  .todo-stat-body {
    align-items: center;
  }
}
</style>
