<script setup lang="ts">
import { computed, ref } from 'vue'
import Icon from '@/components/Icon.vue'
import Gauge from '@/components/dashboard/Gauge.vue'
import MetricCard from '@/components/dashboard/MetricCard.vue'
import ImprovementCard from '@/components/dashboard/ImprovementCard.vue'
import { DIMENSIONS, KEY_DRIVER_ORDER, ALL_DIMENSIONS, STATUS_CLASSES, STATUS_LABEL, buildImprovementPlan, statusFor } from '@/data/qlEngine'
import type { ImprovementOption } from '@/data/qlEngine'
import { useQlStore } from '@/stores/ql'

const ql = useQlStore()

const focusDept = computed(() => ql.primaryFocusDepartment)
const hasData = computed(() => focusDept.value !== null)

const headlineMetrics = computed(() => focusDept.value?.metrics ?? ql.overallMetrics)
const headlineScore = computed(() => focusDept.value?.score ?? ql.overallQlScore)

const overallStatus = computed(() => {
  if (headlineScore.value >= 65) return 'strong'
  if (headlineScore.value >= 45) return 'monitor'
  return 'attention'
})

const plan = computed(() =>
  buildImprovementPlan(focusDept.value?.department ?? 'Company-wide', headlineMetrics.value),
)

const actionMessage = ref<string | null>(null)
function handleAction(option: ImprovementOption) {
  actionMessage.value = `Request sent for "${option.title}". Our QL Advisor team will follow up by email shortly. (demo action)`
  setTimeout(() => (actionMessage.value = null), 4000)
}

function resolveOption1() {
  if (!focusDept.value) return
  ql.markResolved(`${focusDept.value.department}-1`)
}
const option1Resolved = computed(() =>
  focusDept.value ? ql.isResolved(`${focusDept.value.department}-1`) : false,
)

const showAllDepartments = ref(false)
const departmentKeyDrivers = (deptMetrics: Record<string, number>) =>
  KEY_DRIVER_ORDER.map((key) => {
    const meta = ALL_DIMENSIONS.find((d) => d.key === key)!
    return { label: meta.label, value: deptMetrics[key] ?? 0 }
  })
</script>

