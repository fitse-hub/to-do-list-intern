<script setup>
import { ref } from 'vue'
import { useTaskStore } from '@/stores/taskStore'

const store = useTaskStore()
const title = ref('')
const titleError = ref('')

const handleSubmit = async () => {
  titleError.value = ''
  if (!title.value.trim()) {
    titleError.value = 'Please enter a task title'
    return
  }
  await store.createTask(title.value)
  title.value = ''
}
</script>

<template>
  <form novalidate @submit.prevent="handleSubmit" class="controls-bar" style="flex-wrap: wrap;">
    <div style="position: relative; flex: 1; min-width: 200px;">
      <input
        v-model="title"
        type="text"
        placeholder="Search or add new task by name..."
        class="search-input"
        :class="{ 'input-error': titleError }"
        @input="titleError = ''"
        style="width: 100%;"
      />
      <div v-if="titleError" class="error-text" style="position: absolute; bottom: -22px; left: 0;">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ titleError }}
      </div>
    </div>
    <select class="search-input" style="max-width: 150px; background-color: var(--card-bg);">
      <option>Sort by Date</option>
      <option>Sort by Name</option>
    </select>

    <select class="search-input" style="max-width: 150px; background-color: var(--card-bg);">
      <option>Active Only</option>
      <option>All Tasks</option>
    </select>

    <button type="submit" class="btn btn-primary" style="margin-left: auto;">
      Add Task
    </button>
  </form>
</template>
