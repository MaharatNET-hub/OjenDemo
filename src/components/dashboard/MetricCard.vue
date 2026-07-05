<script setup lang="ts">
import { computed, toRef } from 'vue'
import Icon from '@/components/Icon.vue'
import { STATUS_CLASSES, STATUS_KEY } from '@/data/qlEngine'
import { useAnimatedNumber } from '@/composables/useAnimatedNumber'
import { useLocaleStore } from '@/stores/locale'
import type { QlStatus } from '@/types'

const props = defineProps<{
  icon: string
  labelKey: string
  value: number
  status: QlStatus
}>()

const locale = useLocaleStore()
const animatedValue = useAnimatedNumber(toRef(props, 'value'))
const roundedValue = computed(() => Math.round(animatedValue.value))
</script>

<template>
  <div class="rounded-xl border border-ojen-border bg-ojen-panel p-4">
    <div class="flex items-center justify-between mb-3">
      <span class="w-8 h-8 rounded-lg bg-ojen-panel-light flex items-center justify-center">
        <Icon :name="icon" class="w-4 h-4 text-ojen-gold" />
      </span>
      <span class="text-xs text-ojen-muted">{{ locale.t(labelKey) }}</span>
    </div>
    <p class="text-3xl font-bold mb-1 tabular-nums">{{ roundedValue }}%</p>
    <p class="text-xs text-ojen-muted mb-3">{{ locale.t('metricCard.vsLastMonth') }}</p>
    <span
      class="inline-block rounded px-2 py-1 text-[11px] font-semibold tracking-wide"
      :class="STATUS_CLASSES[status]"
    >
      {{ locale.t(STATUS_KEY[status]).toUpperCase() }}
    </span>
  </div>
</template>
