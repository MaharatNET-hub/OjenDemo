<script setup lang="ts">
import { computed, ref } from 'vue'
import Icon from '@/components/Icon.vue'
import { useQlStore } from '@/stores/ql'
import { useLocaleStore } from '@/stores/locale'

const ql = useQlStore()
const locale = useLocaleStore()
const emailInput = ref('')
const copiedToken = ref<string | null>(null)

function surveyUrl(token: string) {
  return `${window.location.origin}${import.meta.env.BASE_URL}survey/${token}`
}

function sendLinks() {
  const emails = emailInput.value
    .split(/[\s,]+/)
    .map((e) => e.trim())
    .filter(Boolean)
  if (emails.length === 0) return
  ql.sendInvitations(emails)
  emailInput.value = ''
}

async function copyLink(token: string) {
  const url = surveyUrl(token)
  try {
    await navigator.clipboard.writeText(url)
  } catch {
    // clipboard API unavailable, fall back silently
  }
  copiedToken.value = token
  setTimeout(() => {
    if (copiedToken.value === token) copiedToken.value = null
  }, 2000)
}

const sortedInvitations = computed(() =>
  [...ql.invitations].sort((a, b) => (a.sentDate < b.sentDate ? 1 : -1)),
)

const genderKey = (gender: string) => (gender === 'Male' ? 'employees.male' : 'employees.female')
</script>

