<script setup>
import { ref, onMounted } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useRouter } from 'vue-router'

const store = useTaskStore()
const categoryStore = useCategoryStore()
const router = useRouter()
const title = ref('')
const description = ref('')
const category = ref('')
const startDate = ref('')
const dueDate = ref('')
const priority = ref('')

const showNewListModal = ref(false)
const newListName = ref('')

onMounted(async () => {
  try {
    await categoryStore.fetchCategories()
    // Set the first category (General) as default if categories are loaded
    if (categoryStore.categories.length > 0) {
      category.value = categoryStore.categories[0].name
    }
  } catch (error) {
    console.error('Failed to load categories:', error)
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
  // If not successful, error will be displayed in modal
}

const closeModal = () => {
  showNewListModal.value = false
  newListName.value = ''
  categoryStore.error = null
}

const goBack = () => {
  router.push('/todos')
}

const handleSubmit = async () => {
  if (!title.value.trim()) return

  // Get category ID from the selected category name
  const categoryId = categoryStore.getCategoryIdByName(category.value)

  await store.createTask(
    title.value,
    categoryId,
    startDate.value || null,
    dueDate.value || null,
    priority.value || null
  )
  router.push('/todos')
}
</script>

<template>
  <!-- Desktop View - Using Same Design as Mobile -->
  <section class="page-container desktop-view">
    <!-- Hero Banner with Illustration -->
    <div class="desktop-hero-banner">
      <div class="hero-text-content">
        <h3>Create a new task</h3>
        <p>Add the details below to stay organized and get things done.</p>
      </div>
      <div class="hero-illustration">
        <svg width="140" height="140" viewBox="0 0 120 120" fill="none">
          <!-- Plant pot -->
          <ellipse cx="35" cy="95" rx="15" ry="8" fill="#86EFAC"/>
          <rect x="25" y="75" width="20" height="20" rx="2" fill="#4ADE80"/>
          <!-- Leaves -->
          <path d="M35 75 Q30 65 35 55" stroke="#22C55E" stroke-width="3" fill="none"/>
          <ellipse cx="30" cy="60" rx="8" ry="12" fill="#4ADE80" transform="rotate(-20 30 60)"/>
          <ellipse cx="40" cy="60" rx="8" ry="12" fill="#4ADE80" transform="rotate(20 40 60)"/>

          <!-- Clipboard -->
          <rect x="55" y="30" width="50" height="65" rx="4" fill="#3B82F6"/>
          <rect x="60" y="35" width="40" height="55" rx="2" fill="white"/>
          <!-- Clip -->
          <rect x="75" y="28" width="10" height="8" rx="2" fill="#2563EB"/>
          <!-- Check marks -->
          <path d="M68 45 L72 49 L78 43" stroke="#93C5FD" stroke-width="2" fill="none" stroke-linecap="round"/>
          <line x1="82" y1="46" x2="95" y2="46" stroke="#DBEAFE" stroke-width="2" stroke-linecap="round"/>
          <path d="M68 57 L72 61 L78 55" stroke="#93C5FD" stroke-width="2" fill="none" stroke-linecap="round"/>
          <line x1="82" y1="58" x2="95" y2="58" stroke="#DBEAFE" stroke-width="2" stroke-linecap="round"/>
          <circle cx="70" cy="70" r="2" fill="#DBEAFE"/>
          <line x1="75" y1="70" x2="95" y2="70" stroke="#DBEAFE" stroke-width="2" stroke-linecap="round"/>

          <!-- Plus button -->
          <circle cx="95" cy="85" r="12" fill="#2563EB"/>
          <path d="M95 79 L95 91 M89 85 L101 85" stroke="white" stroke-width="2.5" stroke-linecap="round"/>

          <!-- Decorative elements -->
          <circle cx="20" cy="30" r="3" fill="#DBEAFE" opacity="0.6"/>
          <circle cx="105" cy="25" r="2" fill="#DBEAFE" opacity="0.6"/>
          <path d="M15 45 L18 48 L15 51" stroke="#DBEAFE" stroke-width="1.5" fill="none" opacity="0.6"/>
        </svg>
      </div>
    </div>

    <!-- Desktop Form with Same Design -->
    <div class="desktop-form-card">
      <!-- Error Message Display -->
      <div v-if="store.error" class="error-message" style="margin-bottom: 24px;">
        <svg style="width: 18px; height: 18px; flex-shrink: 0;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ store.error }}
      </div>

      <form @submit.prevent="handleSubmit">
        <!-- Row 1: Title and Category -->
        <div class="desktop-field">
          <label class="desktop-label">Title <span class="required-star">*</span></label>
          <div class="desktop-input-wrapper">
            <svg class="input-icon" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <input
              v-model="title"
              type="text"
              placeholder="e.g. Buy groceries"
              class="desktop-input"
              required
            />
          </div>
        </div>

        <div class="desktop-field">
          <label class="desktop-label">Category</label>
          <div class="category-with-add">
            <div class="desktop-select-wrapper">
              <svg class="select-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#8B5CF6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <select v-model="category" class="desktop-select">
                <option value="">Select category</option>
                <option v-for="catName in categoryStore.categoryNames" :key="catName" :value="catName">
                  {{ catName }}
                </option>
              </select>
              <svg class="chevron-down" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <button
              @click="showNewListModal = true"
              type="button"
              class="add-category-btn-desktop"
              :disabled="categoryStore.loading"
              title="Add new category"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <!-- Document/List -->
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <!-- List items -->
                <line x1="9" y1="13" x2="15" y2="13"></line>
                <line x1="9" y1="17" x2="15" y2="17"></line>
                <!-- Plus sign -->
                <line x1="16" y1="19" x2="22" y2="19"></line>
                <line x1="19" y1="16" x2="19" y2="22"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Row 2: Priority, Due Date, Due Time -->
        <div class="desktop-field">
          <label class="desktop-label">Priority</label>
          <div class="desktop-select-wrapper">
            <svg class="select-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#EF4444">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
            <select v-model="priority" class="desktop-select">
              <option value="">Select priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <svg class="chevron-down" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div class="desktop-field">
          <label class="desktop-label">Start Date & Time</label>
          <div class="desktop-select-wrapper">
            <svg class="select-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#10B981">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <input
              v-model="startDate"
              type="datetime-local"
              class="desktop-select"
            />
            <svg class="chevron-down" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div class="desktop-field">
          <label class="desktop-label">Due Date & Time</label>
          <div class="desktop-select-wrapper">
            <svg class="select-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#3B82F6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              v-model="dueDate"
              type="datetime-local"
              class="desktop-select"
              :min="startDate || new Date().toISOString().slice(0, 16)"
            />
            <svg class="chevron-down" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <!-- Row 3: Description (full width) -->
        <div class="desktop-field desktop-field-full">
          <label class="desktop-label">Description</label>
          <div class="desktop-input-wrapper">
            <svg class="input-icon" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <textarea
              v-model="description"
              placeholder="Add more details about this task..."
              class="desktop-textarea"
              rows="3"
            ></textarea>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="desktop-form-actions">
          <router-link to="/todos" class="btn-cancel-desktop">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </router-link>
          <button type="submit" class="btn-submit-desktop" :disabled="store.loading">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ store.loading ? 'Creating...' : 'Create Task' }}
          </button>
        </div>
      </form>
    </div>
  </section>

  <!-- Mobile View -->
  <section class="mobile-task-page">
    <!-- Mobile Header -->
    <div class="mobile-header">
      <button @click="goBack" class="back-btn">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h2 class="mobile-header-title">New Task</h2>
      <button class="save-icon-btn" type="button">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
      </button>
    </div>

    <!-- Hero Banner with Illustration -->
    <div class="mobile-hero-banner">
      <div class="hero-text-content">
        <h3>Create a new task</h3>
        <p>Add the details below to stay organized and get things done.</p>
      </div>
      <div class="hero-illustration">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <!-- Plant pot -->
          <ellipse cx="35" cy="95" rx="15" ry="8" fill="#86EFAC"/>
          <rect x="25" y="75" width="20" height="20" rx="2" fill="#4ADE80"/>
          <!-- Leaves -->
          <path d="M35 75 Q30 65 35 55" stroke="#22C55E" stroke-width="3" fill="none"/>
          <ellipse cx="30" cy="60" rx="8" ry="12" fill="#4ADE80" transform="rotate(-20 30 60)"/>
          <ellipse cx="40" cy="60" rx="8" ry="12" fill="#4ADE80" transform="rotate(20 40 60)"/>

          <!-- Clipboard -->
          <rect x="55" y="30" width="50" height="65" rx="4" fill="#3B82F6"/>
          <rect x="60" y="35" width="40" height="55" rx="2" fill="white"/>
          <!-- Clip -->
          <rect x="75" y="28" width="10" height="8" rx="2" fill="#2563EB"/>
          <!-- Check marks -->
          <path d="M68 45 L72 49 L78 43" stroke="#93C5FD" stroke-width="2" fill="none" stroke-linecap="round"/>
          <line x1="82" y1="46" x2="95" y2="46" stroke="#DBEAFE" stroke-width="2" stroke-linecap="round"/>
          <path d="M68 57 L72 61 L78 55" stroke="#93C5FD" stroke-width="2" fill="none" stroke-linecap="round"/>
          <line x1="82" y1="58" x2="95" y2="58" stroke="#DBEAFE" stroke-width="2" stroke-linecap="round"/>
          <circle cx="70" cy="70" r="2" fill="#DBEAFE"/>
          <line x1="75" y1="70" x2="95" y2="70" stroke="#DBEAFE" stroke-width="2" stroke-linecap="round"/>

          <!-- Plus button -->
          <circle cx="95" cy="85" r="12" fill="#2563EB"/>
          <path d="M95 79 L95 91 M89 85 L101 85" stroke="white" stroke-width="2.5" stroke-linecap="round"/>

          <!-- Decorative elements -->
          <circle cx="20" cy="30" r="3" fill="#DBEAFE" opacity="0.6"/>
          <circle cx="105" cy="25" r="2" fill="#DBEAFE" opacity="0.6"/>
          <path d="M15 45 L18 48 L15 51" stroke="#DBEAFE" stroke-width="1.5" fill="none" opacity="0.6"/>
        </svg>
      </div>
    </div>

    <!-- Mobile Form -->
    <form @submit.prevent="handleSubmit" class="mobile-form">
      <!-- Title -->
      <div class="mobile-field">
        <label class="mobile-label">Title <span class="required-star">*</span></label>
        <div class="mobile-input-wrapper">
          <svg class="input-icon" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <input
            v-model="title"
            type="text"
            placeholder="e.g. Buy groceries"
            class="mobile-input"
            required
          />
        </div>
      </div>

      <!-- Description -->
      <div class="mobile-field">
        <label class="mobile-label">Description</label>
        <div class="mobile-input-wrapper">
          <svg class="input-icon" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <textarea
            v-model="description"
            placeholder="Add more details about this task..."
            class="mobile-textarea"
            rows="3"
          ></textarea>
        </div>
      </div>

      <!-- Category & Priority Row -->
      <div class="mobile-row">
        <div class="mobile-field mobile-half">
          <label class="mobile-label">Category</label>
          <div class="mobile-select-wrapper">
            <svg class="select-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#8B5CF6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <select v-model="category" class="mobile-select">
              <option value="">Select category</option>
              <option v-for="catName in categoryStore.categoryNames" :key="catName" :value="catName">
                {{ catName }}
              </option>
            </select>
            <svg class="chevron-down" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div class="mobile-field mobile-half">
          <label class="mobile-label">Priority</label>
          <div class="mobile-select-wrapper">
            <svg class="select-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#EF4444">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
            <select v-model="priority" class="mobile-select">
              <option value="">Select priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <svg class="chevron-down" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Start and Due Date Row -->
      <div class="mobile-row">
        <div class="mobile-field mobile-half">
          <label class="mobile-label">Start Date & Time</label>
          <div class="mobile-select-wrapper">
            <svg class="select-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#10B981">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <input
              v-model="startDate"
              type="datetime-local"
              class="mobile-select"
            />
            <svg class="chevron-down" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div class="mobile-field mobile-half">
          <label class="mobile-label">Due Date & Time</label>
          <div class="mobile-select-wrapper">
            <svg class="select-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#3B82F6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              v-model="dueDate"
              type="datetime-local"
              class="mobile-select"
              :min="startDate || new Date().toISOString().slice(0, 16)"
            />
            <svg class="chevron-down" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Create Task Button -->
      <button type="submit" class="mobile-create-btn" :disabled="store.loading">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ store.loading ? 'Creating...' : 'Create Task' }}
      </button>
    </form>
  </section>

  <!-- New List Modal -->
  <Teleport to="body">
    <div v-if="showNewListModal" class="modal-backdrop">
      <div class="modal-card">
        <h3 class="modal-title" style="text-align: left; font-size: 16px; margin-bottom: 16px;">New Category</h3>

        <!-- Error Message Display -->
        <div v-if="categoryStore.error" class="error-alert" style="margin-bottom: 16px;">
          <svg style="width: 20px; height: 20px; flex-shrink: 0;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ categoryStore.error }}</span>
        </div>

        <input
          v-model="newListName"
          type="text"
          placeholder="Enter Category Name"
          class="search-input"
          style="width: 100%; margin-bottom: 24px; padding: 12px;"
          @keyup.enter="handleAddCategory"
          @input="categoryStore.error = null"
        />
        <div class="modal-actions" style="justify-content: flex-end; gap: 12px;">
          <button @click="closeModal" class="btn modal-cancel-btn" style="border: none; background: transparent; padding: 8px 16px;">Cancel</button>
          <button @click="handleAddCategory" class="btn btn-primary" style="padding: 8px 24px; border-radius: 999px;" :disabled="categoryStore.loading">
            {{ categoryStore.loading ? 'Adding...' : 'Add' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* Desktop View - Show only on desktop */
.desktop-view {
  display: block;
}

.mobile-task-page {
  display: none;
}

/* ====================== DESKTOP UNIFIED DESIGN ====================== */

/* Desktop Hero Banner */
.desktop-hero-banner {
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  padding: 32px 40px;
  margin-bottom: 24px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  min-height: 160px;
}

.hero-text-content {
  flex: 1;
  z-index: 2;
}

.hero-text-content h3 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-white);
  margin: 0 0 8px 0;
}

