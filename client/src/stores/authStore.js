import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // User data from backend
    user: null,

    // Authentication token
    token: localStorage.getItem('token') || null,

    // Loading state for login/register
    loading: false,

    // Error messages
    error: null,
  }),

  getters: {
    /**
     * Check if user is logged in
     * User is authenticated if we have a token
     */
    isAuthenticated(state) {
      return !!state.token
    },

    /**
     * Get current user's name
     */
    userName(state) {
      return state.user?.name || 'Guest'
    }
  },

  actions: {
    /**
     * ============================================
     * REGISTER - Create New Account
     * ============================================
     *
     * What happens:
     * 1. Send user data to backend
     * 2. Backend creates user and returns token
     * 3. Save token to localStorage (persists after page reload)
     * 4. Set axios default header for future requests
     * 5. Save user data to state
     */
    async register(name, email, password, passwordConfirmation) {
      try {
        this.loading = true
        this.error = null

        const response = await api.post('/register', {
          name,
          email,
          password,
          password_confirmation: passwordConfirmation
        })

        // Save token and user
        this.token = response.data.token
        this.user = response.data.user

        // Save token to localStorage (survives page refresh)
        localStorage.setItem('token', this.token)

        // Set token in axios headers for all future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Registration failed'
        console.error('Registration error:', error)
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    /**
     * ============================================
     * LOGIN - Authenticate Existing User
     * ============================================
     *
     * Same flow as register but for existing users
     */
    async login(email, password) {
      try {
        this.loading = true
        this.error = null

        const response = await api.post('/login', {
          email,
          password
        })

        // Save token and user
        this.token = response.data.token
        this.user = response.data.user

        // Persist token
        localStorage.setItem('token', this.token)

        // Set axios header
        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
        console.error('Login error:', error)
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    /**
     * ============================================
     * LOGOUT - Clear Authentication
     * ============================================
     *
     * What happens:
     * 1. Tell backend to delete token
     * 2. Clear token from localStorage
     * 3. Clear token from axios headers
     * 4. Clear user data from state
     */
    async logout() {
      try {
        this.loading = true

        // Tell backend to delete token
        await api.post('/logout')

        // Clear everything
        this.token = null
        this.user = null
        localStorage.removeItem('token')
        delete api.defaults.headers.common['Authorization']

        return { success: true }
      } catch (error) {
        console.error('Logout error:', error)

        // Even if backend fails, clear frontend state
        this.token = null
        this.user = null
        localStorage.removeItem('token')
        delete api.defaults.headers.common['Authorization']

        return { success: true }
      } finally {
        this.loading = false
      }
    },

    /**
     * ============================================
     * UPDATE PROFILE
     * ============================================
     */
    async updateProfile(profileData) {
      try {
        this.loading = true
        this.error = null

        const response = await api.put('/me', profileData)
        this.user = response.data.user

        return { success: true }
      } catch (error) {
        this.error = error.response?.data?.message || 'Profile update failed'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    /**
     * ============================================
     * FETCH USER - Get Current User Info
     * ============================================
     *
     * Called when app loads to restore user data
     * We have token from localStorage, but need user info
     */
    async fetchUser() {
      try {
        const response = await api.get('/me')
        this.user = response.data.user
      } catch (error) {
        console.error('Fetch user error:', error)
        // If token is invalid, logout
        this.logout()
      }
    },

    /**
     * ============================================
     * INIT - Initialize Auth on App Load
     * ============================================
     *
     * Called when app starts
     * If we have token in localStorage, set it in axios
     * Then fetch user data
     */
    initAuth() {
      if (this.token) {
        // Set token in axios headers
        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

        // Fetch user data
        this.fetchUser()
      }
    }
  }
})
