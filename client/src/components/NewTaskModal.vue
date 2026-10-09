<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useI18n } from 'vue-i18n'
import WarningConfirmation from './WarningConfirmation.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  taskToEdit: {
    type: Object,
    default: null
  },
  prefilledDate: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close'])

const { t } = useI18n()
const store = useTaskStore()
const categoryStore = useCategoryStore()

const title = ref('')
const description = ref('')
const category = ref('')
const startDate = ref('')
const dueDate = ref('')
const priority = ref('')

const showNewListModal = ref(false)
const newListName = ref('')
const showEditCategoryModal = ref(false)
const editCategoryName = ref('')
const showWarningModal = ref(false)
const errors = ref({})

// --- Utility: parse a backend UTC date string into a local datetime-local string ---
const parseBackendDate = (dateStr) => {
  if (!dateStr) return '';
  let safeStr = dateStr;
  if (!safeStr.includes('T')) {
    safeStr = safeStr.replace(' ', 'T');
  }
  if (!safeStr.endsWith('Z') && !safeStr.includes('+') && !safeStr.match(/-\d{2}:\d{2}$/)) {
    safeStr += 'Z';
  }
  const d = new Date(safeStr);
  const tzoffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzoffset).toISOString().slice(0, 16);
}

const currentLocalTime = computed(() => {
  const d = new Date()
  const tzoffset = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - tzoffset).toISOString().slice(0, 16)
})

// --- Warning: show helpful feedback when the selected due date already has tasks ---
const crowdedScheduleWarning = computed(() => {
  if (!dueDate.value) return null
  const selectedDateStr = dueDate.value.substring(0, 10)
  
  // Exclude the task being edited from the count
  const editingId = props.taskToEdit?.id
  
  const count = store.tasks.filter(task => {
    if (!task.due_date) return false
    if (editingId && task.id === editingId) return false
    const localStr = parseBackendDate(task.due_date)
    if (!localStr) return false
    return localStr.substring(0, 10) === selectedDateStr
  }).length
  
  if (count > 0) {
    const d = new Date(selectedDateStr + 'T12:00:00')
    const formattedDate = new Intl.DateTimeFormat(t('locale') || 'en-US', { month: 'long', day: 'numeric' }).format(d)
    return count === 1
      ? t('tasks.modal.crowded_warning', { count, date: formattedDate })
      : t('tasks.modal.crowded_warning_plural', { count, date: formattedDate })
  }
  return null
})