.hero-text-content p {
  font-size: 15px;
  color: var(--text-white);
  margin: 0;
  line-height: 1.6;
}

.hero-illustration {
  z-index: 1;
}

/* Desktop Form Card */
.desktop-form-card {
  background-color: white;
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 48px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.desktop-form-card form {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 28px 24px;
  max-width: 100%;
}

/* Row 1: Title (2 cols) + Category (2 cols) */
.desktop-field:nth-child(1) {
  grid-column: span 2;
}

.desktop-field:nth-child(2) {
  grid-column: span 2;
}

/* Row 2: Priority (1 col) + Start Date (1.5 cols) + Due Date (1.5 cols) */
.desktop-field:nth-child(3) {
  grid-column: span 1;
}

.desktop-field:nth-child(4) {
  grid-column: span 1;
}

.desktop-field:nth-child(5) {
  grid-column: span 2;
}

/* Row 3: Description (full width) */
.desktop-field-full {
  grid-column: 1 / -1;
}

/* Form actions span full width */
.desktop-form-actions {
  grid-column: 1 / -1;
}

.desktop-field {
  margin-bottom: 0; /* Grid gap handles spacing */
}

.desktop-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #6B7280;
  margin-bottom: 10px;
}

.required-star {
  color: #EF4444;
}

