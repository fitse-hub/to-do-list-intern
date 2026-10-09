<script setup>
import { useI18n } from 'vue-i18n'
const emit = defineEmits(['create'])
const { t } = useI18n()
</script>

<template>
  <div class="cal-empty-state">
    <div class="empty-icon-wrap">
      <svg width="52" height="52" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2">
        <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor"/>
        <path stroke-linecap="round" d="M3 9h18"/>
        <path stroke-linecap="round" d="M8 2v3M16 2v3"/>
        <path stroke-linecap="round" d="M8 13h2m2 0h2M8 17h5"/>
      </svg>
    </div>
    <h3 class="empty-title">{{ t('calendar.empty.no_tasks_period') }}</h3>
    <button class="empty-create-btn" @click="emit('create')">
      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
      </svg>
      {{ t('calendar.common.add_task') }}
    </button>
  </div>
</template>

<style scoped>
.cal-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  gap: 12px;
  text-align: center;
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  background: color-mix(in srgb, var(--bg-main) 80%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.empty-icon-wrap {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: var(--card-bg);
  box-shadow: 0 4px 14px var(--shadow-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.empty-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0;
}

.empty-sub {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
  max-width: 300px;
  line-height: 1.6;
}

.empty-create-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  background: var(--primary);
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  pointer-events: all;
  transition: all 0.15s;
  margin-top: 4px;
  box-shadow: 0 4px 14px rgba(59,130,246,0.3);
}

.empty-create-btn:hover {
  background: #2563EB;
  transform: translateY(-1px);
}
</style>
