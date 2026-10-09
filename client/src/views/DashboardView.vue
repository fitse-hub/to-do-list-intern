<script setup>
import { onMounted, computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
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
} from 'chart.js';
import { Bar, Pie, Line } from 'vue-chartjs';
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
);

const taskStore = useTaskStore()
const authStore = useAuthStore()
const reportStore = useReportStore()
const { t } = useI18n()

onMounted(() => {
  taskStore.fetchTasks()
  reportStore.fetchStatistics({ timeRange: 'all' })
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return t('dashboard.greeting.morning')
  if (hour < 17) return t('dashboard.greeting.afternoon')
  return t('dashboard.greeting.evening')
})

const total     = computed(() => taskStore.tasks.length)
const completed = computed(() => taskStore.completedTasks.length)
const todo      = computed(() => taskStore.todoTasks.length)
const failed    = computed(() => taskStore.failedTasks.length)
const rate      = computed(() => total.value > 0 ? Math.round((completed.value / total.value) * 100) : 0)

const byCategory = computed(() => {
  const map = {}
  taskStore.tasks.forEach(t => {
    let cat = 'General'
    if (t.category) {
      cat = typeof t.category === 'string' ? t.category : (t.category.name || 'General')
    }
    if (!map[cat]) map[cat] = 0
    map[cat]++
  })
  return Object.entries(map).map(([name, count]) => ({ name, count }))
})

const recentTasks = computed(() => {
  return [...taskStore.tasks].slice(-5).reverse()
})

const categoryColors = {
  General:  { bg: 'var(--stat-blue-bg)', color: 'var(--stat-blue-text)' },
  Work:     { bg: 'var(--stat-yellow-bg)', color: 'var(--stat-yellow-text)' },
  Personal: { bg: 'var(--stat-green-bg)', color: 'var(--stat-green-text)' },
  Urgent:   { bg: 'var(--stat-red-bg)', color: 'var(--stat-red-text)' },
}
const getCategoryStyle = (cat) => {
  const c = categoryColors[cat] || categoryColors['General']
  return `background-color: ${c.bg}; color: ${c.color};`
}

// Chart Data Computed Properties
const categoryChartData = computed(() => {
  const labels = Object.keys(reportStore.categoryPerformance);
  const completedData = labels.map(l => reportStore.categoryPerformance[l].completed);
  const failedData = labels.map(l => reportStore.categoryPerformance[l].failed);
  
  return {
    labels,
    datasets: [
      {
        label: t('dashboard.chart_labels.completed'),
        backgroundColor: '#22C55E',
        data: completedData
      },
      {
        label: t('dashboard.chart_labels.failed'),
        backgroundColor: '#EF4444',
        data: failedData
      }
    ]
  };
});

const statusPieData = computed(() => {
  return {
    labels: [t('dashboard.chart_labels.completed'), t('dashboard.chart_labels.todo'), t('dashboard.chart_labels.failed')],
    datasets: [
      {
        backgroundColor: ['#22C55E', '#3B82F6', '#EF4444'],
        data: [
          reportStore.summary.completed,
          reportStore.summary.todo,
          reportStore.summary.failed
        ]
      }
    ]
  };
});

