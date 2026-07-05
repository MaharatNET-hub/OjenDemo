<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import Icon from '@/components/Icon.vue'
import { useQlStore } from '@/stores/ql'

const ql = useQlStore()

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

const baseline = [
  { label: 'Company Name', value: ql.companyLegalName },
  { label: 'Your Name & Role', value: 'Hr' },
  { label: 'Number of Employees', value: '20' },
  { label: 'Goals (select up to 3)', value: 'Culture' },
  { label: 'Priority Focus', value: 'Culture' },
  { label: 'Investment Level', value: '250 - 500K' },
  { label: 'Expected Start', value: '2026-06-25' },
]
</script>

<template>
  <div>
    <div class="h-56 bg-gradient-to-r from-ojen-panel to-ojen-panel-light flex items-center justify-center border-b border-ojen-border">
      <h1 class="text-3xl font-bold">My Profile</h1>
    </div>

    <div class="mx-auto max-w-[1500px] px-4 sm:px-6 py-6 space-y-6">
      <p class="text-sm text-ojen-muted">Home &gt; My Profile &gt; My Profile</p>

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
              <Icon name="briefcase" class="w-3 h-3" /> Corporate Account
            </span>
          </div>

          <div class="space-y-2 text-sm mb-5">
            <p class="flex items-center gap-2 text-ojen-muted"><Icon name="mail" class="w-4 h-4" /> {{ ql.profile.email }}</p>
            <p class="flex items-center gap-2 text-ojen-muted"><Icon name="phone" class="w-4 h-4" /> {{ ql.profile.phone }}</p>
            <p class="flex items-center gap-2 text-ojen-muted"><Icon name="calendar" class="w-4 h-4" /> {{ ql.profile.ageRange }}</p>
          </div>

          <div class="space-y-2">
            <button
              class="w-full flex items-center justify-center gap-2 rounded-md border border-ojen-border py-2.5 text-sm hover:border-ojen-gold hover:text-ojen-gold transition"
              @click="startEdit"
            >
              <Icon name="edit" class="w-4 h-4" /> Edit Profile
            </button>
            <button
              class="w-full flex items-center justify-center gap-2 rounded-md border border-ojen-border py-2.5 text-sm hover:border-ojen-gold hover:text-ojen-gold transition"
              @click="changingPassword = true"
            >
              <Icon name="key" class="w-4 h-4" /> Change Password
            </button>
          </div>

          <div v-if="editing" class="mt-5 pt-5 border-t border-ojen-border space-y-3 text-left">
            <div>
              <label class="text-xs text-ojen-muted mb-1 block">Company Name</label>
              <input v-model="form.companyName" class="w-full rounded-md bg-ojen-bg border border-ojen-border px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="text-xs text-ojen-muted mb-1 block">Email</label>
              <input v-model="form.email" class="w-full rounded-md bg-ojen-bg border border-ojen-border px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="text-xs text-ojen-muted mb-1 block">Phone</label>
              <input v-model="form.phone" class="w-full rounded-md bg-ojen-bg border border-ojen-border px-3 py-2 text-sm" />
            </div>
            <div class="flex gap-2">
              <button class="flex-1 rounded-md bg-ojen-gold text-ojen-bg text-sm font-semibold py-2" @click="saveEdit">
                Save
              </button>
              <button class="flex-1 rounded-md border border-ojen-border text-sm py-2" @click="editing = false">
                Cancel
              </button>
            </div>
          </div>

          <div v-if="changingPassword" class="mt-5 pt-5 border-t border-ojen-border text-left">
            <p class="text-xs text-ojen-muted mb-3">
              Password changes aren't wired to a backend in this demo build.
            </p>
            <button class="w-full rounded-md border border-ojen-border text-sm py-2" @click="changingPassword = false">
              Close
            </button>
          </div>
        </div>

        <div>
          <h2 class="font-semibold flex items-center gap-2 mb-4">
            <Icon name="chart" class="w-4 h-4 text-ojen-gold" /> Account Statistics
          </h2>
          <div class="grid sm:grid-cols-2 gap-3 mb-6">
            <div class="rounded-xl border border-ojen-gold/40 bg-ojen-panel p-4 flex items-center gap-3">
              <Icon name="crown" class="w-5 h-5 text-ojen-gold" />
              <div><p class="text-2xl font-bold leading-none">{{ ql.subscriptions.length }}</p><p class="text-xs text-ojen-muted">Total Subscriptions</p></div>
            </div>
            <div class="rounded-xl border border-emerald-500/40 bg-ojen-panel p-4 flex items-center gap-3">
              <Icon name="check-circle" class="w-5 h-5 text-emerald-400" />
              <div><p class="text-2xl font-bold leading-none">{{ activeSubs }}</p><p class="text-xs text-ojen-muted">Active Subscriptions</p></div>
            </div>
            <div class="rounded-xl border border-sky-500/40 bg-ojen-panel p-4 flex items-center gap-3">
              <Icon name="users" class="w-5 h-5 text-sky-400" />
              <div><p class="text-2xl font-bold leading-none">{{ ql.employees.length }}</p><p class="text-xs text-ojen-muted">Total Employees</p></div>
            </div>
            <div class="rounded-xl border border-sky-500/40 bg-ojen-panel p-4 flex items-center gap-3">
              <Icon name="calendar" class="w-5 h-5 text-sky-400" />
              <div><p class="text-2xl font-bold leading-none">{{ ql.bookings.length }}</p><p class="text-xs text-ojen-muted">Corporate Bookings</p></div>
            </div>
            <div class="rounded-xl border border-ojen-gold/40 bg-ojen-panel p-4 flex items-center gap-3 sm:col-span-2">
              <Icon name="wallet" class="w-5 h-5 text-ojen-gold" />
              <div><p class="text-2xl font-bold leading-none">{{ totalPaid.toFixed(2) }}</p><p class="text-xs text-ojen-muted">Total Amount Paid</p></div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-ojen-gold/40 bg-ojen-panel p-5">
        <p class="font-semibold flex items-center gap-2 mb-4">
          <Icon name="briefcase" class="w-4 h-4 text-ojen-gold" /> Baseline Corporate survey (your answers)
        </p>
        <div class="grid sm:grid-cols-2 gap-x-8 gap-y-4">
          <div v-for="item in baseline" :key="item.label" class="border-b border-ojen-border pb-2">
            <p class="text-xs text-ojen-gold mb-1">{{ item.label }}</p>
            <p class="text-sm">{{ item.value }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-sky-500/30 bg-ojen-panel p-5">
        <p class="font-semibold flex items-center gap-2 mb-4">
          <Icon name="chart" class="w-4 h-4 text-sky-400" /> Survey interview requests (program or QI)
        </p>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-ojen-muted border-b border-ojen-border">
                <th class="py-2 pr-4">Request type</th>
                <th class="py-2 pr-4">Requested services</th>
                <th class="py-2 pr-4">Consultant</th>
                <th class="py-2 pr-4">Interview date &amp; time</th>
                <th class="py-2 pr-4">Interview status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="b in ql.bookings" :key="b.id" class="border-b border-ojen-border/60">
                <td class="py-3 pr-4"><span class="rounded bg-sky-500/15 text-sky-400 px-2 py-0.5 text-[11px]">QI</span></td>
                <td class="py-3 pr-4">{{ b.service }}</td>
                <td class="py-3 pr-4 text-ojen-muted">{{ b.consultant }}</td>
                <td class="py-3 pr-4 text-ojen-muted">{{ b.date }} {{ b.time }}</td>
                <td class="py-3 pr-4">
                  <span class="rounded px-2 py-0.5 text-[11px] bg-ojen-panel-light text-ojen-muted">{{ b.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="grid sm:grid-cols-2 gap-4">
        <div class="rounded-xl border border-ojen-gold/40 bg-ojen-panel p-5">
          <p class="font-semibold flex items-center gap-2 mb-4">
            <Icon name="info" class="w-4 h-4 text-ojen-gold" /> Account Details
          </p>
          <dl class="space-y-3 text-sm">
            <div class="flex justify-between border-b border-ojen-border pb-2">
              <dt class="text-ojen-muted">Account Type</dt>
              <dd><span class="rounded bg-sky-500/15 text-sky-400 px-2 py-0.5 text-[11px]">Corporate</span></dd>
            </div>
            <div class="flex justify-between border-b border-ojen-border pb-2">
              <dt class="text-ojen-muted">Member Since</dt>
              <dd>{{ ql.profile.memberSince }}</dd>
            </div>
            <div class="flex justify-between border-b border-ojen-border pb-2">
              <dt class="text-ojen-muted">Country</dt>
              <dd>{{ ql.profile.country }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-ojen-muted">Department / Section</dt>
              <dd>{{ ql.profile.departmentSection }}</dd>
            </div>
          </dl>
        </div>

        <div class="rounded-xl border border-sky-500/30 bg-ojen-panel p-5">
          <p class="font-semibold flex items-center gap-2 mb-4">
            <Icon name="calendar" class="w-4 h-4 text-sky-400" /> Additional Information
          </p>
          <dl class="space-y-3 text-sm">
            <div class="flex justify-between border-b border-ojen-border pb-2">
              <dt class="text-ojen-muted">Phone</dt>
              <dd>{{ ql.profile.phone }}</dd>
            </div>
            <div class="flex justify-between border-b border-ojen-border pb-2">
              <dt class="text-ojen-muted">Email</dt>
              <dd>{{ ql.profile.email }}</dd>
            </div>
            <div class="flex justify-between border-b border-ojen-border pb-2">
              <dt class="text-ojen-muted">Employees Count</dt>
              <dd>{{ ql.employees.length }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-ojen-muted">Account Status</dt>
              <dd><span class="rounded bg-emerald-500/15 text-emerald-400 px-2 py-0.5 text-[11px]">Verified</span></dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>
