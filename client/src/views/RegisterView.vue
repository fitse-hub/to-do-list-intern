<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Create New Account</h2>

      <div v-if="authStore.error" class="error-message">
        {{ authStore.error }}
      </div>

      <form novalidate @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="name">Name</label>
          <input
            id="name"
            v-model="name"
            type="text"
            placeholder="Enter your name"
            :class="{ 'input-error': errors.name }"
            @input="errors.name = ''"
          />
          <div v-if="errors.name" class="error-text">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ errors.name }}
          </div>
        </div>

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
            placeholder="Enter password (min 8 characters)"
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

        <div class="form-group">
          <label for="password_confirmation">Confirm Password</label>
          <input
            id="password_confirmation"
            v-model="passwordConfirmation"
            type="password"
            placeholder="Confirm your password"
            :class="{ 'input-error': errors.passwordConfirmation }"
            @input="errors.passwordConfirmation = ''"
          />
          <div v-if="errors.passwordConfirmation" class="error-text">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ errors.passwordConfirmation }}
          </div>
        </div>

        <button
          type="submit"
          class="btn-primary"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? 'Creating Account...' : 'Register' }}
        </button>
      </form>

      <p class="auth-switch">
        Already have an account?
        <router-link to="/login">Login here</router-link>
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

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const errors = ref({})

const validate = () => {
  errors.value = {}
  
  if (!name.value.trim()) {
    errors.value.name = 'Name is required'
  }

  if (!email.value) {
    errors.value.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'Please enter a valid email address'
  }

  if (!password.value) {
    errors.value.password = 'Password is required'
  } else if (password.value.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
  }

  if (!passwordConfirmation.value) {
    errors.value.passwordConfirmation = 'Please confirm your password'
  } else if (password.value !== passwordConfirmation.value) {
    errors.value.passwordConfirmation = 'Passwords do not match'
  }

  return Object.keys(errors.value).length === 0
}

const handleRegister = async () => {
  if (!validate()) return

  const result = await authStore.register(
    name.value,
    email.value,
    password.value,
    passwordConfirmation.value
  )

  if (result.success) {
    router.push('/todos')
  }
}
</script>
