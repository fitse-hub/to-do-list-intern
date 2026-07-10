<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Create New Account</h2>

      <div v-if="authStore.error" class="error-message">
        {{ authStore.error }}
      </div>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="name">name</label>
          <input id="name" v-model="name" type="text" placeholder="Enter your name" required/>
        </div>

        <div class="form-group">
          <label for="email">email</label>
          <input id="email" v-model="email" type="email" placeholder="Enter your email" required />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" v-model="password" type="password" placeholder="Enter password (min 8 characters)" required minlength="8" />
        </div>

        <div class="form-group">
          <label for="password_confirmation">Confirm Password</label>
          <input
            id="password_confirmation"
            v-model="passwordConfirmation"
            type="password"
            placeholder="Confirm your password"
            required
          />
        </div>

        <div v-if="password && passwordConfirmation && password !== passwordConfirmation" class="warning-message">
          Passwords do not match!
        </div>

        <button
          type="submit"
          class="btn-primary"
          :disabled="authStore.loading || password !== passwordConfirmation"
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

const handleRegister = async () => {
  if (password.value !== passwordConfirmation.value) {
    return
  }

  const result = await authStore.register(
    name.value,
    email.value,
    password.value,
    passwordConfirmation.value
  )

  if (result.success) {
    router.push('/dashboard')
  }
}
</script>
