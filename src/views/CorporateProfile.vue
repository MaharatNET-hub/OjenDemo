<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import Icon from '@/components/Icon.vue'
import { useQlStore } from '@/stores/ql'
import { useLocaleStore } from '@/stores/locale'

const ql = useQlStore()
const locale = useLocaleStore()

const editing = ref(false)
const form = reactive({
  companyName: ql.companyName,
  email: ql.profile.email,
  phone: ql.profile.phone,
})

function startEdit() {
  form.companyName = ql.companyName
  form.email = ql.profile.email
  form.phone = ql.profile.phone
  editing.value = true
}
function saveEdit() {
  ql.companyName = form.companyName
  ql.profile.email = form.email
  ql.profile.phone = form.phone
  editing.value = false
}

const changingPassword = ref(false)
const totalPaid = computed(() => ql.payments.reduce((sum, p) => sum + p.amount, 0))
const activeSubs = computed(() => ql.subscriptions.filter((s) => s.status === 'Active').length)

const baseline = computed(() => [
  { labelKey: 'profile.companyNameField', value: ql.companyLegalName, ltr: false },
  { labelKey: 'profile.yourNameRole', value: locale.t('profile.hr'), ltr: false },
  { labelKey: 'profile.numberOfEmployees', value: '20', ltr: false },
  { labelKey: 'profile.goals', value: locale.t('profile.culture'), ltr: false },
  { labelKey: 'profile.priorityFocus', value: locale.t('profile.culture'), ltr: false },
  { labelKey: 'profile.investmentLevel', value: '250 - 500K', ltr: true },
  { labelKey: 'profile.expectedStart', value: '2026-06-25', ltr: false },
])

const bookingStatusKey: Record<string, string> = {
  Upcoming: 'bookings.upcoming',
  Completed: 'bookings.completed',
  Cancelled: 'bookings.cancelled',
}
</script>

