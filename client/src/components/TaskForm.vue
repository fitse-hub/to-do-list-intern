<script setup>
import { ref } from 'vue'
import { useTaskStore } from '@/stores/taskStore'

const store = useTaskStore()
const title = ref('')

const handleSubmit = async () => {
  if (!title.value.trim()) return
  await store.createTask(title.value)
  title.value = ''
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="controls-bar">
    <input
      v-model="title"
      type="text"
      placeholder="Search or add new task by name..."
      class="search-input"
    />
    <select class="search-input" style="max-width: 150px; background-color: white;">
      <option>Sort by Date</option>
      <option>Sort by Name</option>
    </select>

    <select class="search-input" style="max-width: 150px; background-color: white;">
      <option>Active Only</option>
      <option>All Tasks</option>
    </select>

    <button type="submit" class="btn btn-primary" style="margin-left: auto;">
      Add Task
    </button>
  </form>
</template>