const dailyTrendData = computed(() => {
  const dates = Object.keys(reportStore.dailyActivity).sort();
  const created = dates.map(d => reportStore.dailyActivity[d].created);
  const completed = dates.map(d => reportStore.dailyActivity[d].completed);

  return {
    labels: dates,
    datasets: [
      {
        label: t('dashboard.chart_labels.created'),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        data: created,
        tension: 0.3,
        fill: true
      },
      {
        label: t('dashboard.chart_labels.completed'),
        borderColor: '#22C55E',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        data: completed,
        tension: 0.3,
        fill: true
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>

<template>
  <section class="page-container" style="padding-top: 0;">
    <div class="hero-banner">
      <div class="hero-content">
        <h2>{{ greeting }}, {{ authStore.userName.split(' ')[0] || 'User' }}!</h2>
        <p>{{ t('dashboard.hero_subtitle') }}</p>
      </div>
      <div class="hero-illustration">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; transform: scale(1.1); transform-origin: bottom right;">
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#1E3A8A" flood-opacity="0.3"/>
            </filter>
            <filter id="light-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#1E3A8A" flood-opacity="0.15"/>
            </filter>

            <linearGradient id="clipboard-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#60A5FA"/>
              <stop offset="100%" stop-color="#3B82F6"/>
            </linearGradient>

            <linearGradient id="paper-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#FFFFFF"/>
              <stop offset="100%" stop-color="#F1F5F9"/>
            </linearGradient>

            <linearGradient id="cup-grad" x1="0" y1="0" x2="1" y2="0.8">
              <stop offset="0%" stop-color="#60A5FA"/>
              <stop offset="100%" stop-color="#2563EB"/>
            </linearGradient>

            <linearGradient id="leaf-grad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#86EFAC"/>
              <stop offset="100%" stop-color="#22C55E"/>
            </linearGradient>

            <linearGradient id="leaf-grad2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#4ADE80"/>
              <stop offset="100%" stop-color="#16A34A"/>
            </linearGradient>

            <linearGradient id="pot-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#E2E8F0"/>
              <stop offset="100%" stop-color="#CBD5E1"/>
            </linearGradient>
          </defs>

          <ellipse cx="100" cy="180" rx="70" ry="15" fill="#1E40AF" opacity="0.4" filter="blur(4px)" />

          <g filter="url(#shadow)">
            <rect x="60" y="30" width="100" height="130" rx="12" fill="url(#clipboard-grad)" />
            <rect x="70" y="25" width="80" height="130" rx="8" fill="url(#paper-grad)" />

            <rect x="90" y="15" width="40" height="20" rx="6" fill="#94A3B8" />
            <circle cx="110" cy="25" r="4" fill="#334155" />
            <rect x="80" y="30" width="60" height="8" rx="4" fill="#CBD5E1" />

            <rect x="85" y="55" width="16" height="16" rx="4" fill="#3B82F6" />
            <path d="M89 63L92 66L97 59" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="110" y="58" width="30" height="4" rx="2" fill="#CBD5E1" />
            <rect x="110" y="66" width="20" height="4" rx="2" fill="#E2E8F0" />

            <rect x="85" y="85" width="16" height="16" rx="4" fill="#3B82F6" />
            <path d="M89 93L92 96L97 89" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="110" y="88" width="25" height="4" rx="2" fill="#CBD5E1" />
            <rect x="110" y="96" width="30" height="4" rx="2" fill="#E2E8F0" />

            <rect x="85" y="115" width="16" height="16" rx="4" fill="#3B82F6" />
            <path d="M89 123L92 126L97 119" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="110" y="118" width="30" height="4" rx="2" fill="#CBD5E1" />
            <rect x="110" y="126" width="15" height="4" rx="2" fill="#E2E8F0" />
          </g>

          <g filter="url(#light-shadow)">
            <path d="M40 145 C 30 120, 50 110, 55 130 C 50 140, 45 145, 40 145 Z" fill="url(#leaf-grad1)" />
            <path d="M45 145 C 55 110, 80 110, 70 135 C 65 145, 55 145, 45 145 Z" fill="url(#leaf-grad2)" />
            <path d="M35 145 C 20 130, 25 120, 40 135 Z" fill="url(#leaf-grad1)" />

            <path d="M32 145 L 68 145 L 63 170 C 63 175, 60 178, 50 178 C 40 178, 37 175, 37 170 Z" fill="url(#pot-grad)" />
            <rect x="30" y="145" width="40" height="6" rx="3" fill="#FFFFFF" />
          </g>

          <g filter="url(#shadow)">
            <path d="M165 135 C 185 135, 185 160, 165 160" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" />
            <path d="M135 125 L 165 125 L 160 170 C 160 175, 155 178, 150 178 C 145 178, 140 175, 140 170 Z" fill="url(#cup-grad)" />
            <ellipse cx="150" cy="125" rx="15" ry="6" fill="#FFFFFF" />
            <ellipse cx="150" cy="126" rx="12" ry="4" fill="#8B4513" />
          </g>

          <path d="M20 70 Q 25 70, 25 65 Q 25 70, 30 70 Q 25 70, 25 75 Q 25 70, 20 70" fill="#FEF08A" />
          <path d="M170 80 Q 175 80, 175 75 Q 175 80, 180 80 Q 175 80, 175 85 Q 175 80, 170 80" fill="#FEF08A" opacity="0.6" />
        </svg>
      </div>
    </div>

    <div class="stat-grid">
      <template v-if="taskStore.initialLoading">
        <div v-for="i in 4" :key="i" class="stat-card">
          <div class="stat-top">
            <SkeletonLoader width="48px" height="48px" borderRadius="12px" />
          </div>
          <div class="stat-info" style="margin-top: 16px; width: 100%;">
            <SkeletonLoader width="60%" height="14px" style="margin-bottom: 8px;" />
            <SkeletonLoader width="40px" height="28px" />
          </div>
        </div>
      </template>
      <template v-else>
      <div class="stat-card" style="--curve-color: rgba(59, 130, 246, 0.05);">
        <div class="stat-top">
          <div class="stat-icon-wrap bg-blue-soft text-blue">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="22" height="22"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <button class="menu-dots"><svg fill="currentColor" viewBox="0 0 20 20" width="16"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"/></svg></button>
        </div>
        <div class="stat-info">
          <span class="stat-label">{{ t('dashboard.stats.total_tasks') }}</span>
          <span class="stat-value">{{ total }}</span>
        </div>
      </div>

      <div class="stat-card" style="--curve-color: rgba(34, 197, 94, 0.05);">
        <div class="stat-top">
          <div class="stat-icon-wrap bg-green-soft text-green">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="22" height="22"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <button class="menu-dots"><svg fill="currentColor" viewBox="0 0 20 20" width="16"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"/></svg></button>
        </div>
        <div class="stat-info">
          <span class="stat-label">{{ t('dashboard.stats.completed') }}</span>
          <span class="stat-value text-green">{{ completed }}</span>
        </div>
      </div>

      <div class="stat-card" style="--curve-color: rgba(239, 68, 68, 0.05);">
        <div class="stat-top">
          <div class="stat-icon-wrap bg-red-soft text-red">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="22" height="22"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <button class="menu-dots"><svg fill="currentColor" viewBox="0 0 20 20" width="16"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"/></svg></button>
        </div>
        <div class="stat-info">
          <span class="stat-label">{{ t('dashboard.stats.todo') }}</span>
          <span class="stat-value text-red">{{ todo }}</span>
        </div>
      </div>

      <div class="stat-card" style="--curve-color: rgba(234, 179, 8, 0.05);">
        <div class="stat-top">
          <div class="stat-icon-wrap bg-yellow-soft text-yellow">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="22" height="22"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <button class="menu-dots"><svg fill="currentColor" viewBox="0 0 20 20" width="16"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"/></svg></button>
        </div>
        <div class="stat-info">
          <span class="stat-label">{{ t('dashboard.stats.failed') }}</span>
          <span class="stat-value text-red">{{ failed }}</span>
        </div>
      </div>
      </template>
    </div>

    <div class="dashboard-cols">

      <div class="dash-card">
        <div class="dash-card-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div class="card-icon bg-purple-soft text-purple">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
            </div>
            <h3 class="dash-card-title">{{ t('dashboard.sections.tasks_by_category') }}</h3>
          </div>
          <router-link to="/todos" class="view-all">{{ t('dashboard.view_all') }} <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="12"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></router-link>
        </div>

        <template v-if="taskStore.initialLoading">
          <div v-for="i in 3" :key="i" class="cat-row" style="opacity: 0.7;">
            <SkeletonLoader width="70px" height="24px" borderRadius="12px" />
            <div class="cat-bar-wrap">
              <SkeletonLoader width="100%" height="8px" borderRadius="4px" />
            </div>
            <SkeletonLoader width="20px" height="16px" />
          </div>
        </template>
        <template v-else>
        <div v-if="byCategory.length === 0" class="dash-empty">
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 35H80V80C80 82.7614 77.7614 85 75 85H25C22.2386 85 20 82.7614 20 80V35Z" fill="#93C5FD"/>
            <path d="M30 25H70V45H30V25Z" fill="#E0F2FE"/>
            <rect x="35" y="30" width="30" height="4" fill="#BAE6FD"/>
            <rect x="35" y="38" width="20" height="4" fill="#BAE6FD"/>
          </svg>
          <h4>{{ t('dashboard.empty.no_tasks') }}</h4>
          <p>{{ t('dashboard.empty.category_desc') }}</p>
        </div>

        <div v-else>
          <div v-for="cat in byCategory" :key="cat.name" class="cat-row">
            <span class="category-badge" :style="getCategoryStyle(cat.name)">{{ cat.name }}</span>
            <div class="cat-bar-wrap">
              <div class="cat-bar bg-blue-soft" :style="`width: ${total > 0 ? (cat.count / total * 100) : 0}%; background: var(--stat-blue-text);`"></div>
            </div>
            <span class="cat-count">{{ cat.count }}</span>
          </div>
        </div>
        </template>
      </div>

      <div class="dash-card">
        <div class="dash-card-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div class="card-icon bg-purple-soft text-purple">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 class="dash-card-title">{{ t('dashboard.sections.recent_tasks') }}</h3>
          </div>
          <router-link to="/todos" class="view-all">{{ t('dashboard.view_all') }} <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="12"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></router-link>
        </div>

        <template v-if="taskStore.initialLoading">
          <div v-for="i in 4" :key="i" class="recent-row" style="opacity: 0.7;">
            <div class="recent-info" style="width: 100%;">
              <SkeletonLoader width="60%" height="16px" style="margin-bottom: 6px;" />
              <SkeletonLoader width="70px" height="20px" borderRadius="10px" />
            </div>
            <SkeletonLoader width="60px" height="24px" borderRadius="12px" />
          </div>
        </template>
        <template v-else>
        <div v-if="recentTasks.length === 0" class="dash-empty">
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="30" y="20" width="40" height="60" rx="4" fill="#E9D5FF"/>
            <rect x="40" y="15" width="20" height="10" rx="2" fill="#C084FC"/>
            <rect x="35" y="40" width="30" height="4" fill="#F3E8FF"/>
            <rect x="35" y="50" width="30" height="4" fill="#F3E8FF"/>
            <rect x="35" y="60" width="20" height="4" fill="#F3E8FF"/>
          </svg>
          <h4>{{ t('dashboard.empty.no_tasks') }}</h4>
          <p>{{ t('dashboard.empty.recent_desc') }}</p>
        </div>

        <div v-else>
          <div v-for="task in recentTasks" :key="task.id" class="recent-row">
            <div class="recent-info">
              <span class="recent-title">{{ task.title }}</span>
              <span class="category-badge" :style="getCategoryStyle(task.category?.name || 'General')">{{ task.category?.name || 'General' }}</span>
            </div>
            <span v-if="task.status === 'completed'" class="status-pill status-completed">{{ t('dashboard.chart_labels.completed') }}</span>
            <span v-else-if="task.status === 'failed'" class="status-pill status-failed">{{ t('dashboard.chart_labels.failed') }}</span>
            <span v-else class="status-pill status-todo">{{ t('dashboard.chart_labels.todo') }}</span>
          </div>
        </div>
        </template>
      </div>

    </div>

    <!-- Charts Section -->
    <div class="charts-grid">
      
      <!-- Category Bar Chart -->
      <div class="dash-card">
        <h3 class="dash-card-title" style="margin-bottom: 16px;">{{ t('dashboard.sections.category_performance') }}</h3>
        <div style="height: 300px;">
          <SkeletonLoader v-if="reportStore.initialLoading" width="100%" height="100%" borderRadius="8px" />
          <Bar v-else :data="categoryChartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Status Pie Chart -->
      <div class="dash-card">
        <h3 class="dash-card-title" style="margin-bottom: 16px;">{{ t('dashboard.sections.status_distribution') }}</h3>
        <div style="height: 300px; display: flex; justify-content: center; align-items: center;">
          <SkeletonLoader v-if="reportStore.initialLoading" type="circle" width="240px" height="240px" />
          <Pie v-else :data="statusPieData" :options="chartOptions" />
        </div>
      </div>

      <!-- Trend Line Chart -->
      <div class="dash-card trend-chart">
        <h3 class="dash-card-title" style="margin-bottom: 16px;">{{ t('dashboard.sections.productivity_trend') }}</h3>
        <div style="height: 300px;">
          <SkeletonLoader v-if="reportStore.initialLoading" width="100%" height="100%" borderRadius="8px" />
          <Line v-else :data="dailyTrendData" :options="chartOptions" />
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 24px;
  margin-bottom: 24px;
}
.trend-chart {
  grid-column: span 2;
}

@media (max-width: 992px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  .trend-chart {
    grid-column: span 1;
  }
}
</style>
