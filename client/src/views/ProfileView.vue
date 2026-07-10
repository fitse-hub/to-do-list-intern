<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useReportStore } from '@/stores/reportStore'
import { useI18n } from 'vue-i18n'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Bar, Doughnut, Line } from 'vue-chartjs'
import SkeletonLoader from '@/components/common/SkeletonLoader.vue'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const authStore = useAuthStore()
const reportStore = useReportStore()
const router = useRouter()
const { t } = useI18n()

const showEditModal = ref(false)
const name = ref('')
const currentPassword = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const successMessage = ref('')

const filters = ref({
  timeRange: 'monthly',
  startDate: '',
  endDate: ''
})

const fetchReports = () => {
  reportStore.fetchStatistics(filters.value)
}

onMounted(async () => {
  if (authStore.user) {
    name.value = authStore.user.name
  }
  fetchReports()
})

watch(() => filters.value.timeRange, (newVal) => {
  if (newVal !== 'custom') {
    fetchReports()
  }
})

const handleCustomDateSearch = () => {
  if (filters.value.startDate && filters.value.endDate) {
    fetchReports()
  }
}

const handleUpdate = async () => {
  successMessage.value = ''

  const payload = {
    name: name.value
  }

  if (password.value) {
    payload.current_password = currentPassword.value
    payload.password = password.value
    payload.password_confirmation = passwordConfirmation.value
  }

  const result = await authStore.updateProfile(payload)

  if (result.success) {
    successMessage.value = t('profile.modal.success_msg')
    currentPassword.value = ''
    password.value = ''
    passwordConfirmation.value = ''
    setTimeout(() => {
      successMessage.value = ''
      showEditModal.value = false
    }, 1500)
  }
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  }
}

// Chart Data Logic
const totalTasks = computed(() => reportStore.summary.total || 0)
const completedTasks = computed(() => reportStore.summary.completed || 0)
const pendingTasks = computed(() => reportStore.summary.todo || 0)
const failedTasks = computed(() => reportStore.summary.failed || 0)

const getPct = (val) => {
  if (totalTasks.value === 0) return 0;
  return ((val / totalTasks.value) * 100).toFixed(1)
}

const tasksOverviewData = computed(() => {
  return {
    labels: [t('profile.stats.completed'), t('profile.stats.todo'), t('profile.stats.overdue')],
    datasets: [{
      backgroundColor: ['#22C55E', '#F97316', '#EF4444'],
      data: [completedTasks.value, pendingTasks.value, failedTasks.value],
      borderWidth: 0,
      cutout: '75%'
    }]
  }
})

const tasksByCategoryData = computed(() => {
  const labels = Object.keys(reportStore.categoryPerformance || {});
  const data = labels.map(l => reportStore.categoryPerformance[l].completed);
  const colors = ['#3B82F6', '#22C55E', '#A855F7', '#F97316', '#EF4444', '#14B8A6'];
  const bgColors = labels.map((_, i) => colors[i % colors.length]);

  return {
    labels: labels.length > 0 ? labels : ['No Data'],
    datasets: [{
      backgroundColor: labels.length > 0 ? bgColors : ['#E5E7EB'],
      data: labels.length > 0 ? data : [1],
      borderRadius: 4,
      maxBarThickness: 24
    }]
  }
})

const completionRateData = computed(() => {
  const comp = completedTasks.value;
  const rem = Math.max(0, totalTasks.value - comp);
  return {
    labels: [t('profile.stats.completed'), 'Remaining'],
    datasets: [{
      backgroundColor: ['#22C55E', '#E5E7EB'],
      data: [comp, rem],
      borderWidth: 0,
      cutout: '80%'
    }]
  }
})

