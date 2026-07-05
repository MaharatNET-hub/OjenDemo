<script setup lang="ts">
import { computed, ref } from 'vue'
import Icon from '@/components/Icon.vue'
import { useQlStore } from '@/stores/ql'
import { useLocaleStore } from '@/stores/locale'

const ql = useQlStore()
const locale = useLocaleStore()

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

const statusKey: Record<string, string> = {
  Active: 'subscriptions.activeTab',
  Pending: 'subscriptions.pendingTab',
  Completed: 'subscriptions.completedTab',
  Expired: 'subscriptions.expiredTab',
}

const tabs: { key: FilterKey; labelKey: string }[] = [
  { key: 'all', labelKey: 'subscriptions.all' },
  { key: 'active', labelKey: 'subscriptions.activeTab' },
  { key: 'pending', labelKey: 'subscriptions.pendingTab' },
  { key: 'completed', labelKey: 'subscriptions.completedTab' },
  { key: 'expired', labelKey: 'subscriptions.expiredTab' },
]
</script>

<template>
  <div>
    <div class="h-56 bg-gradient-to-r from-ojen-panel to-ojen-panel-light flex items-center justify-center border-b border-ojen-border">
      <h1 class="text-3xl font-bold">{{ locale.t('subscriptions.title') }}</h1>
    </div>

    <div class="mx-auto max-w-[1500px] px-4 sm:px-6 py-6 space-y-6">
      <p class="text-sm text-ojen-muted">{{ locale.t('subscriptions.breadcrumb') }}</p>

      <div>
        <h2 class="font-semibold flex items-center gap-2 mb-4">
          <Icon name="chart" class="w-4 h-4 text-ojen-gold" /> {{ locale.t('subscriptions.statistics') }}
        </h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div class="rounded-xl border border-sky-500/40 bg-ojen-panel p-4">
            <p class="text-2xl font-bold">{{ counts.all }}</p>
            <p class="text-xs text-ojen-muted">{{ locale.t('subscriptions.total') }}</p>
          </div>
          <div class="rounded-xl border border-emerald-500/40 bg-ojen-panel p-4">
            <p class="text-2xl font-bold">{{ counts.active }}</p>
            <p class="text-xs text-ojen-muted">{{ locale.t('subscriptions.active') }}</p>
          </div>
          <div class="rounded-xl border border-sky-500/40 bg-ojen-panel p-4">
            <p class="text-2xl font-bold">{{ counts.completed }}</p>
            <p class="text-xs text-ojen-muted">{{ locale.t('subscriptions.completed') }}</p>
          </div>
          <div class="rounded-xl border border-ojen-gold/40 bg-ojen-panel p-4">
            <p class="text-2xl font-bold">{{ counts.expired }}</p>
            <p class="text-xs text-ojen-muted">{{ locale.t('subscriptions.expired') }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-ojen-border bg-ojen-panel p-4">
        <p class="font-semibold flex items-center gap-2 mb-3">
          <Icon name="filter" class="w-4 h-4 text-ojen-gold" /> {{ locale.t('subscriptions.filter') }}
        </p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="rounded-md border px-3 py-1.5 text-sm transition"
            :class="
              filter === tab.key
                ? 'border-ojen-gold text-ojen-gold bg-ojen-gold/10'
                : 'border-ojen-border text-ojen-muted hover:border-ojen-gold hover:text-ojen-gold'
            "
            @click="filter = tab.key"
          >
            {{ locale.t(tab.labelKey) }} ({{ counts[tab.key] }})
          </button>
        </div>
      </div>

      <div class="flex justify-end">
        <RouterLink
          to="/en/profile/ql-overview"
          class="rounded-md border border-ojen-border px-4 py-2 text-sm flex items-center gap-2 hover:border-ojen-gold hover:text-ojen-gold transition"
        >
          <Icon name="chart" class="w-4 h-4" /> {{ locale.t('subscriptions.openCorporateOverview') }}
        </RouterLink>
      </div>

      <div v-for="sub in filtered" :key="sub.id" class="rounded-xl border border-ojen-gold/40 bg-ojen-panel p-4">
        <div class="flex items-center justify-between mb-4">
          <p class="font-semibold flex items-center gap-2">
            <Icon name="briefcase" class="w-4 h-4 text-ojen-gold" /> {{ locale.t('subscriptions.plan') }} <span dir="ltr">({{ sub.startDate }} - {{ sub.endDate }})</span>
          </p>
          <RouterLink
            to="/en/profile/ql-overview"
            class="rounded-md border border-ojen-border px-3 py-1.5 text-xs flex items-center gap-1.5 hover:border-ojen-gold hover:text-ojen-gold transition"
          >
            <Icon name="chart" class="w-3.5 h-3.5" /> {{ locale.t('subscriptions.openFullAnalysis') }}
          </RouterLink>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-start text-ojen-muted border-b border-ojen-border">
                <th class="py-2 pe-4">{{ locale.t('subscriptions.packageJourney') }}</th>
                <th class="py-2 pe-4">{{ locale.t('subscriptions.startDate') }}</th>
                <th class="py-2 pe-4">{{ locale.t('subscriptions.endDate') }}</th>
                <th class="py-2 pe-4">{{ locale.t('subscriptions.completionRate') }}</th>
                <th class="py-2 pe-4">{{ locale.t('subscriptions.certificate') }}</th>
                <th class="py-2 pe-4">{{ locale.t('subscriptions.status') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-ojen-border/60">
                <td class="py-3 pe-4">
                  <p class="font-medium">{{ locale.t('subscriptions.corporateQol') }}</p>
                  <p class="text-xs text-ojen-muted">{{ locale.t('subscriptions.fullPackage') }}</p>
                </td>
                <td class="py-3 pe-4 text-ojen-muted">{{ sub.startDate }}</td>
                <td class="py-3 pe-4 text-ojen-muted">{{ sub.endDate }}</td>
                <td class="py-3 pe-4 text-ojen-muted">{{ sub.completionRate }}</td>
                <td class="py-3 pe-4 text-ojen-muted">{{ locale.t('subscriptions.notAvailable') }}</td>
                <td class="py-3 pe-4">
                  <span class="rounded px-2 py-0.5 text-[11px]" :class="statusClasses[sub.status]">{{ locale.t(statusKey[sub.status]) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p v-if="filtered.length === 0" class="text-center text-ojen-muted py-10">
        {{ locale.t('subscriptions.noMatch') }}
      </p>
    </div>
  </div>
</template>