onMounted(async () => {
  if (categoryStore.categories.length === 0) {
    try {
      await categoryStore.fetchCategories()
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }
  if (categoryStore.categories.length > 0) {
    category.value = categoryStore.categories[0].name
  }
  // Ensure tasks are loaded so the crowded schedule warning can work
  if (store.tasks.length === 0) {
    try {
      await store.fetchTasks()
    } catch (error) {
      console.error('Failed to load tasks:', error)
    }
  }
})

watch(startDate, (newVal) => {
  if (newVal && dueDate.value && new Date(dueDate.value) < new Date(newVal)) {
    dueDate.value = newVal
  }
})

watch(() => props.isOpen, (newVal) => {
  if (newVal && !props.taskToEdit) {
    if (props.prefilledDate) {
      dueDate.value = props.prefilledDate
    } else {
      dueDate.value = ''
      startDate.value = ''
    }
  }
})

// Populate form when taskToEdit changes
watch(() => props.taskToEdit, (newVal) => {
  if (newVal) {
    title.value = newVal.title
    description.value = newVal.description || ''
    category.value = newVal.category?.name || ''
    if (newVal.start_date) {
      startDate.value = parseBackendDate(newVal.start_date)
    } else {
      startDate.value = ''
    }
    if (newVal.due_date) {
      dueDate.value = parseBackendDate(newVal.due_date)
    } else {
      dueDate.value = ''
    }
    priority.value = newVal.priority || ''
  } else {
    // New task defaults
    title.value = ''
    description.value = ''
    if (categoryStore.categories.length > 0) {
      category.value = categoryStore.categories[0].name
    } else {
      category.value = ''
    }
    startDate.value = ''
    dueDate.value = ''
    priority.value = ''
  }
})

const handleCategorySubmit = async () => {
  errors.value.newCategory = ''
  if (!newListName.value.trim()) {
    errors.value.newCategory = 'Category name is required'
    return
  }

  const success = await categoryStore.createCategory(newListName.value.trim())
  if (success) {
    category.value = newListName.value.trim()
    newListName.value = ''
    categoryStore.error = null
    showNewListModal.value = false
  }
}

const handleEditCategorySubmit = async () => {
  errors.value.editCategory = ''
  if (!editCategoryName.value.trim()) {
    errors.value.editCategory = 'Category name is required'
    return
  }
  
  if (!category.value) return
  const categoryId = categoryStore.getCategoryIdByName(category.value)
  if (!categoryId) return

  const success = await categoryStore.updateCategory(categoryId, editCategoryName.value.trim())
  if (success) {
    category.value = editCategoryName.value.trim()
    editCategoryName.value = ''
    categoryStore.error = null
    showEditCategoryModal.value = false
  }
}

const openEditCategoryModal = () => {
  if (!category.value) return
  editCategoryName.value = category.value
  showEditCategoryModal.value = true
}

const closeCategoryModal = () => {
  showNewListModal.value = false
  newListName.value = ''
  categoryStore.error = null
}

const closeEditCategoryModal = () => {
  showEditCategoryModal.value = false
  editCategoryName.value = ''
  categoryStore.error = null
}

const closeTaskModal = () => {
  emit('close')
  // Reset form
  title.value = ''
  description.value = ''
  if (categoryStore.categories.length > 0) {
    category.value = categoryStore.categories[0].name
  } else {
    category.value = ''
  }
  startDate.value = ''
  dueDate.value = ''
  priority.value = ''
  errors.value = {}
}

const formatForBackend = (val) => {
  if (!val) return null;
  return new Date(val).toISOString();
}

const validate = () => {
  errors.value = {}

  if (!title.value.trim()) {
    errors.value.title = 'Title is required'
  }

  if (startDate.value && dueDate.value) {
    const start = new Date(startDate.value)
    const due = new Date(dueDate.value)
    if (start > due) {
      errors.value.date = 'Start date cannot be after due date'
    }
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (!validate()) return

  if (crowdedScheduleWarning.value) {
    showWarningModal.value = true
    return
  }

  executeSubmit()
}

const executeSubmit = async () => {
  showWarningModal.value = false

  const categoryId = categoryStore.getCategoryIdByName(category.value)

  if (props.taskToEdit) {
    await store.updateTask({
      ...props.taskToEdit,
      title: title.value,
      category_id: categoryId,
      start_date: formatForBackend(startDate.value),
      due_date: formatForBackend(dueDate.value),
      priority: priority.value || null
    })
  } else {
    await store.createTask(
      title.value,
      categoryId,
      formatForBackend(startDate.value),
      formatForBackend(dueDate.value),
      priority.value || null
    )
  }
  closeTaskModal()
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-backdrop task-modal-backdrop">
      <div class="modal-card task-modal-card">
        <div class="modal-header">
          <h2 class="modal-title">{{ props.taskToEdit ? t('tasks.modal.edit_title') : t('tasks.modal.create_title') }}</h2>
          <button @click="closeTaskModal" class="close-btn">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <!-- Error Message Display -->
          <div v-if="store.error" class="error-message">
            <svg class="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ store.error }}
          </div>

          <form novalidate @submit.prevent="handleSubmit" class="task-form">
            <div class="form-group full-width">
              <label class="form-label">{{ t('tasks.modal.title_label') }} <span class="required">*</span></label>
              <div class="input-with-icon">
                <svg class="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <input 
                  v-model="title" 
                  type="text" 
                  :placeholder="t('tasks.modal.title_placeholder')" 
                  class="form-input" 
                  :class="{ 'input-error': errors.title }"
                  @input="errors.title = ''"
                />
              </div>
              <div v-if="errors.title" class="error-text">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ errors.title }}
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">{{ t('tasks.modal.category_label') }}</label>
                <div class="category-input-group">
                  <div class="input-with-icon select-wrapper">
                    <svg class="input-icon" fill="none" viewBox="0 0 24 24" stroke="#8B5CF6">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <select v-model="category" class="form-input">
                      <option value="">{{ t('tasks.modal.select_category') }}</option>
                      <option v-for="catName in categoryStore.categoryNames" :key="catName" :value="catName">{{ catName }}</option>
                    </select>
                    <svg class="chevron-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <button @click.prevent="showNewListModal = true" class="add-category-btn" title="Add new category">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="9" y1="13" x2="15" y2="13"></line>
                      <line x1="9" y1="17" x2="15" y2="17"></line>
                      <line x1="16" y1="19" x2="22" y2="19"></line>
                      <line x1="19" y1="16" x2="19" y2="22"></line>
                    </svg>
                  </button>
                  <button @click.prevent="openEditCategoryModal" class="add-category-btn edit-category-btn" title="Edit selected category" :disabled="!category">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">{{ t('tasks.modal.priority_label') }}</label>
                <div class="input-with-icon select-wrapper">
                  <svg class="input-icon" fill="none" viewBox="0 0 24 24" stroke="#EF4444">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                  <select v-model="priority" class="form-input">
                    <option value="">{{ t('tasks.modal.select_priority') }}</option>
                    <option value="low">{{ t('tasks.priority.low') }}</option>
                    <option value="medium">{{ t('tasks.priority.medium') }}</option>
                    <option value="high">{{ t('tasks.priority.high') }}</option>
                  </select>
                  <svg class="chevron-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">{{ t('tasks.modal.start_date') }}</label>
                <div class="input-with-icon">
                  <svg class="input-icon" fill="none" viewBox="0 0 24 24" stroke="#10B981">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <input 
                    v-model="startDate" 
                    type="datetime-local" 
                    class="form-input"
                    :class="{ 'input-error': errors.date }"
                    @change="errors.date = ''"
                  />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">{{ t('tasks.modal.due_date') }}</label>
                <div class="input-with-icon">
                  <svg class="input-icon" fill="none" viewBox="0 0 24 24" stroke="#EF4444">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <input 
                    v-model="dueDate" 
                    type="datetime-local" 
                    class="form-input"
                    :class="{ 'input-error': errors.date }"
                    @change="errors.date = ''"
                  />
                </div>
              </div>
            </div>
            
            <div v-if="errors.date" class="error-text" style="margin-top: -12px; margin-bottom: 16px;">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ errors.date }}
            </div>

            <div class="form-group full-width">
              <label class="form-label">{{ t('tasks.modal.description') }}</label>
              <div class="input-with-icon">
                <svg class="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="top: 14px; transform: none;">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <textarea v-model="description" :placeholder="t('tasks.modal.desc_placeholder')" class="form-input form-textarea" rows="3"></textarea>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" @click="closeTaskModal" class="btn-cancel">{{ t('tasks.modal.btn_cancel') }}</button>
              <button type="submit" class="btn-submit" :disabled="store.loading">
                <svg v-if="!store.loading" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ store.loading ? (props.taskToEdit ? t('tasks.modal.btn_updating') : t('tasks.modal.btn_creating')) : (props.taskToEdit ? t('tasks.modal.btn_update') : t('tasks.modal.btn_create')) }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- New Category Modal -->
  <Teleport to="body">
    <div v-if="showNewListModal" class="modal-backdrop" style="z-index: 10000;">
      <div class="modal-card" style="padding: 24px;">
        <h3 class="modal-title" style="text-align: left; font-size: 16px; margin-bottom: 16px;">{{ t('tasks.modal.new_category') }}</h3>
        
        <div v-if="categoryStore.error" class="error-alert" style="margin-bottom: 16px;">
          <span>{{ categoryStore.error }}</span>
        </div>

        <input 
          v-model="newListName" 
          type="text" 
          :placeholder="t('tasks.modal.cat_name_placeholder')" 
          class="search-input form-input" 
          style="width: 100%; margin-bottom: 8px; padding: 12px; box-sizing: border-box;" 
          :class="{ 'input-error': errors.newCategory }" 
          @keyup.enter="handleCategorySubmit" 
          @input="categoryStore.error = null; errors.newCategory = ''" 
        />
        <div v-if="errors.newCategory" class="error-text" style="margin-bottom: 16px;">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ errors.newCategory }}
        </div>
        
        <div class="modal-actions" style="display: flex; justify-content: flex-end; gap: 12px;">
          <button @click="closeCategoryModal" class="btn modal-cancel-btn btn-cancel" style="border: none; background: transparent; padding: 8px 16px;">{{ t('tasks.modal.btn_cancel') }}</button>
          <button @click="handleCategorySubmit" class="btn btn-primary btn-submit" style="padding: 8px 24px; border-radius: 999px; background: #3B82F6; color: white; border: none;" :disabled="categoryStore.loading">
            {{ categoryStore.loading ? t('tasks.modal.btn_adding') : t('tasks.modal.btn_add') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Edit Category Modal -->
  <Teleport to="body">
    <div v-if="showEditCategoryModal" class="modal-backdrop" style="z-index: 10000;">
      <div class="modal-card" style="padding: 24px;">
        <h3 class="modal-title" style="text-align: left; font-size: 16px; margin-bottom: 16px;">{{ t('tasks.modal.edit_category') }}</h3>
        
        <div v-if="categoryStore.error" class="error-alert" style="margin-bottom: 16px;">
          <span>{{ categoryStore.error }}</span>
        </div>

        <input 
          v-model="editCategoryName" 
          type="text" 
          :placeholder="t('tasks.modal.cat_name_placeholder')" 
          class="search-input form-input" 
          style="width: 100%; margin-bottom: 8px; padding: 12px; box-sizing: border-box;" 
          :class="{ 'input-error': errors.editCategory }" 
          @keyup.enter="handleEditCategorySubmit" 
          @input="categoryStore.error = null; errors.editCategory = ''" 
        />
        <div v-if="errors.editCategory" class="error-text" style="margin-bottom: 16px;">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ errors.editCategory }}
        </div>
        
        <div class="modal-actions" style="display: flex; justify-content: flex-end; gap: 12px;">
          <button @click="closeEditCategoryModal" class="btn modal-cancel-btn btn-cancel" style="border: none; background: transparent; padding: 8px 16px;">{{ t('tasks.modal.btn_cancel') }}</button>
          <button @click="handleEditCategorySubmit" class="btn btn-primary btn-submit" style="padding: 8px 24px; border-radius: 999px; background: #3B82F6; color: white; border: none;" :disabled="categoryStore.loading">
            {{ categoryStore.loading ? t('tasks.modal.btn_updating') : t('tasks.modal.btn_update') }}
          </button>
        </div>
      </div>
    </div>
    <!-- Warning Confirmation Modal -->
    <WarningConfirmation
      :show="showWarningModal"
      :message="crowdedScheduleWarning"
      :confirm-text="taskToEdit ? t('tasks.modal.btn_update_anyway') : t('tasks.modal.btn_create_anyway')"
      @cancel="showWarningModal = false"
      @confirm="executeSubmit"
    />
  </Teleport>