const productivityTrendData = computed(() => {
  const dates = Object.keys(reportStore.dailyActivity || {}).sort();
  const completed = dates.map(d => reportStore.dailyActivity[d].completed);

  return {
    labels: dates.length > 0 ? dates.map(d => d.slice(5)) : ['No Data'],
    datasets: [{
      label: t('profile.stats.completed'),
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      data: dates.length > 0 ? completed : [0],
      tension: 0.4,
      pointRadius: 4,
      borderWidth: 2,
      fill: true
    }]
  }
})

</script>

<template>
  <div class="profile-layout">
    <!-- Main Left Column -->
    <div class="profile-main">
      <!-- Profile Header Card -->
      <div class="profile-header-card">
        <template v-if="!authStore.user">
          <div class="profile-info-group" style="width: 100%;">
            <SkeletonLoader type="circle" width="96px" height="96px" />
            <div class="profile-details" style="flex: 1;">
              <SkeletonLoader width="200px" height="28px" style="margin-bottom: 8px;" />
              <SkeletonLoader width="150px" height="20px" style="margin-bottom: 12px;" />
              <SkeletonLoader width="100px" height="24px" borderRadius="6px" />
            </div>
            <SkeletonLoader width="140px" height="40px" borderRadius="6px" class="desktop-only" />
          </div>
        </template>
        <template v-else>
        <div class="profile-info-group">
          <div class="avatar-large-container">
            <div class="avatar-large">
              <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" alt="User Avatar" class="avatar-img" />
              <!-- Placeholder avatar mimicking the design -->
              <div v-else class="avatar-placeholder">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User Avatar" class="avatar-img" />
              </div>
            </div>
            <button class="camera-btn">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
          </div>
          <div class="profile-details">
            <h2>{{ authStore.user?.name || 'Qaal Tewla' }}</h2>
            <p class="profile-email">{{ authStore.user?.email || 'qaal.tewla@example.com' }}</p>
            <span class="plan-badge">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="14" height="14" style="margin-right:4px"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              {{ t('profile.plan_badge') }}
            </span>
          </div>
        </div>
        <!-- Mobile: show edit as arrow on card, not a button -->
        <button class="btn btn-outline edit-profile-btn desktop-only" @click="showEditModal = true">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16" style="margin-right: 6px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          {{ t('profile.edit_profile_btn') }}
        </button>
        <!-- Mobile arrow button -->
        <button class="mobile-card-arrow mobile-only" @click="showEditModal = true">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
        </template>
      </div>

      <!-- Stats Grid -->
      <div class="profile-stats-grid">
        <template v-if="reportStore.initialLoading">
          <div v-for="i in 4" :key="i" class="profile-stat-card">
            <div class="p-stat-icon-wrap" style="background-color: transparent;">
              <SkeletonLoader width="48px" height="48px" borderRadius="12px" />
            </div>
            <div class="p-stat-info" style="width: 100%; display: flex; flex-direction: column; align-items: center;">
              <SkeletonLoader width="60px" height="14px" style="margin-bottom: 8px;" />
              <SkeletonLoader width="40px" height="28px" />
            </div>
          </div>
        </template>
        <template v-else>
        <div class="profile-stat-card">
          <div class="p-stat-icon-wrap" style="background-color: #EFF6FF; color: #3B82F6;">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <div class="p-stat-info">
            <span class="p-stat-label">{{ t('profile.stats.total_tasks') }}</span>
            <span class="p-stat-value" style="color: #3B82F6;">{{ totalTasks }}</span>
          </div>
        </div>
        <div class="profile-stat-card">
          <div class="p-stat-icon-wrap" style="background-color: #F0FDF4; color: #22C55E;">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div class="p-stat-info">
            <span class="p-stat-label">{{ t('profile.stats.completed') }}</span>
            <span class="p-stat-value" style="color: #22C55E;">{{ completedTasks }}</span>
          </div>
        </div>
        <div class="profile-stat-card">
          <div class="p-stat-icon-wrap" style="background-color: #FFF7ED; color: #F97316;">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div class="p-stat-info">
            <span class="p-stat-label">{{ t('profile.stats.todo') }}</span>
            <span class="p-stat-value" style="color: #F97316;">{{ pendingTasks }}</span>
          </div>
        </div>
        <div class="profile-stat-card">
          <div class="p-stat-icon-wrap" style="background-color: #F5F3FF; color: #A855F7;">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <div class="p-stat-info">
            <span class="p-stat-label">{{ t('profile.stats.overdue') }}</span>
            <span class="p-stat-value" style="color: #EF4444;">{{ failedTasks }}</span>
          </div>
        </div>
        </template>
      </div>

      <!-- Settings Columns -->
      <div class="settings-grid">
        <!-- Account Column -->
        <div class="settings-column">
          <h3 class="settings-col-title">{{ t('profile.account.title') }}</h3>
          <div class="settings-list">
            <div class="settings-item" @click="showEditModal = true">
              <div class="s-icon" style="background: #EFF6FF; color: #3B82F6;"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></div>
              <div class="s-info">
                <span class="s-title">{{ t('profile.account.edit_profile') }}</span>
                <span class="s-desc">{{ t('profile.account.edit_profile_desc') }}</span>
              </div>
              <div class="s-action"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="chevron-right"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></div>
            </div>
            <div class="settings-item" @click="showEditModal = true">
              <div class="s-icon" style="background: #EFF6FF; color: #3B82F6;"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></div>
              <div class="s-info">
                <span class="s-title">{{ t('profile.account.change_password') }}</span>
                <span class="s-desc">{{ t('profile.account.change_password_desc') }}</span>
              </div>
              <div class="s-action"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="chevron-right"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></div>
            </div>
            <div class="settings-item">
              <div class="s-icon" style="background: #EFF6FF; color: #3B82F6;"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg></div>
              <div class="s-info">
                <span class="s-title">{{ t('profile.account.theme') }}</span>
                <span class="s-desc">{{ t('profile.account.theme_desc') }}</span>
              </div>
              <div class="s-action theme-toggle" @click.stop>
                <div class="t-btn active"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg></div>
                <div class="t-btn"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Preferences Column -->
        <div class="settings-column">
          <h3 class="settings-col-title">{{ t('profile.preferences.title') }}</h3>
          <div class="settings-list">
            <div class="settings-item">
              <div class="s-icon" style="background: #EFF6FF; color: #3B82F6;"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg></div>
              <div class="s-info">
                <span class="s-title">{{ t('profile.preferences.notifications') }}</span>
                <span class="s-desc">{{ t('profile.preferences.notifications_desc') }}</span>
              </div>
              <div class="s-action"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="chevron-right"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></div>
            </div>
            <div class="settings-item">
              <div class="s-icon" style="background: #EFF6FF; color: #3B82F6;"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>
              <div class="s-info">
                <span class="s-title">{{ t('profile.preferences.task_settings') }}</span>
                <span class="s-desc">{{ t('profile.preferences.task_settings_desc') }}</span>
              </div>
              <div class="s-action"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="chevron-right"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></div>
            </div>
            <div class="settings-item">
              <div class="s-icon" style="background: #EFF6FF; color: #3B82F6;"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></div>
              <div class="s-info">
                <span class="s-title">{{ t('profile.preferences.privacy_security') }}</span>
                <span class="s-desc">{{ t('profile.preferences.privacy_security_desc') }}</span>
              </div>
              <div class="s-action"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="chevron-right"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></div>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- Reports Sidebar -->
    <div class="profile-sidebar">
      <div class="ps-header">
        <h3 class="ps-title">{{ t('profile.sidebar.reports_title') }}</h3>
        <select v-model="filters.timeRange" class="ps-dropdown-select">
          <option value="all">{{ t('reports.filters.all_time') }}</option>
          <option value="today">{{ t('reports.filters.today') }}</option>
          <option value="weekly">{{ t('reports.filters.this_week') }}</option>
          <option value="monthly">{{ t('reports.filters.this_month') }}</option>
          <option value="custom">{{ t('reports.filters.custom_range') }}</option>
        </select>
      </div>

      <div v-if="filters.timeRange === 'custom'" class="ps-custom-dates" style="margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; gap: 8px;">
          <input type="date" v-model="filters.startDate" class="search-input" style="padding: 6px; font-size: 12px; height: 32px; width: 100%;" />
          <input type="date" v-model="filters.endDate" class="search-input" style="padding: 6px; font-size: 12px; height: 32px; width: 100%;" />
        </div>
        <button @click="handleCustomDateSearch" class="btn btn-primary" style="padding: 6px; font-size: 13px;">{{ t('reports.filters.apply') }}</button>
      </div>

      <div class="ps-card">
        <h4 class="ps-card-title">{{ t('profile.sidebar.tasks_overview') }}</h4>
        <div class="overview-chart-wrapper">
          <template v-if="reportStore.initialLoading">
            <SkeletonLoader type="circle" width="140px" height="140px" />
            <div class="overview-legend" style="width: 100%;">
              <SkeletonLoader v-for="i in 4" :key="i" width="100%" height="16px" style="margin-bottom: 12px;" />
            </div>
          </template>
          <template v-else>
          <div class="donut-chart-container" style="position: relative; width: 140px; height: 140px;">
            <Doughnut :data="tasksOverviewData" :options="chartOptions" />
            <div class="donut-center">
              <span class="dc-value">{{ totalTasks }}</span>
              <span class="dc-label">{{ t('profile.sidebar.total') }}</span>
            </div>
          </div>
          <div class="overview-legend">
            <div class="legend-item"><span class="l-dot" style="background:#22C55E"></span><span class="l-label">{{ t('profile.stats.completed') }}</span><span class="l-val">{{ completedTasks }} ({{ getPct(completedTasks) }}%)</span></div>
            <div class="legend-item"><span class="l-dot" style="background:#F97316"></span><span class="l-label">{{ t('profile.stats.todo') }}</span><span class="l-val">{{ pendingTasks }} ({{ getPct(pendingTasks) }}%)</span></div>
            <div class="legend-item"><span class="l-dot" style="background:#EF4444"></span><span class="l-label">{{ t('profile.stats.overdue') }}</span><span class="l-val">{{ failedTasks }} ({{ getPct(failedTasks) }}%)</span></div>
            <div class="legend-item"><span class="l-dot" style="background:#8B5CF6"></span><span class="l-label">{{ t('profile.stats.total_tasks') }}</span><span class="l-val">{{ totalTasks }} (100%)</span></div>
          </div>
          </template>
        </div>
      </div>

      <div class="ps-card">
        <h4 class="ps-card-title">{{ t('profile.sidebar.tasks_by_category') }}</h4>
        <div style="height: 180px; margin-top: 16px;">
          <SkeletonLoader v-if="reportStore.initialLoading" width="100%" height="100%" borderRadius="8px" />
          <Bar v-else :data="tasksByCategoryData" :options="{...chartOptions, scales: { x: { grid: {display: false} }, y: { display: false } }, plugins: { legend: { display: false } }}" />
        </div>
      </div>

      <div class="ps-card">
        <h4 class="ps-card-title">{{ t('profile.sidebar.completion_rate') }}</h4>
        <div class="completion-rate-wrapper">
          <template v-if="reportStore.initialLoading">
            <SkeletonLoader type="circle" width="80px" height="80px" />
            <div class="cr-info" style="flex: 1;">
              <SkeletonLoader width="80px" height="16px" style="margin-bottom: 8px;" />
              <SkeletonLoader width="100%" height="12px" style="margin-bottom: 4px;" />
              <SkeletonLoader width="80%" height="12px" />
            </div>
          </template>
          <template v-else>
          <div class="completion-radial">
            <Doughnut :data="completionRateData" :options="{...chartOptions, cutout: '80%'}" />
            <div class="radial-center">
              <span class="rc-value">{{ getPct(completedTasks) }}%</span>
            </div>
          </div>
          <div class="cr-info">
            <h5>{{ getPct(completedTasks) >= 50 ? t('profile.sidebar.msg_great') : t('profile.sidebar.msg_push') }}</h5>
            <p>{{ t('profile.sidebar.msg_completed').replace('{comp}', completedTasks).replace('{total}', totalTasks) }}</p>
          </div>
          </template>
        </div>
      </div>

      <div class="ps-card">
        <h4 class="ps-card-title">{{ t('profile.sidebar.productivity_trend') }}</h4>
        <div style="height: 160px; margin-top: 16px;">
          <SkeletonLoader v-if="reportStore.initialLoading" width="100%" height="100%" borderRadius="8px" />
          <Line v-else :data="productivityTrendData" :options="{...chartOptions, scales: { y: { display: false }, x: { grid: { display: false } } }}" />
        </div>
      </div>

      <button class="btn btn-outline ps-full-report-btn" @click="router.push('/reports')" style="margin-top: 8px;">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16" style="margin-right: 6px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
        {{ t('profile.sidebar.view_full_report') }}
      </button>

    </div>

    <!-- Edit Profile Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
      <div class="modal-content form-card" style="max-width: 500px; width: 100%;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <h3 class="form-section-title" style="margin: 0;">{{ t('profile.modal.edit_profile') }}</h3>
          <button class="icon-btn" @click="showEditModal = false"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>

        <div v-if="successMessage" class="status-pill status-completed" style="margin-bottom: 24px; display: block; text-align: center; font-size: 14px;">
          {{ successMessage }}
        </div>
        <div v-if="authStore.error" class="error-message" style="margin-bottom: 24px;">
          {{ authStore.error }}
        </div>

        <form @submit.prevent="handleUpdate">
          <div class="form-group">
            <label for="profile-name">{{ t('profile.modal.full_name') }}</label>
            <input id="profile-name" v-model="name" type="text" class="search-input" style="width: 100%; max-width: none;" required />
          </div>

          <h3 class="form-section-title" style="margin-top: 32px; border-top: 1px solid var(--border-light); padding-top: 24px;">{{ t('profile.modal.change_password') }}</h3>
          <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 16px;">{{ t('profile.modal.leave_blank') }}</p>

          <div class="form-group">
            <label for="profile-current-password">{{ t('profile.modal.current_password') }}</label>
            <input id="profile-current-password" v-model="currentPassword" type="password" class="search-input" style="width: 100%; max-width: none;" />
          </div>

          <div class="form-row" style="margin-bottom: 0;">
            <div class="form-group">
              <label for="profile-password">{{ t('profile.modal.new_password') }}</label>
              <input id="profile-password" v-model="password" type="password" class="search-input" style="width: 100%; max-width: none;" />
            </div>
            <div class="form-group">
              <label for="profile-password-confirm">{{ t('profile.modal.confirm_password') }}</label>
              <input id="profile-password-confirm" v-model="passwordConfirmation" type="password" class="search-input" style="width: 100%; max-width: none;" />
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn" @click="showEditModal = false">{{ t('buttons.cancel') }}</button>
            <button type="submit" class="btn btn-primary" :disabled="authStore.loading">
              {{ authStore.loading ? t('profile.modal.saving') : t('profile.modal.update_btn') }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* ===== RESPONSIVE VISIBILITY ===== */
.mobile-only {
  display: none;
}

.profile-layout {
  display: flex;
  gap: 24px;
  padding: 24px 40px;
  background-color: #F9FAFB;
  min-height: calc(100vh - 73px);
  margin: -40px; /* Counteract page-content padding if needed, or adjust padding */
}

.profile-main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-page-header {
  margin-bottom: 8px;
}
.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px 0;
}

