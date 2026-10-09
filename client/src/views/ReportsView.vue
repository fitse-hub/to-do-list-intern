<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useReportStore } from '@/stores/reportStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { useI18n } from 'vue-i18n';

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
import { Bar, Pie, Line, Doughnut } from 'vue-chartjs';
import SkeletonLoader from '@/components/common/SkeletonLoader.vue';

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

const reportStore = useReportStore();
const categoryStore = useCategoryStore();
const { t } = useI18n();

const filters = ref({
  timeRange: 'all', // all, today, weekly, monthly, custom
  startDate: '',
  endDate: '',
  categoryId: 'all'
});

onMounted(async () => {
  await categoryStore.fetchCategories();
  fetchReports();
});

const fetchReports = () => {
  reportStore.fetchStatistics(filters.value);
};

watch(() => filters.value.timeRange, (newVal) => {
  if (newVal !== 'custom') {
    fetchReports();
  }
});

watch(() => filters.value.categoryId, () => {
  fetchReports();
});

const handleCustomDateSearch = () => {
  if (filters.value.startDate && filters.value.endDate) {
    fetchReports();
  }
};

// Data for charts
const categoryChartData = computed(() => {
  const labels = Object.keys(reportStore.categoryPerformance);
  const completedData = labels.map(l => reportStore.categoryPerformance[l].completed);
  const failedData = labels.map(l => reportStore.categoryPerformance[l].failed);
  
  return {
    labels,
    datasets: [
      {
        label: t('reports.charts.labels.completed'),
        backgroundColor: '#22C55E',
        data: completedData
      },
      {
        label: t('reports.charts.labels.failed'),
        backgroundColor: '#EF4444',
        data: failedData
      }
    ]
  };
});

const statusPieData = computed(() => {
  return {
    labels: [t('reports.charts.labels.completed'), t('reports.charts.labels.todo'), t('reports.charts.labels.failed')],
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
        label: t('reports.charts.labels.created'),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        data: created,
        tension: 0.3,
        fill: true
      },
      {
        label: t('reports.charts.labels.completed'),
        borderColor: '#22C55E',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        data: completed,
        tension: 0.3,
        fill: true
      }
    ]
  };
});

