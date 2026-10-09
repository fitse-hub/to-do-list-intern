<script setup>
import { computed } from 'vue'
import { useCalendarStore } from '@/stores/calendarStore'
import { useCalendarFilters } from '@/composables/useCalendarFilters'
import { useI18n } from 'vue-i18n'

const calendarStore = useCalendarStore()
const { getTaskColor, getPriorityColor } = useCalendarFilters()
const { t } = useI18n()

const task = computed(() => calendarStore.selectedTask)

function close() {
  calendarStore.closeDetail()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="panel">
      <div v-if="calendarStore.isDetailOpen && task" class="detail-backdrop" @click.self="close">
        <div class="detail-panel">
          <!-- Header strip -->
          <div
            class="detail-header"
            :style="{ background: getTaskColor(task).bg, borderBottom: `3px solid ${getTaskColor(task).border}` }"
          >
            <div class="detail-status-dot" :style="{ background: getTaskColor(task).dot }"></div>
            <h3 class="detail-title" :style="{ color: getTaskColor(task).text }">{{ task.title }}</h3>
            <button class="detail-close" @click="close">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="detail-body">

            <!-- Description -->
            <div class="detail-field">
              <span class="detail-field-label">{{ t('calendar.detail.description') }}</span>
              <p class="detail-field-value">{{ task.description || t('calendar.detail.no_description') }}</p>
            </div>

            <!-- Priority & Status row -->
            <div class="detail-row-2">
              <div class="detail-field">
                <span class="detail-field-label">{{ t('calendar.detail.priority') }}</span>
                <span
                  class="detail-badge"
                  :style="{
                    background: getPriorityColor(task.priority).bg,
                    color: getPriorityColor(task.priority).text
                  }"
                >
                  {{ task.priority || t('calendar.detail.none') }}
                </span>
              </div>
              <div class="detail-field">
                <span class="detail-field-label">{{ t('calendar.detail.status') }}</span>
                <span class="detail-badge" :style="{ background: getTaskColor(task).bg, color: getTaskColor(task).text }">
                  {{ getTaskColor(task).label }}
                </span>
              </div>
            </div>

            <!-- Project / Category -->
            <div class="detail-field" v-if="task.category">
              <span class="detail-field-label">{{ t('calendar.detail.project') }}</span>
              <span class="detail-field-value">{{ task.category.name }}</span>
            </div>

            <!-- Due Date -->
            <div class="detail-field" v-if="task.due_date">
              <span class="detail-field-label">{{ t('calendar.detail.due_date') }}</span>
              <span class="detail-field-value">
                {{ new Date(task.due_date).toLocaleDateString($i18n.locale, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }) }}
              </span>
            </div>

            <!-- Start Date -->
            <div class="detail-field" v-if="task.start_date">
              <span class="detail-field-label">{{ t('calendar.detail.start_date') }}</span>
              <span class="detail-field-value">
                {{ new Date(task.start_date).toLocaleDateString($i18n.locale, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }) }}
              </span>
            </div>

            <!-- Created -->
            <div class="detail-field" v-if="task.created_at">
              <span class="detail-field-label">{{ t('calendar.detail.created') }}</span>
              <span class="detail-field-value">
                {{ new Date(task.created_at).toLocaleDateString($i18n.locale, { year: 'numeric', month: 'short', day: 'numeric' }) }}
              </span>
            </div>

          </div>

          <!-- Footer -->
          <div class="detail-footer">
            <span class="detail-footer-hint">{{ t('calendar.detail.click_to_close') }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.detail-backdrop {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.detail-panel {
  background: var(--card-bg);
  border-radius: 16px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-enter-active { transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1); }
.panel-leave-active { transition: all 0.18s ease-in; }
.panel-enter-from, .panel-leave-to { opacity: 0; transform: scale(0.92) translateY(16px); }

.detail-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 20px;
  position: relative;
}

.detail-status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.detail-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  flex: 1;
  min-width: 0;
}

.detail-close {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  border: 1px solid rgba(0,0,0,0.1);
  background: rgba(255,255,255,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: inherit;
  flex-shrink: 0;
  transition: all 0.12s;
}

.detail-close:hover {
  background: rgba(0,0,0,0.08);
}

.detail-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  max-height: 60vh;
}

.detail-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.detail-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-field-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
}

.detail-field-value {
  font-size: 14px;
  color: var(--text-dark);
  margin: 0;
  font-weight: 500;
  line-height: 1.5;
}

.detail-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
  width: fit-content;
}

.detail-footer {
  padding: 12px 20px;
  border-top: 1px solid var(--border-light);
  background: var(--bg-main);
}

.detail-footer-hint {
  font-size: 11px;
  color: var(--text-muted);
}
</style>
