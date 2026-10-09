<script setup></script>

<template>
  <div class="cal-loading">
    <div class="loading-grid">
      <div v-for="i in 35" :key="i" class="loading-cell">
        <div class="skel skel-date"></div>
        <div v-if="i % 5 === 0" class="skel skel-task"></div>
        <div v-if="i % 7 === 1" class="skel skel-task short"></div>
        <div v-if="i % 9 === 2" class="skel skel-task"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cal-loading {
  flex: 1;
  padding: 0;
  overflow: hidden;
}

.loading-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(5, minmax(100px, 1fr));
  height: 100%;
}

.loading-cell {
  border-right: 1px solid var(--border-light);
  border-bottom: 1px solid var(--border-light);
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.skel {
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    var(--hover-bg) 25%,
    var(--border-light) 50%,
    var(--hover-bg) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skel-date {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  align-self: flex-end;
}

.skel-task {
  height: 18px;
  width: 90%;
}

.skel-task.short {
  width: 65%;
}
</style>
