<script setup lang="ts">
import Icon from '@/components/Icon.vue'
import { STATUS_CLASSES, STATUS_LABEL } from '@/data/qlEngine'
import type { QlStatus } from '@/types'

defineProps<{
  icon: string
  label: string
  value: number
  status: QlStatus
  deltaLabel?: string
}>()
</script>

<template>
  <div class="rounded-xl border border-ojen-border bg-ojen-panel p-4">
    <div class="flex items-center justify-between mb-3">
      <span class="w-8 h-8 rounded-lg bg-ojen-panel-light flex items-center justify-center">
        <Icon :name="icon" class="w-4 h-4 text-ojen-gold" />
      </span>
      <span class="text-xs text-ojen-muted">{{ label }}</span>
    </div>
    <p class="text-3xl font-bold mb-1">{{ value }}%</p>
    <p class="text-xs text-ojen-muted mb-3">{{ deltaLabel ?? '0.0% vs last month' }}</p>
    <span
      class="inline-block rounded px-2 py-1 text-[11px] font-semibold tracking-wide"
      :class="STATUS_CLASSES[status]"
    >
      {{ STATUS_LABEL[status].toUpperCase() }}
    </span>
  </div>
</template>