<template>
  <div class="mx-auto max-w-[1500px] px-4 sm:px-6 py-6 space-y-6">
    <div
      v-if="actionMessage"
      class="rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-sm px-4 py-3"
    >
      {{ actionMessage }}
    </div>

    <!-- Primary focus banner -->
    <div class="rounded-xl border border-ojen-gold/50 bg-ojen-panel p-6 grid lg:grid-cols-[1.4fr_1fr_1fr] gap-6">
      <div class="flex items-start gap-4">
        <div class="relative shrink-0">
          <span class="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center">
            <Icon name="target" class="w-6 h-6 text-amber-400" />
          </span>
          <span
            class="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-ojen-gold/30 flex items-center justify-center border-2 border-ojen-panel"
          >
            <Icon name="user" class="w-3.5 h-3.5 text-ojen-gold" />
          </span>
        </div>
        <div>
          <p class="text-xs text-ojen-gold tracking-widest font-semibold mb-1">PRIMARY FOCUS AREA</p>
          <p class="text-lg">
            <span class="font-semibold text-ojen-gold">{{ focusDept?.department ?? 'No data yet' }}</span>
            <span v-if="hasData"> is the primary focus area for improvement</span>
          </p>
          <p class="text-sm text-ojen-muted mt-1">
            {{ hasData ? `Top recommendation: ${plan[0].title}` : 'Invite employees to complete the pulse survey to see results.' }}
          </p>
        </div>
      </div>

      <div class="flex flex-col items-center justify-center gap-2 border-x border-ojen-border px-4">
        <p class="text-xs text-ojen-muted">QL Score (Department)</p>
        <Gauge :score="headlineScore" />
        <div class="flex items-center gap-2">
          <span class="text-2xl font-bold">{{ headlineScore }}</span>
          <span class="text-ojen-muted text-sm">/100</span>
        </div>
        <div class="text-xs text-ojen-muted">
          vs Last Month<br />
          <span class="text-ojen-text font-semibold">• 0.0 pts</span><br />
          No previous month data
        </div>
        <span class="rounded px-2 py-1 text-[11px] font-semibold" :class="STATUS_CLASSES[overallStatus]">
          {{ STATUS_LABEL[overallStatus].toUpperCase() }}
        </span>
      </div>

      <div class="rounded-lg border border-ojen-border p-4 relative">
        <div class="flex items-start justify-between mb-2">
          <div>
            <p class="text-3xl font-bold">0<span class="text-ojen-muted text-base"> /100</span></p>
          </div>
          <span class="rounded-full bg-ojen-panel-light px-2 py-1 text-[10px] flex items-center gap-1 text-ojen-muted">
            <Icon name="lock" class="w-3 h-3" /> Locked Metric
          </span>
        </div>
        <Gauge :score="0" locked class="opacity-60" />
        <p class="font-semibold text-sm mt-2 mb-1">Institutional Excellence Analytics</p>
        <p class="text-xs text-ojen-muted mb-3">
          This metric is locked for non-subscribers only. Subscribe now to unlock full institutional
          excellence insights and benchmarks.
        </p>
        <RouterLink
          to="/en/subscriptions"
          class="flex items-center justify-center gap-2 rounded-md bg-ojen-panel-light border border-ojen-border py-2 text-sm hover:border-ojen-gold hover:text-ojen-gold transition"
        >
          <Icon name="crown" class="w-4 h-4" /> Subscribe to Unlock
        </RouterLink>
      </div>
    </div>

    <!-- Metric cards -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
      <MetricCard
        v-for="dim in DIMENSIONS"
        :key="dim.key"
        :icon="dim.icon"
        :label="dim.label"
        :value="headlineMetrics[dim.key]"
        :status="statusFor(dim, headlineMetrics[dim.key])"
      />
    </div>

    <!-- Three panel row -->
    <div class="grid lg:grid-cols-3 gap-4">
      <div class="rounded-xl border border-ojen-border bg-ojen-panel p-4">
        <div class="flex items-center justify-between mb-3">
          <p class="font-semibold text-sm flex items-center gap-1.5">
            <Icon name="chart" class="w-4 h-4 text-ojen-gold" /> Department Focus Overview (Top Focus Areas)
          </p>
          <button
            v-if="ql.departments.length > 1"
            class="text-xs text-ojen-gold hover:underline"
            @click="showAllDepartments = !showAllDepartments"
          >
            See all departments ›
          </button>
        </div>

        <div
          v-for="(dept, i) in showAllDepartments ? ql.departments : ql.departments.slice(0, 1)"
          :key="dept.department"
          class="rounded-lg p-3 mb-3"
          :class="i === 0 ? 'border border-ojen-gold/50' : 'border border-ojen-border'"
        >
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm font-medium flex items-center gap-2">
              <Icon name="users" class="w-4 h-4 text-ojen-muted" /> {{ dept.department }}
              <span v-if="i === 0" class="rounded bg-ojen-gold/20 text-ojen-gold text-[10px] px-1.5 py-0.5">
                Primary Focus
              </span>
            </p>
            <p class="text-sm font-semibold">{{ dept.score }}%</p>
          </div>
          <div class="flex items-center gap-3 mb-2">
            <p class="text-3xl font-bold" :class="i === 0 ? 'text-ojen-gold' : ''">{{ dept.score }}%</p>
            <p class="text-xs text-ojen-muted">
              vs Company Average<br />
              <span class="text-emerald-400 font-semibold">
                {{ dept.score - ql.overallQlScore >= 0 ? '+' : '' }}{{ dept.score - ql.overallQlScore }}%
              </span>
            </p>
          </div>
          <p class="text-xs text-ojen-muted mb-1">Key Drivers</p>
          <ul class="space-y-1">
            <li
              v-for="driver in departmentKeyDrivers(dept.metrics)"
              :key="driver.label"
              class="flex items-center justify-between text-xs"
            >
              <span class="text-ojen-muted">{{ driver.label }}</span>
              <span>{{ driver.value }}%</span>
            </li>
          </ul>
        </div>

        <p v-if="ql.departments.length === 0" class="text-sm text-ojen-muted">
          No survey responses yet. Send pulse survey links from the Employees tab to populate this
          department breakdown instantly.
        </p>
      </div>

      <div class="rounded-xl border border-ojen-border bg-ojen-panel p-4">
        <p class="font-semibold text-sm flex items-center gap-1.5 mb-3">
          <Icon name="info" class="w-4 h-4 text-ojen-gold" /> QL Impact Overview
        </p>
        <div class="rounded-lg border border-ojen-border p-3 flex gap-3">
          <Icon name="info" class="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <p class="text-sm font-medium mb-1">This section will be available soon</p>
            <p class="text-xs text-ojen-muted">
              QL Impact Overview appears after implementing at least one recommended action, sending
              the required plan surveys, and collecting enough data for at least one month.
            </p>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-ojen-border bg-ojen-panel p-4">
        <div class="flex items-center justify-between mb-3">
          <p class="font-semibold text-sm flex items-center gap-1.5">
            <Icon name="chart" class="w-4 h-4 text-ojen-gold" /> Trend Overview (Overall QL)
          </p>
          <select class="bg-ojen-panel-light border border-ojen-border rounded text-xs px-2 py-1">
            <option>Last 1 Months</option>
            <option>Last 3 Months</option>
            <option>Last 6 Months</option>
          </select>
        </div>
        <div class="rounded-lg border border-ojen-border p-3 flex gap-3">
          <Icon name="info" class="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <p class="text-sm font-medium mb-1">Trend chart will be available soon</p>
            <p class="text-xs text-ojen-muted">
              Trend Overview appears after enough monthly data is collected and at least two months
              pass from initial data availability.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Improvement plan -->
    <div v-if="hasData" class="rounded-xl border border-ojen-border bg-ojen-panel p-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1">
        <h2 class="font-semibold">
          Recommended QL Improvement Plan
          <span class="text-ojen-gold">for {{ focusDept?.department }}</span>
        </h2>
        <button
          class="rounded-md bg-ojen-gold text-ojen-bg text-sm font-semibold px-4 py-2 hover:bg-ojen-gold-light transition shrink-0"
          @click="handleAction({ title: 'Ask for Advice' } as ImprovementOption)"
        >
          Ask for Advice
        </button>
      </div>
      <p class="text-sm text-ojen-muted mb-5">
        Based on your QL analysis, we recommend the following solutions to improve engagement, reduce
        stress, and elevate team performance.
      </p>

      <div class="grid lg:grid-cols-3 gap-4">
        <ImprovementCard
          v-for="option in plan"
          :key="option.id"
          :option="option"
          :resolved="option.id === 1 ? option1Resolved : false"
          @action="handleAction"
          @resolve="resolveOption1"
        />
      </div>

      <div class="grid sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-ojen-border text-xs text-ojen-muted">
        <p class="flex items-center gap-2"><Icon name="target" class="w-4 h-4 text-ojen-gold" /> Address the root causes of low engagement and high stress in the priority department.</p>
        <p class="flex items-center gap-2"><Icon name="check-circle" class="w-4 h-4 text-emerald-400" /> Proven OJEN methodology with measurable and sustainable results.</p>
        <p class="flex items-center gap-2"><Icon name="gauge" class="w-4 h-4 text-sky-400" /> Designed to create lasting improvement in team performance and well-being.</p>
      </div>
    </div>
  </div>
</template>
