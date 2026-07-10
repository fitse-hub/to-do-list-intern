import { defineStore } from 'pinia'
import api from "@/services/api";

export const useTaskStore = defineStore('tasks' , {
  state: () => ({
    tasks: [],
    loading: false,        // true only during fetchTasks API call
    initialLoading: false, // true only on first fetch when no cached data exists
    hasFetched: false,     // tracks whether we've fetched at least once
    error: null,
  }),
  getters: {
  completedTasks(state) {
    return state.tasks.filter(
      task => task.completed
    );
  },

  todoTasks(state) {
    return state.tasks.filter(
      task => task.status === 'todo'
    );
  },

  failedTasks(state) {
    return state.tasks.filter(
      task => task.status === 'failed'
    );
  },

  totalTasks(state) {
    return state.tasks.length;
  },
},
actions: {
  async fetchTasks() {
    try {
      // Only show skeleton on the very first load when there's no data
      if (!this.hasFetched && this.tasks.length === 0) {
        this.initialLoading = true;
      }
      this.loading = true;
      this.error = null;

      const response =
        await api.get("/tasks");

      this.tasks = response.data;
      this.hasFetched = true;
    }
    catch (error) {
      this.error = error.message;
      console.error('Error fetching tasks:', error);
    }
    finally {
      this.loading = false;
      this.initialLoading = false;
    }
  },
  async createTask(title, categoryId = null, startDate = null, dueDate = null, priority = null) {
  try {
    this.error = null;

    const response = await api.post('/tasks', {
      title: title,
      category_id: categoryId,
      start_date: startDate || undefined,
      due_date: dueDate || undefined,
      priority: priority || undefined,
    });

    this.tasks.push(response.data);
  }
  catch (error) {
    this.error = error.response?.data?.message || error.message;
    console.error('Error creating task:', error);
  }
},
async deleteTask(id) {
  try {
    this.error = null;

    await api.delete(`/tasks/${id}`);

    this.tasks = this.tasks.filter(
      task => task.id !== id
    );
  }
  catch (error) {
    this.error = error.message;
    console.error('Error deleting task:', error);
  }
},
async updateTask(task) {
  try {
    this.error = null;

    const response =
      await api.put(
        `/tasks/${task.id}`,
        task
      );

    const index =
      this.tasks.findIndex(
        t => t.id === task.id
      );

    this.tasks[index] =
      response.data;
  }
  catch (error) {
    this.error = error.message;
    console.error('Error updating task:', error);
  }
},
async toggleTask(id) {
  try {
    this.error = null;

    const response =
      await api.patch(
        `/tasks/${id}/toggle`
      );

    const index =
      this.tasks.findIndex(
        task => task.id === id
      );

    this.tasks[index] =
      response.data;
  }
  catch (error) {
    this.error = error.message;
    console.error('Error toggling task:', error);
  }
}
}
})