</template>

<style scoped>
.modal-backdrop, .task-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-card {
  max-width: 420px;
  width: 100%;
  padding: 0;
  background-color: var(--card-bg);
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  position: relative;
  z-index: 10000;
}

.task-modal-card {
  max-width: 720px;
}

.modal-header {
  padding: 24px 32px;
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.modal-body {
  padding: 32px;
  background: var(--card-bg);
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}

.task-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
}

.required {
  color: var(--stat-red-text);
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  width: 20px;
  height: 20px;
  color: var(--text-muted);
  pointer-events: none;
}

.chevron-icon {
  position: absolute;
  right: 14px;
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 12px 14px 12px 42px;
  border: 1px solid var(--border-light);
  border-radius: 12px;
  font-size: 15px;
  color: var(--text-dark);
  background: var(--hover-bg);
  transition: all 0.2s;
}

.select-wrapper .form-input {
  padding-right: 40px;
  appearance: none;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  background: var(--card-bg);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
  padding-top: 12px;
}

.category-input-group {
  display: flex;
  gap: 8px;
}

.category-input-group .select-wrapper {
  flex: 1;
}

.add-category-btn {
  background: var(--stat-blue-bg);
  border: 1px solid var(--primary);
  color: var(--primary);
  width: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.add-category-btn:hover {
  background: var(--stat-blue-bg);
  border-color: var(--primary);
}

.edit-category-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--hover-bg);
  border-color: var(--border-light);
  color: var(--text-muted);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
  padding-top: 24px;
  border-top: 1px solid var(--border-light);
}

.btn-cancel {
  padding: 10px 20px;
  border: 1px solid var(--border-light);
  background: var(--card-bg);
  color: var(--text-muted);
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: var(--hover-bg);
}

.btn-submit {
  padding: 10px 24px;
  background: #3B82F6;
  border: none;
  color: white;
  border-radius: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
}

.btn-submit:hover:not(:disabled) {
  background: #2563EB;
  transform: translateY(-1px);
  box-shadow: 0 6px 8px -1px rgba(59, 130, 246, 0.3);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--stat-red-bg);
  color: var(--danger-text);
  border-radius: 12px;
  margin-bottom: 20px;
  font-size: 14px;
}

.error-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .task-modal-card {
    border-radius: 16px;
  }
  
  .modal-header {
    padding: 20px 24px;
  }
  
  .modal-body {
    padding: 24px;
  }
}

/* Schedule Warning */
.schedule-warning {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--stat-yellow-bg);
  color: var(--stat-yellow-text);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  animation: warningSlideIn 0.3s ease-out;
}

.schedule-warning-icon {
  flex-shrink: 0;
  color: var(--stat-yellow-text);
}

@keyframes warningSlideIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
