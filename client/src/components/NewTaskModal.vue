<script setup>
import { ref, onMounted, watch } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  taskToEdit: {
    type: Object,
    default: null
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
})

// Populate form when taskToEdit changes
watch(() => props.taskToEdit, (newVal) => {
  if (newVal) {
    title.value = newVal.title
    description.value = newVal.description || ''
    category.value = newVal.category?.name || ''
    if (newVal.start_date) {
      const d = new Date(newVal.start_date)
      const tzoffset = d.getTimezoneOffset() * 60000
      startDate.value = new Date(d.getTime() - tzoffset).toISOString().slice(0, 16)
    } else {
      startDate.value = ''
    }
    if (newVal.due_date) {
      const d = new Date(newVal.due_date)
      const tzoffset = d.getTimezoneOffset() * 60000
      dueDate.value = new Date(d.getTime() - tzoffset).toISOString().slice(0, 16)
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

const handleAddCategory = async () => {
  if (!newListName.value.trim()) return

  const success = await categoryStore.createCategory(newListName.value.trim())
  if (success) {
    category.value = newListName.value.trim()
    newListName.value = ''
    categoryStore.error = null
    showNewListModal.value = false
  }
}

const closeCategoryModal = () => {
  showNewListModal.value = false
  newListName.value = ''
  categoryStore.error = null
}

const openEditCategoryModal = () => {
  if (!category.value) return
  editCategoryName.value = category.value
  showEditCategoryModal.value = true
}

const handleEditCategory = async () => {
  if (!editCategoryName.value.trim() || !category.value) return

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
}

const handleSubmit = async () => {
  if (!title.value.trim()) return

  const categoryId = categoryStore.getCategoryIdByName(category.value)

  if (props.taskToEdit) {
    await store.updateTask({
      ...props.taskToEdit,
      title: title.value,
      category_id: categoryId,
      start_date: startDate.value || null,
      due_date: dueDate.value || null,
      priority: priority.value || null
    })
  } else {
    await store.createTask(
      title.value,
      categoryId,
      startDate.value || null,
      dueDate.value || null,
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

          <form @submit.prevent="handleSubmit" class="task-form">
            <div class="form-group full-width">
              <label class="form-label">{{ t('tasks.modal.title_label') }} <span class="required">*</span></label>
              <div class="input-with-icon">
                <svg class="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <input v-model="title" type="text" :placeholder="t('tasks.modal.title_placeholder')" class="form-input" required />
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
                <div class="input-with-icon select-wrapper">
                  <svg class="input-icon" fill="none" viewBox="0 0 24 24" stroke="#10B981">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <input v-model="startDate" type="datetime-local" class="form-input" />
                  <svg class="chevron-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">{{ t('tasks.modal.due_date') }}</label>
                <div class="input-with-icon select-wrapper">
                  <svg class="input-icon" fill="none" viewBox="0 0 24 24" stroke="#3B82F6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <input v-model="dueDate" type="datetime-local" class="form-input" :min="startDate || new Date().toISOString().slice(0, 16)" />
                  <svg class="chevron-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
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

        <input v-model="newListName" type="text" :placeholder="t('tasks.modal.cat_name_placeholder')" class="search-input form-input" style="width: 100%; margin-bottom: 24px; padding: 12px; box-sizing: border-box;" @keyup.enter="handleAddCategory" @input="categoryStore.error = null" />
        
        <div class="modal-actions" style="display: flex; justify-content: flex-end; gap: 12px;">
          <button @click="closeCategoryModal" class="btn modal-cancel-btn btn-cancel" style="border: none; background: transparent; padding: 8px 16px;">{{ t('tasks.modal.btn_cancel') }}</button>
          <button @click="handleAddCategory" class="btn btn-primary btn-submit" style="padding: 8px 24px; border-radius: 999px; background: #3B82F6; color: white; border: none;" :disabled="categoryStore.loading">
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

        <input v-model="editCategoryName" type="text" :placeholder="t('tasks.modal.cat_name_placeholder')" class="search-input form-input" style="width: 100%; margin-bottom: 24px; padding: 12px; box-sizing: border-box;" @keyup.enter="handleEditCategory" @input="categoryStore.error = null" />
        
        <div class="modal-actions" style="display: flex; justify-content: flex-end; gap: 12px;">
          <button @click="closeEditCategoryModal" class="btn modal-cancel-btn btn-cancel" style="border: none; background: transparent; padding: 8px 16px;">{{ t('tasks.modal.btn_cancel') }}</button>
          <button @click="handleEditCategory" class="btn btn-primary btn-submit" style="padding: 8px 24px; border-radius: 999px; background: #3B82F6; color: white; border: none;" :disabled="categoryStore.loading">
            {{ categoryStore.loading ? t('tasks.modal.btn_updating') : t('tasks.modal.btn_update') }}
          </button>
        </div>
      </div>
    </div>
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
  background-color: white;
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
  background: white;
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
  color: #4B5563;
}

.required {
  color: #EF4444;
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
  color: #9CA3AF;
  pointer-events: none;
}

.chevron-icon {
  position: absolute;
  right: 14px;
  width: 16px;
  height: 16px;
  color: #9CA3AF;
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 12px 14px 12px 42px;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  font-size: 15px;
  color: #1F2937;
  background: #F9FAFB;
  transition: all 0.2s;
}

.select-wrapper .form-input {
  padding-right: 40px;
  appearance: none;
}

.form-input:focus {
  outline: none;
  border-color: #3B82F6;
  background: white;
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
  background: #EFF6FF;
  border: 1px solid #BFDBFE;
  color: #3B82F6;
  width: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.add-category-btn:hover {
  background: #DBEAFE;
  border-color: #93C5FD;
}

.edit-category-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #F3F4F6;
  border-color: #E5E7EB;
  color: #9CA3AF;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
  padding-top: 24px;
  border-top: 1px solid #E5E7EB;
}

.btn-cancel {
  padding: 10px 20px;
  border: 1px solid #E5E7EB;
  background: white;
  color: #4B5563;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #F3F4F6;
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
  background: #FEF2F2;
  color: #DC2626;
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
</style>
