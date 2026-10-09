<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'block' // 'block', 'circle', 'text'
  },
  width: {
    type: [String, Number],
    default: '100%'
  },
  height: {
    type: [String, Number],
    default: '1rem'
  },
  borderRadius: {
    type: [String, Number],
    default: '4px'
  }
})

const computedStyle = computed(() => {
  const w = typeof props.width === 'number' ? `${props.width}px` : props.width
  const h = typeof props.height === 'number' ? `${props.height}px` : props.height
  const br = props.type === 'circle' ? '50%' : (typeof props.borderRadius === 'number' ? `${props.borderRadius}px` : props.borderRadius)
  
  return {
    width: w,
    height: h,
    borderRadius: br
  }
})
</script>

<template>
  <div class="skeleton-loader" :class="[`skeleton-${type}`]" :style="computedStyle"></div>
</template>

<style scoped>
.skeleton-loader {
  background-color: var(--active-bg); /* tailwind gray-200 */
  position: relative;
  overflow: hidden;
}

.skeleton-loader::after {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.4) 20%,
    rgba(255, 255, 255, 0.4) 60%,
    rgba(255, 255, 255, 0)
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

.skeleton-text {
  margin-bottom: 0.5rem;
}
</style>