.desktop-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: #9CA3AF;
  pointer-events: none;
  z-index: 1;
}

.desktop-input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  color: var(--text-dark);
  background-color: white;
  transition: all 0.2s ease;
}

.desktop-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.desktop-input::placeholder {
  color: #9CA3AF;
}

.desktop-textarea {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  color: var(--text-dark);
  background-color: white;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease;
  line-height: 1.6;
}

.desktop-textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.desktop-textarea::placeholder {
  color: #9CA3AF;
}

/* Desktop Select */
.desktop-select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
}

/* Category with Add Button */
.category-with-add {
  display: flex;
  gap: 10px;
  align-items: stretch;
}

.add-category-btn-desktop {
  width: 48px;
  height: auto;
  min-height: 48px;
  background: linear-gradient(135deg, var(--primary) 0%, #2563EB 100%);
  border: none;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
}

.add-category-btn-desktop:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px -2px rgba(59, 130, 246, 0.4);
}

.add-category-btn-desktop:active:not(:disabled) {
  transform: translateY(0);
}

.add-category-btn-desktop:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.select-icon {
  position: absolute;
  left: 16px;
  pointer-events: none;
  z-index: 1;
}

.chevron-down {
  position: absolute;
  right: 16px;
  color: #9CA3AF;
  pointer-events: none;
  z-index: 1;
}