/* Profile Header Card */
.profile-header-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.profile-header-card::before {
  content: '';
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  background-image: url('data:image/svg+xml;utf8,<svg width="400" height="200" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M400 0H200C200 110.457 289.543 200 400 200V0Z" fill="%23EFF6FF"/></svg>');
  background-position: right top;
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0.8;
  pointer-events: none;
}
.profile-info-group {
  display: flex;
  align-items: center;
  gap: 24px;
  z-index: 1;
}
.avatar-large-container {
  position: relative;
}
.avatar-large {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: #E0E7FF;
  border: 4px solid #EFF6FF;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.avatar-placeholder img, .avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.camera-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: white;
  border: 1px solid #E5E7EB;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #3B82F6;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.profile-details h2 {
  margin: 0 0 4px 0;
  font-size: 20px;
  color: #111827;
}
.profile-email {
  margin: 0 0 12px 0;
  color: #6B7280;
  font-size: 14px;
}
.plan-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  background: #EFF6FF;
  color: #3B82F6;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}
.edit-profile-btn {
  z-index: 1;
  display: flex;
  align-items: center;
  font-weight: 600;
  background: white;
}

/* Stats Grid */
.profile-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.profile-stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.p-stat-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
}
.p-stat-info {
  text-align: center;
  display: flex;
  flex-direction: column;
}
.p-stat-label {
  font-size: 13px;
  color: #6B7280;
  font-weight: 500;
  margin-bottom: 4px;
}
.p-stat-value {
  font-size: 24px;
  font-weight: 700;
}

