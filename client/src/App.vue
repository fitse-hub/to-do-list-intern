<script setup>
import { ref } from 'vue'
import { useAuthStore } from './stores/authStore'
import { useRouter } from 'vue-router'
import LogoutConfirmation from '@/components/LogoutConfirmation.vue'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'

const authStore = useAuthStore()
const router = useRouter()
const isSidebarOpen = ref(window.innerWidth > 768)
const showLogoutConfirm = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const handleLogout = async () => {
  showLogoutConfirm.value = false
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div id="app">
    <div v-if="authStore.isAuthenticated" :class="['sidebar-overlay', { 'active': isSidebarOpen }]" @click="isSidebarOpen = false"></div>

    <aside v-if="authStore.isAuthenticated" :class="['sidebar', { 'sidebar-collapsed': !isSidebarOpen, 'mobile-open': isSidebarOpen }]">
      <div class="sidebar-header">
        <div class="logo">
          <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 16V8l4 4 4-4v8"/></svg>
          <span v-show="isSidebarOpen">MyTodo</span>
        </div>
        <div class="menu-label" v-show="isSidebarOpen">MENU</div>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/dashboard" class="nav-item" active-class="active">
          <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          <span v-show="isSidebarOpen">{{ $t('navigation.dashboard') }}</span>
        </router-link>
        <router-link to="/todos" class="nav-item" active-class="active">
          <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
          <span v-show="isSidebarOpen">{{ $t('navigation.tasks') }}</span>
        </router-link>
        <router-link to="/reports" class="nav-item" active-class="active">
          <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          <span v-show="isSidebarOpen">{{ $t('navigation.reports') }}</span>
        </router-link>
        <router-link to="/profile" class="nav-item" active-class="active">
          <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <span v-show="isSidebarOpen">{{ $t('navigation.profile') }}</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <button @click="showLogoutConfirm = true" class="nav-item" style="color: var(--danger-text);">
          <svg class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          <span v-show="isSidebarOpen">{{ $t('navigation.logout') }}</span>
        </button>
      </div>
    </aside>

    <main v-if="authStore.isAuthenticated" class="main-content">
      <div class="topbar">
        <div class="topbar-left">
          <button @click="toggleSidebar" class="menu-toggle-btn">
            <svg class="top-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
        <div class="topbar-right">
          <LanguageSwitcher />
          <button class="notification-btn">
            <svg class="top-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <span class="notification-dot"></span>
          </button>
        </div>
      </div>

      <div class="page-content">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>

      <nav class="bottom-nav">
        <router-link to="/dashboard" class="b-nav-item" active-class="active">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span>{{ $t('navigation.dashboard') }}</span>
        </router-link>
        <router-link to="/todos" class="b-nav-item" active-class="active">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
          <span>{{ $t('navigation.tasks') }}</span>
        </router-link>
        <router-link to="/reports" class="b-nav-item" active-class="active">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          <span>{{ $t('navigation.reports') }}</span>
        </router-link>
        <router-link to="/profile" class="b-nav-item" active-class="active">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <span>{{ $t('navigation.profile') }}</span>
        </router-link>
      </nav>
    </main>

    <router-view v-else v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <!-- Logout Confirmation Modal -->
    <LogoutConfirmation
      :show="showLogoutConfirm"
      @cancel="showLogoutConfirm = false"
      @confirm="handleLogout"
    />
  </div>
</template>