const progressData = computed(() => {
  return {
    labels: [t('reports.charts.labels.completed'), t('reports.charts.labels.remaining')],
    datasets: [
      {
        backgroundColor: ['#3B82F6', '#E2E8F0'],
        data: [
          reportStore.summary.completed,
          Math.max(0, reportStore.summary.total - reportStore.summary.completed)
        ]
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

// Heatmap logic (last 30 days)
const heatmapDays = computed(() => {
  const days = [];
  const today = new Date();
  
  // Format YYYY-MM-DD local
  const format = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = format(d);
    
    // determine level based on completed tasks
    let completed = 0;
    if (reportStore.dailyActivity[dateStr]) {
      completed = reportStore.dailyActivity[dateStr].completed;
    }
    
    let level = 0;
    if (completed === 1) level = 1;
    else if (completed === 2) level = 2;
    else if (completed >= 3) level = 3;

    days.push({
      date: dateStr,
      completed,
      level
    });
  }
  return days;
});

const getHeatmapColor = (level) => {
  if (level === 1) return 'var(--stat-green-bg)'; // light green
  if (level === 2) return 'var(--stat-green-text)'; // green
  if (level === 3) return '#16a34a'; // dark green
  return 'var(--hover-bg)'; // gray
};

const topCategory = computed(() => {
  let best = null;
  let max = 0;
  for (const [cat, data] of Object.entries(reportStore.categoryPerformance)) {
    if (data.completed > max) {
      max = data.completed;
      best = cat;
    }
  }
  return best || t('reports.insights.none');
});

const bestDay = computed(() => {
  let best = null;
  let max = 0;
  for (const [date, data] of Object.entries(reportStore.dailyActivity)) {
    if (data.completed > max) {
      max = data.completed;
      best = date;
    }
  }
  return best || t('reports.insights.none');
});
</script>

<template>
  <section class="page-container" style="padding-top: 0;">
    <div class="hero-banner" style="background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%);">
      <div class="hero-content">
        <h2>{{ t('reports.hero_title') }}</h2>
        <p>{{ t('reports.hero_subtitle') }}</p>
      </div>
    </div>

    <div class="reports-controls">
      <div class="filters-row">
        <select v-model="filters.timeRange" class="search-input">
          <option value="all">{{ t('reports.filters.all_time') }}</option>
          <option value="today">{{ t('reports.filters.today') }}</option>
          <option value="weekly">{{ t('reports.filters.this_week') }}</option>
          <option value="monthly">{{ t('reports.filters.this_month') }}</option>
          <option value="custom">{{ t('reports.filters.custom_range') }}</option>
        </select>
        
        <select v-model="filters.categoryId" class="search-input">
          <option value="all">{{ t('reports.filters.all_categories') }}</option>
          <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>

        <div v-if="filters.timeRange === 'custom'" style="display: flex; gap: 8px;">
          <input type="date" v-model="filters.startDate" class="search-input" />
          <input type="date" v-model="filters.endDate" class="search-input" />
          <button @click="handleCustomDateSearch" class="btn btn-primary" style="padding: 8px 16px;">{{ t('reports.filters.apply') }}</button>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="stat-grid" style="margin-top: 24px;">
      <template v-if="reportStore.initialLoading">
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
        </div>
        <div class="stat-info">
          <span class="stat-label">{{ t('reports.stats.total_tasks') }}</span>
          <span class="stat-value">{{ reportStore.summary.total }}</span>
        </div>
      </div>

      <div class="stat-card" style="--curve-color: rgba(34, 197, 94, 0.05);">
        <div class="stat-top">
          <div class="stat-icon-wrap bg-green-soft text-green">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="22" height="22"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>
        <div class="stat-info">
          <span class="stat-label">{{ t('reports.stats.completed') }}</span>
          <span class="stat-value text-green">{{ reportStore.summary.completed }}</span>
        </div>
      </div>

      <div class="stat-card" style="--curve-color: rgba(239, 68, 68, 0.05);">
        <div class="stat-top">
          <div class="stat-icon-wrap bg-red-soft text-red">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="22" height="22"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>
        <div class="stat-info">
          <span class="stat-label">{{ t('reports.stats.failure_rate') }}</span>
          <span class="stat-value text-red">{{ reportStore.summary.failureRate }}%</span>
        </div>
      </div>

      <div class="stat-card" style="--curve-color: rgba(139, 92, 246, 0.05);">
        <div class="stat-top">
          <div class="stat-icon-wrap bg-purple-soft text-purple">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="22" height="22"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
        </div>
        <div class="stat-info">
          <span class="stat-label">{{ t('reports.stats.productivity_score') }}</span>
          <span class="stat-value text-purple">{{ reportStore.summary.productivityScore }}%</span>
        </div>
      </div>
      </template>
    </div>

    <!-- Charts Section -->
    <div class="charts-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-top: 24px;">
      
      <!-- Category Bar Chart -->
      <div class="dash-card">
        <h3 class="dash-card-title" style="margin-bottom: 16px;">{{ t('reports.charts.category_performance') }}</h3>
        <div style="height: 300px;">
          <SkeletonLoader v-if="reportStore.initialLoading" width="100%" height="100%" borderRadius="8px" />
          <Bar v-else :data="categoryChartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Status Pie Chart -->
      <div class="dash-card">
        <h3 class="dash-card-title" style="margin-bottom: 16px;">{{ t('reports.charts.status_distribution') }}</h3>
        <div style="height: 300px; display: flex; justify-content: center; align-items: center;">
          <SkeletonLoader v-if="reportStore.initialLoading" type="circle" width="240px" height="240px" />
          <Pie v-else :data="statusPieData" :options="chartOptions" />
        </div>
      </div>

      <!-- Trend Line Chart -->
      <div class="dash-card" style="grid-column: span 2;">
        <h3 class="dash-card-title" style="margin-bottom: 16px;">{{ t('reports.charts.productivity_trend') }}</h3>
        <div style="height: 300px;">
          <SkeletonLoader v-if="reportStore.initialLoading" width="100%" height="100%" borderRadius="8px" />
          <Line v-else :data="dailyTrendData" :options="chartOptions" />
        </div>
      </div>

    </div>

    <!-- Insights & Heatmap -->
    <div class="insights-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 24px;">
      
      <!-- Leaderboard & Streaks -->
      <div class="dash-card">
        <h3 class="dash-card-title" style="margin-bottom: 16px;">{{ t('reports.insights.title') }}</h3>
        <div class="insights-list">
          <template v-if="reportStore.initialLoading">
            <div class="insight-item" v-for="i in 3" :key="i">
              <SkeletonLoader width="40%" height="16px" />
              <SkeletonLoader width="30%" height="16px" />
            </div>
          </template>
          <template v-else>
          <div class="insight-item">
            <span class="insight-label">{{ t('reports.insights.current_streak') }}</span>
            <span class="insight-value">🔥 {{ reportStore.streak }} {{ t('reports.insights.days') }}</span>
          </div>
          <div class="insight-item">
            <span class="insight-label">{{ t('reports.insights.top_category') }}</span>
            <span class="insight-value">⭐ {{ topCategory }}</span>
          </div>
          <div class="insight-item">
            <span class="insight-label">{{ t('reports.insights.best_day') }}</span>
            <span class="insight-value">📅 {{ bestDay }}</span>
          </div>
          </template>
        </div>
      </div>

      <!-- Heatmap -->
      <div class="dash-card">
        <h3 class="dash-card-title" style="margin-bottom: 16px;">{{ t('reports.insights.heatmap_title') }}</h3>
        <template v-if="reportStore.initialLoading">
          <SkeletonLoader width="100%" height="60px" borderRadius="8px" />
          <div class="heatmap-legend" style="display: flex; gap: 8px; font-size: 12px; margin-top: 12px; color: var(--text-muted);">
            <SkeletonLoader width="40%" height="16px" />
          </div>
        </template>
        <template v-else>
        <div class="heatmap-container" style="display: flex; flex-wrap: wrap; gap: 4px; padding: 12px; background: var(--hover-bg); border-radius: 8px;">
          <div 
            v-for="day in heatmapDays" 
            :key="day.date" 
            class="heatmap-cell"
            :style="{ backgroundColor: getHeatmapColor(day.level) }"
            :title="`${day.date}: ${day.completed} completed`"
          ></div>
        </div>
        <div class="heatmap-legend" style="display: flex; gap: 8px; font-size: 12px; margin-top: 12px; color: var(--text-muted);">
          <span>{{ t('reports.insights.less') }}</span>
          <div class="heatmap-cell" :style="{ backgroundColor: getHeatmapColor(0) }"></div>
          <div class="heatmap-cell" :style="{ backgroundColor: getHeatmapColor(1) }"></div>
          <div class="heatmap-cell" :style="{ backgroundColor: getHeatmapColor(2) }"></div>
          <div class="heatmap-cell" :style="{ backgroundColor: getHeatmapColor(3) }"></div>
          <span>{{ t('reports.insights.more') }}</span>
        </div>
        </template>
      </div>

    </div>

  </section>
</template>

<style scoped>
.reports-controls {
  margin-top: 24px;
  background: var(--card-bg);
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.filters-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.insight-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-light);
}

.insight-item:last-child {
  border-bottom: none;
}

.insight-label {
  font-weight: 500;
  color: var(--text-muted);
}

.insight-value {
  font-weight: 600;
  color: var(--text-dark);
}

.heatmap-cell {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  transition: transform 0.2s;
}
.heatmap-cell:hover {
  transform: scale(1.2);
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr !important;
  }
  .insights-grid {
    grid-template-columns: 1fr !important;
  }
  .dash-card {
    grid-column: span 1 !important;
  }
}
</style>
