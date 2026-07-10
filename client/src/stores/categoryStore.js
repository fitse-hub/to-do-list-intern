import { defineStore } from 'pinia'
import api from '@/services/api'
import { useAuthStore } from './authStore'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    loading: false,
    error: null,
  }),

  getters: {
    categoryNames: (state) => {
      // Ensure categories is always an array
      if (!Array.isArray(state.categories)) {
        return []
      }
      return state.categories.map(c => c.name)
    },
    getCategoryIdByName: (state) => (name) => {
      // Ensure categories is always an array
      if (!Array.isArray(state.categories)) {
        return null
      }
      const category = state.categories.find(c => c.name === name)
      return category ? category.id : null
    }
  },

  actions: {
    async fetchCategories() {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) return

      this.loading = true
      this.error = null

      try {
        const response = await api.get('/categories')
        // Ensure we always set an array
        this.categories = Array.isArray(response.data) ? response.data : []
      } catch (err) {
        this.error = 'Failed to load categories'
        this.categories = [] // Reset to empty array on error
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async createCategory(name) {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) return

      this.loading = true
      this.error = null

      try {
        const response = await api.post('/categories', { name })
        this.categories.push(response.data)
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to create category'
        console.error(err)
        return false
      } finally {
        this.loading = false
      }
    },

    async updateCategory(id, name) {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) return false

      this.loading = true
      this.error = null

      try {
        const response = await api.put(`/categories/${id}`, { name })
        
        // Update local state
        const index = this.categories.findIndex(c => c.id === id)
        if (index !== -1) {
          this.categories[index] = response.data
        }
        
        // Refetch tasks so they reflect the updated category name
        const { useTaskStore } = await import('./taskStore')
        const taskStore = useTaskStore()
        await taskStore.fetchTasks()
        
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to update category'
        console.error(err)
        return false
      } finally {
        this.loading = false
      }
    }
  }
})
