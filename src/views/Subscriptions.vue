<script setup lang="ts">
import { computed, ref } from 'vue'
import Icon from '@/components/Icon.vue'
import { useQlStore } from '@/stores/ql'

const ql = useQlStore()

type FilterKey = 'all' | 'active' | 'pending' | 'completed' | 'expired'
const filter = ref<FilterKey>('all')

const counts = computed(() => ({
  all: ql.subscriptions.length,
  active: ql.subscriptions.filter((s) => s.status === 'Active').length,
  pending: ql.subscriptions.filter((s) => s.status === 'Pending').length,
  completed: ql.subscriptions.filter((s) => s.status === 'Completed').length,
  expired: ql.subscriptions.filter((s) => s.status === 'Expired').length,
}))

const filtered = computed(() => {
  if (filter.value === 'all') return ql.subscriptions
  return ql.subscriptions.filter((s) => s.status.toLowerCase() === filter.value)
})

const statusClasses: Record<string, string> = {
  Active: 'bg-emerald-500/15 text-emerald-400',
  Pending: 'bg-amber-500/15 text-amber-400',
  Completed: 'bg-sky-500/15 text-sky-400',
  Expired: 'bg-red-500/15 text-red-400',
}

const tabs: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'pending', label: 'pending' },
  { key: 'completed', label: 'Completed' },
  { key: 'expired', label: 'Expired' },
]
</script>

<template>
  <div>
    <div class="h-56 bg-gradient-to-r from-ojen-panel to-ojen-panel-light flex items-center justify-center border-b border-ojen-border">
      <h1 class="text-3xl font-bold">My Subscriptions</h1>
    </div>

    <div class="mx-auto max-w-[1500px] px-4 sm:px-6 py-6 space-y-6">
      <p class="text-sm text-ojen-muted">&gt; My Subscriptions</p>

      <div>
        <h2 class="font-semibold flex items-center gap-2 mb-4">
          <Icon name="chart" class="w-4 h-4 text-ojen-gold" /> Subscription Statistics
        </h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div class="rounded-xl border border-sky-500/40 bg-ojen-panel p-4">
            <p class="text-2xl font-bold">{{ counts.all }}</p>
            <p class="text-xs text-ojen-muted">Total Subscriptions</p>
          </div>
          <div class="rounded-xl border border-emerald-500/40 bg-ojen-panel p-4">
            <p class="text-2xl font-bold">{{ counts.active }}</p>
            <p class="text-xs text-ojen-muted">Active Subscriptions</p>
          </div>
          <div class="rounded-xl border border-sky-500/40 bg-ojen-panel p-4">
            <p class="text-2xl font-bold">{{ counts.completed }}</p>
            <p class="text-xs text-ojen-muted">Completed Subscriptions</p>
          </div>
          <div class="rounded-xl border border-ojen-gold/40 bg-ojen-panel p-4">
            <p class="text-2xl font-bold">{{ counts.expired }}</p>
            <p class="text-xs text-ojen-muted">Expired Subscriptions</p>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-ojen-border bg-ojen-panel p-4">
        <p class="font-semibold flex items-center gap-2 mb-3">
          <Icon name="filter" class="w-4 h-4 text-ojen-gold" /> Filter Subscriptions
        </p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="rounded-md border px-3 py-1.5 text-sm capitalize transition"
            :class="
              filter === tab.key
                ? 'border-ojen-gold text-ojen-gold bg-ojen-gold/10'
                : 'border-ojen-border text-ojen-muted hover:border-ojen-gold hover:text-ojen-gold'
            "
            @click="filter = tab.key"
          >
            {{ tab.label }} ({{ counts[tab.key] }})
          </button>
        </div>
      </div>

      <div class="flex justify-end">
        <RouterLink
          to="/en/profile/ql-overview"
          class="rounded-md border border-ojen-border px-4 py-2 text-sm flex items-center gap-2 hover:border-ojen-gold hover:text-ojen-gold transition"
        >
          <Icon name="chart" class="w-4 h-4" /> Open Corporate QL overview
        </RouterLink>
      </div>

      <div v-for="sub in filtered" :key="sub.id" class="rounded-xl border border-ojen-gold/40 bg-ojen-panel p-4">
        <div class="flex items-center justify-between mb-4">
          <p class="font-semibold flex items-center gap-2">
            <Icon name="briefcase" class="w-4 h-4 text-ojen-gold" /> Plan ({{ sub.startDate }} - {{ sub.endDate }})
          </p>
          <RouterLink
            to="/en/profile/ql-overview"
            class="rounded-md border border-ojen-border px-3 py-1.5 text-xs flex items-center gap-1.5 hover:border-ojen-gold hover:text-ojen-gold transition"
          >
            <Icon name="chart" class="w-3.5 h-3.5" /> Open full analysis
          </RouterLink>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-ojen-muted border-b border-ojen-border">
                <th class="py-2 pr-4">Package/Journey</th>
                <th class="py-2 pr-4">Start Date</th>
                <th class="py-2 pr-4">End Date</th>
                <th class="py-2 pr-4">Completion Rate</th>
                <th class="py-2 pr-4">Certificate</th>
                <th class="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-ojen-border/60">
                <td class="py-3 pr-4">
                  <p class="font-medium">{{ sub.packageName }}</p>
                  <p class="text-xs text-ojen-muted">{{ sub.journey }}</p>
                </td>
                <td class="py-3 pr-4 text-ojen-muted">{{ sub.startDate }}</td>
                <td class="py-3 pr-4 text-ojen-muted">{{ sub.endDate }}</td>
                <td class="py-3 pr-4 text-ojen-muted">{{ sub.completionRate }}</td>
                <td class="py-3 pr-4 text-ojen-muted">{{ sub.certificate }}</td>
                <td class="py-3 pr-4">
                  <span class="rounded px-2 py-0.5 text-[11px]" :class="statusClasses[sub.status]">{{ sub.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p v-if="filtered.length === 0" class="text-center text-ojen-muted py-10">
        No subscriptions match this filter.
      </p>
    </div>
  </div>
</template>