<template>
  <div>
    <div class="h-56 bg-gradient-to-r from-ojen-panel to-ojen-panel-light flex items-center justify-center border-b border-ojen-border">
      <h1 class="text-3xl font-bold">{{ locale.t('profile.title') }}</h1>
    </div>

    <div class="mx-auto max-w-[1500px] px-4 sm:px-6 py-6 space-y-6">
      <p class="text-sm text-ojen-muted">{{ locale.t('profile.breadcrumb') }}</p>

      <div class="grid lg:grid-cols-[320px_1fr] gap-6">
        <div class="rounded-xl border border-ojen-border bg-ojen-panel p-6 h-fit">
          <div class="flex flex-col items-center text-center mb-4">
            <span class="w-16 h-16 rounded-full bg-ojen-gold/20 flex items-center justify-center mb-3">
              <Icon name="building" class="w-7 h-7 text-ojen-gold" />
            </span>
            <p class="font-semibold text-ojen-gold">{{ ql.companyName }}</p>
            <p class="text-xs text-ojen-muted flex items-center gap-1 mt-1">
              <Icon name="building" class="w-3 h-3" /> {{ ql.companyLegalName }}
            </p>
            <span class="mt-2 rounded-full bg-sky-500/15 text-sky-400 text-[11px] px-3 py-1 flex items-center gap-1">
              <Icon name="briefcase" class="w-3 h-3" /> {{ locale.t('profile.corporateAccount') }}
            </span>
          </div>

          <div class="space-y-2 text-sm mb-5">
            <p class="flex items-center gap-2 text-ojen-muted"><Icon name="mail" class="w-4 h-4" /> <span dir="ltr">{{ ql.profile.email }}</span></p>
            <p class="flex items-center gap-2 text-ojen-muted"><Icon name="phone" class="w-4 h-4" /> <span dir="ltr">{{ ql.profile.phone }}</span></p>
            <p class="flex items-center gap-2 text-ojen-muted"><Icon name="calendar" class="w-4 h-4" /> <span dir="ltr">{{ ql.profile.ageRange }}</span></p>
          </div>

          <div class="space-y-2">
            <button
              class="w-full flex items-center justify-center gap-2 rounded-md border border-ojen-border py-2.5 text-sm hover:border-ojen-gold hover:text-ojen-gold transition"
              @click="startEdit"
            >
              <Icon name="edit" class="w-4 h-4" /> {{ locale.t('profile.editProfile') }}
            </button>
            <button
              class="w-full flex items-center justify-center gap-2 rounded-md border border-ojen-border py-2.5 text-sm hover:border-ojen-gold hover:text-ojen-gold transition"
              @click="changingPassword = true"
            >
              <Icon name="key" class="w-4 h-4" /> {{ locale.t('profile.changePassword') }}
            </button>
          </div>

          <div v-if="editing" class="mt-5 pt-5 border-t border-ojen-border space-y-3 text-start">
            <div>
              <label class="text-xs text-ojen-muted mb-1 block">{{ locale.t('profile.companyName') }}</label>
              <input v-model="form.companyName" class="w-full rounded-md bg-ojen-bg border border-ojen-border px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="text-xs text-ojen-muted mb-1 block">{{ locale.t('profile.email') }}</label>
              <input v-model="form.email" class="w-full rounded-md bg-ojen-bg border border-ojen-border px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="text-xs text-ojen-muted mb-1 block">{{ locale.t('profile.phone') }}</label>
              <input v-model="form.phone" class="w-full rounded-md bg-ojen-bg border border-ojen-border px-3 py-2 text-sm" />
            </div>
            <div class="flex gap-2">
              <button class="flex-1 rounded-md bg-ojen-gold text-ojen-ink text-sm font-semibold py-2" @click="saveEdit">
                {{ locale.t('profile.save') }}
              </button>
              <button class="flex-1 rounded-md border border-ojen-border text-sm py-2" @click="editing = false">
                {{ locale.t('profile.cancel') }}
              </button>
            </div>
          </div>

          <div v-if="changingPassword" class="mt-5 pt-5 border-t border-ojen-border text-start">
            <p class="text-xs text-ojen-muted mb-3">
              {{ locale.t('profile.passwordNotice') }}
            </p>
            <button class="w-full rounded-md border border-ojen-border text-sm py-2" @click="changingPassword = false">
              {{ locale.t('profile.close') }}
            </button>
          </div>
        </div>

        <div>
          <h2 class="font-semibold flex items-center gap-2 mb-4">
            <Icon name="chart" class="w-4 h-4 text-ojen-gold" /> {{ locale.t('profile.accountStatistics') }}
          </h2>
          <div class="grid sm:grid-cols-2 gap-3 mb-6">
            <div class="rounded-xl border border-ojen-gold/40 bg-ojen-panel p-4 flex items-center gap-3">
              <Icon name="crown" class="w-5 h-5 text-ojen-gold" />
              <div><p class="text-2xl font-bold leading-none">{{ ql.subscriptions.length }}</p><p class="text-xs text-ojen-muted">{{ locale.t('profile.totalSubscriptions') }}</p></div>
            </div>
            <div class="rounded-xl border border-emerald-500/40 bg-ojen-panel p-4 flex items-center gap-3">
              <Icon name="check-circle" class="w-5 h-5 text-emerald-400" />
              <div><p class="text-2xl font-bold leading-none">{{ activeSubs }}</p><p class="text-xs text-ojen-muted">{{ locale.t('profile.activeSubscriptions') }}</p></div>
            </div>
            <div class="rounded-xl border border-sky-500/40 bg-ojen-panel p-4 flex items-center gap-3">
              <Icon name="users" class="w-5 h-5 text-sky-400" />
              <div><p class="text-2xl font-bold leading-none">{{ ql.employees.length }}</p><p class="text-xs text-ojen-muted">{{ locale.t('profile.totalEmployees') }}</p></div>
            </div>
            <div class="rounded-xl border border-sky-500/40 bg-ojen-panel p-4 flex items-center gap-3">
              <Icon name="calendar" class="w-5 h-5 text-sky-400" />
              <div><p class="text-2xl font-bold leading-none">{{ ql.bookings.length }}</p><p class="text-xs text-ojen-muted">{{ locale.t('profile.corporateBookings') }}</p></div>
            </div>
            <div class="rounded-xl border border-ojen-gold/40 bg-ojen-panel p-4 flex items-center gap-3 sm:col-span-2">
              <Icon name="wallet" class="w-5 h-5 text-ojen-gold" />
              <div><p class="text-2xl font-bold leading-none">{{ totalPaid.toFixed(2) }}</p><p class="text-xs text-ojen-muted">{{ locale.t('profile.totalAmountPaid') }}</p></div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-ojen-gold/40 bg-ojen-panel p-5">
        <p class="font-semibold flex items-center gap-2 mb-4">
          <Icon name="briefcase" class="w-4 h-4 text-ojen-gold" /> {{ locale.t('profile.baselineSurvey') }}
        </p>
        <div class="grid sm:grid-cols-2 gap-x-8 gap-y-4">
          <div v-for="item in baseline" :key="item.labelKey" class="border-b border-ojen-border pb-2">
            <p class="text-xs text-ojen-gold mb-1">{{ locale.t(item.labelKey) }}</p>
            <p class="text-sm" :dir="item.ltr ? 'ltr' : undefined">{{ item.value }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-sky-500/30 bg-ojen-panel p-5">
        <p class="font-semibold flex items-center gap-2 mb-4">
          <Icon name="chart" class="w-4 h-4 text-sky-400" /> {{ locale.t('profile.surveyInterviewRequests') }}
        </p>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-start text-ojen-muted border-b border-ojen-border">
                <th class="py-2 pe-4">{{ locale.t('profile.requestType') }}</th>
                <th class="py-2 pe-4">{{ locale.t('profile.requestedServices') }}</th>
                <th class="py-2 pe-4">{{ locale.t('profile.consultant') }}</th>
                <th class="py-2 pe-4">{{ locale.t('profile.interviewDateTime') }}</th>
                <th class="py-2 pe-4">{{ locale.t('profile.interviewStatus') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="b in ql.bookings" :key="b.id" class="border-b border-ojen-border/60">
                <td class="py-3 pe-4"><span class="rounded bg-sky-500/15 text-sky-400 px-2 py-0.5 text-[11px]">QI</span></td>
                <td class="py-3 pe-4">{{ b.service }}</td>
                <td class="py-3 pe-4 text-ojen-muted">{{ b.consultant }}</td>
                <td class="py-3 pe-4 text-ojen-muted" dir="ltr">{{ b.date }} {{ b.time }}</td>
                <td class="py-3 pe-4">
                  <span class="rounded px-2 py-0.5 text-[11px] bg-ojen-panel-light text-ojen-muted">{{ locale.t(bookingStatusKey[b.status] ?? b.status) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="grid sm:grid-cols-2 gap-4">
        <div class="rounded-xl border border-ojen-gold/40 bg-ojen-panel p-5">
          <p class="font-semibold flex items-center gap-2 mb-4">
            <Icon name="info" class="w-4 h-4 text-ojen-gold" /> {{ locale.t('profile.accountDetails') }}
          </p>
          <dl class="space-y-3 text-sm">
            <div class="flex justify-between border-b border-ojen-border pb-2">
              <dt class="text-ojen-muted">{{ locale.t('profile.accountType') }}</dt>
              <dd><span class="rounded bg-sky-500/15 text-sky-400 px-2 py-0.5 text-[11px]">{{ locale.t('profile.corporate') }}</span></dd>
            </div>
            <div class="flex justify-between border-b border-ojen-border pb-2">
              <dt class="text-ojen-muted">{{ locale.t('profile.memberSince') }}</dt>
              <dd dir="ltr">{{ ql.profile.memberSince }}</dd>
            </div>
            <div class="flex justify-between border-b border-ojen-border pb-2">
              <dt class="text-ojen-muted">{{ locale.t('profile.country') }}</dt>
              <dd>{{ locale.t('profile.uae') }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-ojen-muted">{{ locale.t('profile.departmentSection') }}</dt>
              <dd>{{ locale.t('profile.humanResources') }}</dd>
            </div>
          </dl>
        </div>

        <div class="rounded-xl border border-sky-500/30 bg-ojen-panel p-5">
          <p class="font-semibold flex items-center gap-2 mb-4">
            <Icon name="calendar" class="w-4 h-4 text-sky-400" /> {{ locale.t('profile.additionalInformation') }}
          </p>
          <dl class="space-y-3 text-sm">
            <div class="flex justify-between border-b border-ojen-border pb-2">
              <dt class="text-ojen-muted">{{ locale.t('profile.phone') }}</dt>
              <dd dir="ltr">{{ ql.profile.phone }}</dd>
            </div>
            <div class="flex justify-between border-b border-ojen-border pb-2">
              <dt class="text-ojen-muted">{{ locale.t('profile.email') }}</dt>
              <dd>{{ ql.profile.email }}</dd>
            </div>
            <div class="flex justify-between border-b border-ojen-border pb-2">
              <dt class="text-ojen-muted">{{ locale.t('profile.employeesCount') }}</dt>
              <dd>{{ ql.employees.length }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-ojen-muted">{{ locale.t('profile.accountStatus') }}</dt>
              <dd><span class="rounded bg-emerald-500/15 text-emerald-400 px-2 py-0.5 text-[11px]">{{ locale.t('profile.verified') }}</span></dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>