.desktop-select {
  width: 100%;
  padding: 14px 44px 14px 48px;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  color: var(--text-dark);
  background-color: white;
  appearance: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.desktop-select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Desktop Reminder Toggle */
.desktop-reminder {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #F9FAFB;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
  margin-bottom: 24px;
}

.reminder-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.reminder-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: #EDE9FE;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8B5CF6;
  flex-shrink: 0;
}

.reminder-text {
  display: flex;
  flex-direction: column;
}

.reminder-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 4px;
}

.reminder-subtitle {
  font-size: 13px;
  color: #9CA3AF;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #E5E7EB;
  transition: 0.3s;
  border-radius: 28px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #3B82F6;
}

input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

/* Desktop Form Actions */
.desktop-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 16px;
  padding-top: 32px;
  border-top: 1px solid #E5E7EB;
}

.btn-cancel-desktop {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  border: 1px solid #E5E7EB;
  background-color: white;
  color: var(--text-dark);
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-cancel-desktop:hover {
  background-color: #F9FAFB;
  border-color: #D1D5DB;
}

.btn-submit-desktop {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  border: none;
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  color: white;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
}

.btn-submit-desktop:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px -2px rgba(59, 130, 246, 0.4);
}

.btn-submit-desktop:active:not(:disabled) {
  transform: translateY(0);
}

