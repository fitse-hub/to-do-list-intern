import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('@/views/LandingView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresGuest: true } // Only for non-authenticated users
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { requiresGuest: true } // Only for non-authenticated users
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/todos',
      name: 'todos',
      component: () => import('@/views/TodoView.vue'),
      meta: { requiresAuth: true }
    },

    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('@/views/ReportsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('@/views/CalendarView.vue'),
      meta: { requiresAuth: true }
    }
  ],
})

/**
 * ============================================
 * NAVIGATION GUARD - Protect Routes
 * ============================================
 *
 * This runs BEFORE every route change
 *
 * Logic:
 * 1. If route requires auth + user not logged in → redirect to login
 * 2. If route requires guest + user logged in → redirect to todos
 * 3. Otherwise → allow navigation
 */
router.beforeEach((to) => {
  const authStore = useAuthStore()

  // Route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/login' // Redirect to login
  }
  // Route is for guests only (login/register)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return '/dashboard' // Redirect to dashboard
  }
  
  // Implicitly returns undefined to allow navigation
})

export default router

