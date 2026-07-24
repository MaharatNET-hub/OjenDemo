<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@/components/Icon.vue'

const props = defineProps<{
  variant: 'locked' | 'completed'
  count: number
  topDay: number | null
  dayLabel: string
  statusLabel: string
  emptyText: string
  to?: string
}>()

const fanLayers = computed(() => Math.max(0, Math.min(4, props.count - 1)))
const badgeCount = computed(() => Math.max(0, props.count - (fanLayers.value + 1)))
const rootTag = computed(() => (props.to ? 'RouterLink' : 'div'))
</script>

<template>
  <component
    :is="rootTag"
    :to="to"
    class="relative h-[220px] w-[170px]"
    :class="to ? 'block transition hover:opacity-90' : ''"
  >
    <template v-if="count === 0">
      <div
        class="absolute inset-0 rounded-xl border-2 border-dashed border-ojen-border flex items-center justify-center text-center px-4"
      >
        <p class="text-xs text-ojen-muted">{{ emptyText }}</p>
      </div>
    </template>
    <template v-else>
      <div
        v-for="layer in fanLayers"
        :key="layer"
        class="absolute inset-x-0 top-0 h-full rounded-xl border"
        :class="variant === 'locked' ? 'border-ojen-border bg-ojen-panel-light' : 'border-ojen-gold/30 bg-ojen-panel-light'"
        :style="{ transform: `translate(${layer * 4}px, ${layer * 4}px)`, zIndex: layer }"
      />
      <div
        class="absolute inset-0 rounded-xl border-2 flex flex-col items-center justify-center gap-2"
        :class="variant === 'locked' ? 'border-ojen-border bg-ojen-panel' : 'border-ojen-gold bg-ojen-panel'"
        style="z-index: 10"
      >
        <Icon
          :name="variant === 'locked' ? 'lock' : 'check-circle'"
          class="w-6 h-6"
          :class="variant === 'locked' ? 'text-ojen-gold' : 'text-ojen-gold'"
        />
        <span class="rounded-full border border-ojen-border px-3 py-1 text-xs font-semibold">{{ dayLabel }} {{ topDay }}</span>
        <span class="text-[10px] tracking-widest text-ojen-muted">{{ statusLabel }}</span>
        <span
          v-if="badgeCount > 0"
          class="absolute -bottom-3 -end-3 w-8 h-8 rounded-full bg-ojen-gold text-ojen-ink text-xs font-bold flex items-center justify-center"
        >
          +{{ badgeCount }}
        </span>
      </div>
    </template>
  </component>
</template>