/* Settings Columns */
.settings-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
.settings-column {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.settings-col-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 16px 0;
}
.settings-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.settings-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #F3F4F6;
  cursor: pointer;
  transition: all 0.2s;
}
.settings-item:hover {
  background: #F9FAFB;
  border-color: #E5E7EB;
}
.s-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  flex-shrink: 0;
}
.s-icon svg {
  width: 20px;
  height: 20px;
}
.s-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.s-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}
.s-desc {
  font-size: 12px;
  color: #9CA3AF;
}
.s-action {
  color: #9CA3AF;
  display: flex;
  align-items: center;
}
.chevron-right {
  width: 16px;
  height: 16px;
}
.theme-toggle {
  display: flex;
  background: #F3F4F6;
  border-radius: 6px;
  padding: 2px;
}
.t-btn {
  padding: 4px 8px;
  border-radius: 4px;
  color: #9CA3AF;
}
.t-btn.active {
  background: white;
  color: #3B82F6;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}
.t-btn svg { width: 14px; height: 14px; }

/* Reports Sidebar */
.profile-sidebar {
  width: 340px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.ps-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}
.ps-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}
.ps-dropdown-select {
  font-size: 13px;
  font-weight: 500;
  color: #3B82F6;
  background: white;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #E5E7EB;
  cursor: pointer;
  outline: none;
  font-family: inherit;
}
.ps-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.ps-card-title {
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: #111827;
}

