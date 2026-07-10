import { defineStore } from 'pinia';
import api from '@/services/api';

export const useReportStore = defineStore('reports', {
  state: () => ({
    summary: {
      total: 0,
      completed: 0,
      todo: 0,
      failed: 0,
      completionRate: 0,
      productivityScore: 0,
      failureRate: 0,
    },
    categoryPerformance: {},
    priorityPerformance: {},
    dailyActivity: {},
    streak: 0,
    loading: false,
    initialLoading: false, // true only on first fetch when no cached data
    hasFetched: false,     // tracks whether we've fetched at least once
    error: null,
  }),

  actions: {
    async fetchStatistics(filters = {}) {
      try {
        // Only show skeleton on the very first load
        if (!this.hasFetched) {
          this.initialLoading = true;
        }
        this.loading = true;
        this.error = null;
        
        const params = new URLSearchParams();
        if (filters.timeRange) params.append('time_range', filters.timeRange);
        if (filters.startDate) params.append('start_date', filters.startDate);
        if (filters.endDate) params.append('end_date', filters.endDate);
        if (filters.categoryId) params.append('category_id', filters.categoryId);

        const response = await api.get(`/reports/statistics?${params.toString()}`);
        
        this.summary = response.data.summary;
        this.categoryPerformance = response.data.categoryPerformance;
        this.priorityPerformance = response.data.priorityPerformance;
        this.dailyActivity = response.data.dailyActivity;
        this.streak = response.data.streak;
        this.hasFetched = true;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        console.error('Error fetching statistics:', error);
      } finally {
        this.loading = false;
        this.initialLoading = false;
      }
    }
  }
});
