<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import Icon from '@/components/Icon.vue'
import { useQlStore } from '@/stores/ql'
import { useLocaleStore } from '@/stores/locale'
import type { Booking } from '@/types'

const ql = useQlStore()
const locale = useLocaleStore()

const showForm = ref(false)
const form = reactive({
  service: 'Corporate Quality of Life Interview',
  consultant: 'Millie Smith',
  date: '',
  time: '10:00',
  mode: 'Online' as Booking['mode'],
})

function createBooking() {
  if (!form.date) return
  ql.bookings.push({
    id: `bk-${Date.now()}`,
    service: form.service,
    consultant: form.consultant,
    date: form.date,
    time: form.time,
    mode: form.mode,
    status: 'Upcoming',
  })
  showForm.value = false
  form.date = ''
}

const statusClasses: Record<string, string> = {
  Upcoming: 'bg-sky-500/15 text-sky-400',
  Completed: 'bg-emerald-500/15 text-emerald-400',
  Cancelled: 'bg-red-500/15 text-red-400',
}

const statusKey: Record<string, string> = {
  Upcoming: 'bookings.upcoming',
  Completed: 'bookings.completed',
  Cancelled: 'bookings.cancelled',
}

const serviceKey: Record<string, string> = {
  'Corporate Quality of Life Interview': 'bookings.qolInterview',
  'Workshop + Coaching': 'bookings.workshopCoaching',
  'Complete Transformation Program': 'bookings.transformationProgram',
}
const serviceLabel = (service: string) => (serviceKey[service] ? locale.t(serviceKey[service]) : service)

function cancelBooking(b: Booking) {
  b.status = 'Cancelled'
}

const upcomingCount = computed(() => ql.bookings.filter((b) => b.status === 'Upcoming').length)
</script>

<template>
  <div>
    <div class="h-56 bg-gradient-to-r from-ojen-panel to-ojen-panel-light flex items-center justify-center border-b border-ojen-border">
      <h1 class="text-3xl font-bold">{{ locale.t('bookings.title') }}</h1>
    </div>

    <div class="mx-auto max-w-[1500px] px-4 sm:px-6 py-6 space-y-6">
      <p class="text-sm text-ojen-muted">{{ locale.t('bookings.breadcrumb') }}</p>

      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3 rounded-xl border border-ojen-border bg-ojen-panel p-4">
          <Icon name="calendar" class="w-5 h-5 text-ojen-gold" />
          <div>
            <p class="text-2xl font-bold leading-none">{{ ql.bookings.length }}</p>
            <p class="text-xs text-ojen-muted">{{ locale.t('bookings.totalBookings', { n: upcomingCount }) }}</p>
          </div>
        </div>
        <button
          class="rounded-md bg-ojen-gold text-ojen-bg font-semibold px-4 py-2.5 text-sm hover:bg-ojen-gold-light transition"
          @click="showForm = !showForm"
        >
          {{ showForm ? locale.t('bookings.cancel') : locale.t('bookings.newBooking') }}
        </button>
      </div>

      <div v-if="showForm" class="rounded-xl border border-ojen-gold/40 bg-ojen-panel p-5">
        <p class="font-semibold mb-4">{{ locale.t('bookings.bookSession') }}</p>
        <div class="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="text-xs text-ojen-muted mb-1 block">{{ locale.t('bookings.service') }}</label>
            <select v-model="form.service" class="w-full rounded-md bg-ojen-bg border border-ojen-border px-3 py-2.5 text-sm">
              <option value="Corporate Quality of Life Interview">{{ locale.t('bookings.qolInterview') }}</option>
              <option value="Workshop + Coaching">{{ locale.t('bookings.workshopCoaching') }}</option>
              <option value="Complete Transformation Program">{{ locale.t('bookings.transformationProgram') }}</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-ojen-muted mb-1 block">{{ locale.t('bookings.consultant') }}</label>
            <input v-model="form.consultant" class="w-full rounded-md bg-ojen-bg border border-ojen-border px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label class="text-xs text-ojen-muted mb-1 block">{{ locale.t('bookings.date') }}</label>
            <input v-model="form.date" type="date" class="w-full rounded-md bg-ojen-bg border border-ojen-border px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label class="text-xs text-ojen-muted mb-1 block">{{ locale.t('bookings.time') }}</label>
            <input v-model="form.time" type="time" class="w-full rounded-md bg-ojen-bg border border-ojen-border px-3 py-2.5 text-sm" />
          </div>
          <div>
            <label class="text-xs text-ojen-muted mb-1 block">{{ locale.t('bookings.mode') }}</label>
            <select v-model="form.mode" class="w-full rounded-md bg-ojen-bg border border-ojen-border px-3 py-2.5 text-sm">
              <option value="Online">{{ locale.t('bookings.online') }}</option>
              <option value="In-person">{{ locale.t('bookings.inPerson') }}</option>
            </select>
          </div>
        </div>
        <button class="rounded-md bg-ojen-gold text-ojen-bg font-semibold px-5 py-2.5 text-sm hover:bg-ojen-gold-light transition" @click="createBooking">
          {{ locale.t('bookings.confirmBooking') }}
        </button>
      </div>

      <div class="rounded-xl border border-ojen-border bg-ojen-panel p-5">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-start text-ojen-muted border-b border-ojen-border">
                <th class="py-2 pe-4">{{ locale.t('bookings.service') }}</th>
                <th class="py-2 pe-4">{{ locale.t('bookings.consultant') }}</th>
                <th class="py-2 pe-4">{{ locale.t('bookings.dateTime') }}</th>
                <th class="py-2 pe-4">{{ locale.t('bookings.mode') }}</th>
                <th class="py-2 pe-4">{{ locale.t('bookings.status') }}</th>
                <th class="py-2 pe-4">{{ locale.t('bookings.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="b in ql.bookings" :key="b.id" class="border-b border-ojen-border/60">
                <td class="py-3 pe-4">{{ serviceLabel(b.service) }}</td>
                <td class="py-3 pe-4 text-ojen-muted">{{ b.consultant }}</td>
                <td class="py-3 pe-4 text-ojen-muted" dir="ltr">{{ b.date }} {{ b.time }}</td>
                <td class="py-3 pe-4 text-ojen-muted">{{ b.mode === 'Online' ? locale.t('bookings.online') : locale.t('bookings.inPerson') }}</td>
                <td class="py-3 pe-4">
                  <span class="rounded px-2 py-0.5 text-[11px]" :class="statusClasses[b.status]">{{ locale.t(statusKey[b.status]) }}</span>
                </td>
                <td class="py-3 pe-4">
                  <button
                    v-if="b.status === 'Upcoming'"
                    class="text-xs text-red-400 hover:underline"
                    @click="cancelBooking(b)"
                  >
                    {{ locale.t('bookings.cancel') }}
                  </button>
                  <span v-else class="text-xs text-ojen-muted">—</span>
                </td>
              </tr>
              <tr v-if="ql.bookings.length === 0">
                <td colspan="6" class="py-6 text-center text-ojen-muted">{{ locale.t('bookings.noBookings') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