<template>
  <div>
    <div class="h-56 bg-gradient-to-r from-ojen-panel to-ojen-panel-light flex items-center justify-center border-b border-ojen-border">
      <h1 class="text-3xl font-bold">{{ locale.t('employees.title') }}</h1>
    </div>

    <div class="mx-auto max-w-[1500px] px-4 sm:px-6 py-6 space-y-6">
      <p class="text-sm text-ojen-muted">{{ locale.t('employees.breadcrumb') }}</p>

      <div class="rounded-xl border border-ojen-gold/40 bg-ojen-panel p-5">
        <p class="font-semibold flex items-center gap-2 mb-4">
          <Icon name="send" class="w-4 h-4 text-ojen-gold" /> {{ locale.t('employees.sendPulseSurveyLink', { company: ql.companyName }) }}
        </p>
        <p class="text-sm flex items-center gap-2 text-ojen-gold mb-2">
          <Icon name="mail" class="w-4 h-4" /> {{ locale.t('employees.enterEmails') }}
        </p>
        <label class="text-xs text-ojen-muted mb-1 block">{{ locale.t('employees.addEmails') }}</label>
        <input
          v-model="emailInput"
          type="text"
          :placeholder="locale.t('employees.emailPlaceholder')"
          class="w-full rounded-md bg-ojen-bg border border-ojen-border px-3 py-2.5 text-sm mb-3 focus:outline-none focus:border-ojen-gold"
          @keydown.enter.prevent="sendLinks"
        />
        <button
          class="rounded-md bg-ojen-gold text-ojen-bg font-semibold px-5 py-2.5 text-sm hover:bg-ojen-gold-light transition"
          @click="sendLinks"
        >
          {{ locale.t('employees.sendLinks') }}
        </button>
        <p class="text-xs text-ojen-muted mt-3">
          {{ locale.t('employees.disclaimer') }}
        </p>
      </div>

      <div class="rounded-xl border border-ojen-border bg-ojen-panel p-5">
        <p class="font-semibold flex items-center gap-2 mb-4">
          <Icon name="chart" class="w-4 h-4 text-ojen-gold" /> {{ locale.t('employees.sentInvitations') }}
        </p>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-start text-ojen-muted border-b border-ojen-border">
                <th class="py-2 pe-4">{{ locale.t('employees.hash') }}</th>
                <th class="py-2 pe-4">{{ locale.t('employees.email') }}</th>
                <th class="py-2 pe-4">{{ locale.t('employees.invitationStatus') }}</th>
                <th class="py-2 pe-4">{{ locale.t('employees.sentDate') }}</th>
                <th class="py-2 pe-4">{{ locale.t('employees.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(inv, i) in sortedInvitations"
                :key="inv.id"
                class="border-b border-ojen-border/60"
              >
                <td class="py-3 pe-4">{{ i + 1 }}</td>
                <td class="py-3 pe-4 flex items-center gap-2">
                  <Icon name="mail" class="w-4 h-4 text-ojen-muted" /> {{ inv.email }}
                </td>
                <td class="py-3 pe-4">
                  <span
                    class="rounded px-2 py-1 text-[11px] font-semibold"
                    :class="
                      inv.status === 'pending'
                        ? 'bg-amber-500/15 text-amber-400'
                        : 'bg-emerald-500/15 text-emerald-400'
                    "
                  >
                    {{ inv.status === 'pending' ? locale.t('employees.pending') : locale.t('employees.accepted') }}
                  </span>
                </td>
                <td class="py-3 pe-4 text-ojen-muted">{{ inv.sentDate }}</td>
                <td class="py-3 pe-4">
                  <div v-if="inv.status === 'pending'" class="flex items-center gap-2">
                    <RouterLink
                      :to="`/survey/${inv.token}`"
                      target="_blank"
                      class="text-ojen-gold hover:underline text-xs"
                    >
                      {{ locale.t('employees.openSurvey') }}
                    </RouterLink>
                    <button class="text-ojen-muted hover:text-ojen-text text-xs" @click="copyLink(inv.token)">
                      {{ copiedToken === inv.token ? locale.t('employees.copied') : locale.t('employees.copyLink') }}
                    </button>
                  </div>
                  <span v-else class="text-ojen-muted text-xs">—</span>
                </td>
              </tr>
              <tr v-if="sortedInvitations.length === 0">
                <td colspan="5" class="py-6 text-center text-ojen-muted">{{ locale.t('employees.noInvitations') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex items-center gap-3 rounded-xl border border-ojen-border bg-ojen-panel p-4 w-fit">
        <Icon name="users" class="w-5 h-5 text-ojen-gold" />
        <div>
          <p class="text-2xl font-bold leading-none">{{ ql.employees.length }}</p>
          <p class="text-xs text-ojen-muted">{{ locale.t('employees.totalEmployees') }}</p>
        </div>
      </div>

      <div class="rounded-xl border border-ojen-border bg-ojen-panel p-5">
        <p class="font-semibold flex items-center gap-2 mb-4">
          <Icon name="user" class="w-4 h-4 text-ojen-gold" /> {{ locale.t('employees.employeesTable') }}
        </p>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-start text-ojen-muted border-b border-ojen-border">
                <th class="py-2 pe-4">{{ locale.t('employees.hash') }}</th>
                <th class="py-2 pe-4">{{ locale.t('employees.name') }}</th>
                <th class="py-2 pe-4">{{ locale.t('employees.email') }}</th>
                <th class="py-2 pe-4">{{ locale.t('employees.phone') }}</th>
                <th class="py-2 pe-4">{{ locale.t('employees.department') }}</th>
                <th class="py-2 pe-4">{{ locale.t('employees.gender') }}</th>
                <th class="py-2 pe-4">{{ locale.t('employees.joined') }}</th>
                <th class="py-2 pe-4">{{ locale.t('employees.status') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(emp, i) in ql.employees" :key="emp.id" class="border-b border-ojen-border/60">
                <td class="py-3 pe-4">{{ i + 1 }}</td>
                <td class="py-3 pe-4 flex items-center gap-2">
                  <span class="w-6 h-6 rounded-full bg-ojen-gold/20 text-ojen-gold text-[10px] flex items-center justify-center font-semibold">
                    {{ emp.name.slice(0, 2).toUpperCase() }}
                  </span>
                  {{ emp.name }}
                </td>
                <td class="py-3 pe-4 text-ojen-muted">{{ emp.email }}</td>
                <td class="py-3 pe-4 text-ojen-muted" dir="ltr">{{ emp.phone }}</td>
                <td class="py-3 pe-4 text-ojen-muted">{{ locale.department(emp.department) }}</td>
                <td class="py-3 pe-4">
                  <span class="rounded px-2 py-0.5 text-[11px] bg-sky-500/15 text-sky-400">{{ locale.t(genderKey(emp.gender)) }}</span>
                </td>
                <td class="py-3 pe-4 text-ojen-muted">{{ emp.joined }}</td>
                <td class="py-3 pe-4">
                  <span class="rounded px-2 py-0.5 text-[11px] bg-emerald-500/15 text-emerald-400">
                    {{ locale.t('employees.active') }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
