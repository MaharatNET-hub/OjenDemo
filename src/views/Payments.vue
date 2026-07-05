<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@/components/Icon.vue'
import { useQlStore } from '@/stores/ql'

const ql = useQlStore()

const total = computed(() => ql.payments.reduce((sum, p) => sum + p.amount, 0))
const paidCount = computed(() => ql.payments.filter((p) => p.status === 'Paid').length)

const statusClasses: Record<string, string> = {
  Paid: 'bg-emerald-500/15 text-emerald-400',
  Pending: 'bg-amber-500/15 text-amber-400',
  Failed: 'bg-red-500/15 text-red-400',
}
</script>

<template>
  <div>
    <div class="h-56 bg-gradient-to-r from-ojen-panel to-ojen-panel-light flex items-center justify-center border-b border-ojen-border">
      <h1 class="text-3xl font-bold">Payments</h1>
    </div>

    <div class="mx-auto max-w-[1500px] px-4 sm:px-6 py-6 space-y-6">
      <p class="text-sm text-ojen-muted">Home &gt; Payments</p>

      <div class="grid sm:grid-cols-2 gap-3">
        <div class="rounded-xl border border-ojen-gold/40 bg-ojen-panel p-4 flex items-center gap-3">
          <Icon name="wallet" class="w-5 h-5 text-ojen-gold" />
          <div>
            <p class="text-2xl font-bold leading-none">{{ total.toFixed(2) }}</p>
            <p class="text-xs text-ojen-muted">Total Amount Paid</p>
          </div>
        </div>
        <div class="rounded-xl border border-emerald-500/40 bg-ojen-panel p-4 flex items-center gap-3">
          <Icon name="check-circle" class="w-5 h-5 text-emerald-400" />
          <div>
            <p class="text-2xl font-bold leading-none">{{ paidCount }}</p>
            <p class="text-xs text-ojen-muted">Completed Payments</p>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-ojen-border bg-ojen-panel p-5">
        <p class="font-semibold flex items-center gap-2 mb-4">
          <Icon name="credit-card" class="w-4 h-4 text-ojen-gold" /> Payment History
        </p>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-ojen-muted border-b border-ojen-border">
                <th class="py-2 pr-4">Description</th>
                <th class="py-2 pr-4">Date</th>
                <th class="py-2 pr-4">Amount</th>
                <th class="py-2 pr-4">Method</th>
                <th class="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in ql.payments" :key="p.id" class="border-b border-ojen-border/60">
                <td class="py-3 pr-4">{{ p.description }}</td>
                <td class="py-3 pr-4 text-ojen-muted">{{ p.date }}</td>
                <td class="py-3 pr-4">${{ p.amount.toFixed(2) }}</td>
                <td class="py-3 pr-4 text-ojen-muted">{{ p.method }}</td>
                <td class="py-3 pr-4">
                  <span class="rounded px-2 py-0.5 text-[11px]" :class="statusClasses[p.status]">{{ p.status }}</span>
                </td>
              </tr>
              <tr v-if="ql.payments.length === 0">
                <td colspan="5" class="py-6 text-center text-ojen-muted">No payments yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
