<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Login to Your Account</h2>

      <div v-if="authStore.error" class="error-message">
        {{ authStore.error }}
      </div>

      <form novalidate @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter your email"
            :class="{ 'input-error': errors.email }"
            @input="errors.email = ''"
          />
          <div v-if="errors.email" class="error-text">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ errors.email }}
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            :class="{ 'input-error': errors.password }"
            @input="errors.password = ''"
          />
          <div v-if="errors.password" class="error-text">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ errors.password }}
          </div>
        </div>

        <button
          type="submit"
          class="btn-primary"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <p class="auth-switch">
        Don't have an account?
        <router-link to="/register">Register here</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const errors = ref({})

const validate = () => {
  errors.value = {}
  
  if (!email.value) {
    errors.value.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'Please enter a valid email address'
  }

  if (!password.value) {
    errors.value.password = 'Password is required'
  }

  return Object.keys(errors.value).length === 0
}

const handleLogin = async () => {
  if (!validate()) return

  const result = await authStore.login(email.value, password.value)
  
  if (result.success) {
    router.push('/todos')
  }
}
</script>