.btn-submit-desktop:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background-color: #FEF2F2;
  border: 2px solid #FCA5A5;
  border-radius: 12px;
  color: #991B1B;
  font-size: 14px;
  font-weight: 500;
  animation: slideDown 0.3s ease-out;
}

/* Error Alert */
.error-alert {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: #FEF2F2;
  border: 1px solid #FCA5A5;
  border-radius: 8px;
  color: #991B1B;
  font-size: 14px;
  font-weight: 500;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Modal Styles */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(17, 24, 39, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.2s ease-out;
}

.modal-card {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  padding: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* ====================== MOBILE STYLES ====================== */
@media (max-width: 768px) {
  .desktop-view {
    display: none !important;
  }

  .mobile-task-page {
    display: block;
    min-height: 100vh;
    background-color: #F9FAFB;
    padding-bottom: 90px;
  }

  /* Mobile Header */
  .mobile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background-color: white;
    border-bottom: 1px solid #E5E7EB;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .back-btn,
  .save-icon-btn {
    background: none;
    border: none;
    color: var(--text-dark);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mobile-header-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-dark);
    margin: 0;
  }

  /* Hero Banner */
  .mobile-hero-banner {
    background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
    padding: 24px 20px;
    margin: 0 20px 20px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
    min-height: 140px;
  }

  .hero-text-content {
    flex: 1;
    z-index: 2;
  }

  .hero-text-content h3 {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-dark);
    margin: 0 0 8px 0;
  }

  .hero-text-content p {
    font-size: 13px;
    color: #6B7280;
    margin: 0;
    line-height: 1.5;
  }

  .hero-illustration {
    position: absolute;
    right: -10px;
    bottom: -10px;
    z-index: 1;
  }

  /* Mobile Form */
  .mobile-form {
    padding: 0 20px;
  }

  .mobile-field {
    margin-bottom: 20px;
  }

  .mobile-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #6B7280;
    margin-bottom: 8px;
  }

  .required-star {
    color: #EF4444;
  }

  .mobile-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-icon {
    position: absolute;
    left: 14px;
    color: #9CA3AF;
    pointer-events: none;
    z-index: 1;
  }

  .mobile-input {
    width: 100%;
    padding: 12px 14px 12px 44px;
    border: 1px solid #E5E7EB;
    border-radius: 12px;
    font-size: 14px;
    font-family: inherit;
    color: var(--text-dark);
    background-color: white;
  }

  .mobile-input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .mobile-input::placeholder {
    color: #9CA3AF;
  }

  .mobile-textarea {
    width: 100%;
    padding: 12px 14px 12px 44px;
    border: 1px solid #E5E7EB;
    border-radius: 12px;
    font-size: 14px;
    font-family: inherit;
    color: var(--text-dark);
    background-color: white;
    resize: vertical;
    min-height: 80px;
  }

  .mobile-textarea:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .mobile-textarea::placeholder {
    color: #9CA3AF;
  }

  /* Mobile Row */
  .mobile-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 20px;
  }

  .mobile-half {
    margin-bottom: 0;
  }

  /* Mobile Select */
  .mobile-select-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .select-icon {
    position: absolute;
    left: 14px;
    pointer-events: none;
    z-index: 1;
  }

  .chevron-down {
    position: absolute;
    right: 14px;
    color: #9CA3AF;
    pointer-events: none;
    z-index: 1;
  }

  .mobile-select {
    width: 100%;
    padding: 12px 40px 12px 44px;
    border: 1px solid #E5E7EB;
    border-radius: 12px;
    font-size: 14px;
    font-family: inherit;
    color: var(--text-dark);
    background-color: white;
    appearance: none;
    cursor: pointer;
  }

  .mobile-select:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  /* Mobile Reminder Toggle */
  .mobile-reminder {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: white;
    padding: 16px;
    border-radius: 12px;
    border: 1px solid #E5E7EB;
    margin-bottom: 20px;
  }

  .reminder-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .reminder-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background-color: #EDE9FE;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8B5CF6;
    flex-shrink: 0;
  }

  .reminder-text {
    display: flex;
    flex-direction: column;
  }

  .reminder-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 2px;
  }

  .reminder-subtitle {
    font-size: 12px;
    color: #9CA3AF;
  }

  /* Toggle Switch */
  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 48px;
    height: 26px;
  }

  .toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #E5E7EB;
    transition: 0.3s;
    border-radius: 26px;
  }

  .toggle-slider:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
  }

  input:checked + .toggle-slider {
    background-color: #3B82F6;
  }

  input:checked + .toggle-slider:before {
    transform: translateX(22px);
  }

  /* Mobile Create Button */
  .mobile-create-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 24px;
    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
  }

  .mobile-create-btn:active:not(:disabled) {
    transform: scale(0.98);
  }

  .mobile-create-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