/* Sidebar Charts */
.overview-chart-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.donut-center, .radial-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.dc-value {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}
.dc-label {
  font-size: 12px;
  color: #6B7280;
}
.overview-legend {
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.legend-item {
  display: flex;
  align-items: center;
  font-size: 12px;
}
.l-dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  margin-right: 8px;
}
.l-label {
  color: #4B5563;
  flex-grow: 1;
}
.l-val {
  font-weight: 600;
  color: #111827;
}
.completion-rate-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
}
.completion-radial {
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}
.rc-value {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}
.cr-info h5 {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #111827;
}
.cr-info p {
  margin: 0;
  font-size: 12px;
  color: #6B7280;
  line-height: 1.4;
}
.ps-full-report-btn {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #3B82F6;
  border-color: #BFDBFE;
  background: #EFF6FF;
  font-weight: 600;
}
.ps-full-report-btn:hover {
  background: #DBEAFE;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
  max-height: 90vh;
  overflow-y: auto;
}

@media (max-width: 1200px) {
  .profile-layout {
    flex-direction: column;
  }
  .profile-sidebar {
    width: 100%;
  }
  .settings-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile layout matching the design image */
@media (max-width: 768px) {
  .desktop-only {
    display: none !important;
  }
  .mobile-only {
    display: flex !important;
  }

  .profile-layout {
    padding: 16px;
    margin: -20px;
    gap: 16px;
    background: #F5F6FA;
    overflow-x: hidden;
  }

  /* Profile card: horizontal, compact, with arrow */
  .profile-header-card {
    padding: 18px 16px;
    border-radius: 16px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .profile-header-card::before {
    display: none;
  }
  .profile-info-group {
    gap: 14px;
    align-items: center;
  }
  .avatar-large {
    width: 72px;
    height: 72px;
    border-width: 3px;
  }
  .camera-btn {
    width: 24px;
    height: 24px;
  }
  .profile-details h2 {
    font-size: 17px;
    margin-bottom: 2px;
  }
  .profile-email {
    font-size: 12px;
    margin-bottom: 8px;
  }
  .plan-badge {
    font-size: 11px;
    padding: 3px 8px;
  }
  .mobile-card-arrow {
    color: #9CA3AF;
    background: none;
    border: none;
    cursor: pointer;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
  }

  /* Stats: keep 4-column inline layout matching image */
  .profile-stats-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    background: white;
    border-radius: 16px;
    padding: 16px 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .profile-stat-card {
    box-shadow: none;
    border-radius: 0;
    padding: 8px 4px;
    border-right: 1px solid #F3F4F6;
  }
  .profile-stat-card:last-child {
    border-right: none;
  }
  .p-stat-icon-wrap {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    margin-bottom: 8px;
  }
  .p-stat-icon-wrap svg {
    width: 18px;
    height: 18px;
  }
  .p-stat-value {
    font-size: 18px;
  }
  .p-stat-label {
    font-size: 11px;
  }

  /* Settings: stack vertically (Account first, then Preferences) */
  .settings-grid {
    grid-template-columns: 1fr;
    gap: 0;
    background: transparent;
  }
  .settings-column {
    border-radius: 0;
    padding: 0;
    box-shadow: none;
    background: transparent;
  }
  .settings-col-title {
    font-size: 14px;
    font-weight: 600;
    color: #6B7280;
    padding: 16px 0 8px 0;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .settings-list {
    gap: 0;
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .settings-item {
    border-radius: 0;
    border: none;
    border-bottom: 1px solid #F3F4F6;
    padding: 14px 16px;
  }
  .settings-item:last-child {
    border-bottom: none;
  }
  .s-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
  }
  .s-icon svg {
    width: 16px;
    height: 16px;
  }
  .s-title {
    font-size: 14px;
  }
  .s-desc {
    font-size: 11px;
  }

  /* Reports sidebar → full width section below settings */
  .profile-sidebar {
    width: 100%;
    gap: 12px;
  }
  .ps-header {
    padding: 0;
    margin-bottom: 0;
  }
  .ps-title {
    font-size: 16px;
    font-weight: 700;
    color: #111827;
  }
  .ps-card {
    padding: 16px;
    border-radius: 12px;
  }
  .ps-card-title {
    font-size: 13px;
    margin-bottom: 12px;
  }

  /* Overview chart: side by side on mobile */
  .overview-chart-wrapper {
    flex-direction: row;
    align-items: center;
    gap: 16px;
  }
  .donut-chart-container {
    width: 120px !important;
    height: 120px !important;
    flex-shrink: 0;
  }
  .overview-legend {
    margin-top: 0;
    gap: 8px;
  }
  .legend-item {
    font-size: 11px;
  }

  /* Completion rate */
  .completion-rate-wrapper {
    gap: 12px;
  }
  .completion-radial {
    width: 70px;
    height: 70px;
  }
  .rc-value {
    font-size: 13px;
  }
  .cr-info h5 {
    font-size: 13px;
  }
  .cr-info p {
    font-size: 11px;
  }

  .ps-full-report-btn {
    padding: 12px;
    font-size: 14px;
  }
}
</style>
