<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ score: number; locked?: boolean }>()

const clamped = computed(() => Math.max(0, Math.min(100, props.score)))
const angleDeg = computed(() => 180 - (clamped.value / 100) * 180)
const needle = computed(() => {
  const rad = (angleDeg.value * Math.PI) / 180
  return {
    x: 100 + 78 * Math.cos(rad),
    y: 100 - 78 * Math.sin(rad),
  }
})
</script>

<template>
  <svg viewBox="0 0 200 115" class="w-[190px] h-auto">
    <defs>
      <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ef4444" />
        <stop offset="45%" stop-color="#f59e0b" />
        <stop offset="100%" stop-color="#22c55e" />
      </linearGradient>
    </defs>
    <path
      d="M 14 100 A 86 86 0 0 1 186 100"
      fill="none"
      :stroke="locked ? '#2a3350' : 'url(#gaugeGrad)'"
      stroke-width="12"
      stroke-linecap="round"
    />
    <template v-if="!locked">
      <line
        x1="100"
        y1="100"
        :x2="needle.x"
        :y2="needle.y"
        stroke="#e7e9f0"
        stroke-width="3"
        stroke-linecap="round"
      />
      <circle cx="100" cy="100" r="6" fill="#e7e9f0" />
    </template>
  </svg>
</template>
