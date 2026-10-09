<script setup>
defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Delete Item'
  },
  message: {
    type: String,
    default: 'Are you sure you want to delete this item? This action cannot be undone and the data will be permanently lost.'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  confirmText: {
    type: String,
    default: 'Delete'
  }
})

defineEmits(['cancel', 'confirm'])
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="show" class="delete-modal-backdrop">
        <div class="delete-modal-card">
          <div class="delete-modal-content">
            <div class="icon-container">
              <div class="icon-background"></div>
              <svg class="warning-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            
            <h3 class="delete-modal-title">{{ title }}</h3>
            <p class="delete-modal-message">{{ message }}</p>
          </div>
          
          <div class="delete-modal-actions">
            <button @click="$emit('cancel')" class="btn-cancel">
              {{ cancelText }}
            </button>
            <button @click="$emit('confirm')" class="btn-confirm">
              <svg class="trash-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Modal Backdrop Overlay */
.delete-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(8px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

/* Modal Card with Glassmorphism / Premium Look */
.delete-modal-card {
  background: var(--card-bg);
  border-radius: 24px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.delete-modal-content {
  padding: 32px 32px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Warning Icon with Pulsing Background */
.icon-container {
  position: relative;
  width: 64px;
  height: 64px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-background {
  position: absolute;
  inset: 0;
  background-color: #FEE2E2;
  border-radius: 50%;
  animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.warning-icon {
  position: relative;
  width: 32px;
  height: 32px;
  color: #DC2626;
  z-index: 1;
}

/* Typography */
.delete-modal-title {
  margin: 0 0 12px;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-dark);
  letter-spacing: -0.01em;
}

.delete-modal-message {
  margin: 0;
  font-size: 15px;
  color: var(--text-muted);
  line-height: 1.6;
}

/* Action Buttons */
.delete-modal-actions {
  display: flex;
  padding: 20px 32px 32px;
  gap: 16px;
  background-color: var(--hover-bg);
  border-top: 1px solid var(--border-light);
}

.btn-cancel {
  flex: 1;
  background-color: var(--card-bg);
  border: 1px solid var(--border-light);
  color: var(--text-muted);
  font-weight: 600;
  font-size: 15px;
  padding: 12px 0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn-cancel:hover {
  background-color: var(--hover-bg);
  border-color: var(--primary);
  color: var(--text-dark);
}

.btn-cancel:active {
  transform: translateY(1px);
}

.btn-confirm {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
  border: none;
  color: white;
  font-weight: 600;
  font-size: 15px;
  padding: 12px 0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.3), 0 2px 4px -1px rgba(220, 38, 38, 0.2);
}

.btn-confirm:hover {
  background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
  box-shadow: 0 6px 8px -1px rgba(220, 38, 38, 0.4), 0 4px 6px -1px rgba(220, 38, 38, 0.2);
  transform: translateY(-1px);
}

.btn-confirm:active {
  transform: translateY(1px);
  box-shadow: 0 2px 4px -1px rgba(220, 38, 38, 0.3);
}

.trash-icon {
  width: 18px;
  height: 18px;
}

/* Animations */
@keyframes pulse-ring {
  0% { transform: scale(0.8); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 0; }
  100% { transform: scale(0.8); opacity: 0; }
}

/* Vue Transition Classes */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .delete-modal-card {
  animation: modal-pop-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.modal-fade-leave-active .delete-modal-card {
  animation: modal-pop-out 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes modal-pop-in {
  0% { opacity: 0; transform: scale(0.9) translateY(20px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes modal-pop-out {
  0% { opacity: 1; transform: scale(1) translateY(0); }
  100% { opacity: 0; transform: scale(0.9) translateY(20px); }
}
</style>
