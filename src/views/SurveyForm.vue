<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ALL_DIMENSIONS, surveyQuestion, answersToPercent } from '@/data/qlEngine'
import { DEPARTMENTS, useQlStore } from '@/stores/ql'
import { useLocaleStore } from '@/stores/locale'
import type { Dimension } from '@/types'

const props = defineProps<{ token: string }>()
const ql = useQlStore()
const locale = useLocaleStore()
const router = useRouter()

const invitation = computed(() => ql.findInvitation(props.token))
const alreadySubmitted = ref(invitation.value?.status === 'accepted')

const employeeName = ref('')
const employeeEmail = ref(invitation.value?.email ?? '')
const department = ref(DEPARTMENTS[0])

const answers = reactive<Record<Dimension, number>>({
  engagement: 3,
  stress: 3,
  alignment: 3,
  energy: 3,
  workloadBalance: 3,
  growthDev: 3,
  teamConnection: 3,
  productivity: 3,
})

const scaleLabelKeys = ['survey.stronglyDisagree', 'survey.stronglyAgree']

const submitted = ref(false)
const hasError = ref(false)

function submit() {
  hasError.value = false
  if (!employeeName.value.trim() || !employeeEmail.value.trim()) {
    hasError.value = true
    return
  }
  ql.submitSurvey({
    token: invitation.value ? props.token : null,
    employeeName: employeeName.value.trim(),
    employeeEmail: employeeEmail.value.trim(),
    department: department.value,
    answers: answersToPercent(answers),
  })
  submitted.value = true
}

function goToDashboard() {
  router.push('/en/profile/ql-overview')
}
</script>

<template>
  <div class="min-h-screen bg-ojen-bg px-4 py-10 relative">
    <button
      class="absolute top-4 end-4 w-9 h-9 flex items-center justify-center rounded-full border border-ojen-border text-xs font-semibold hover:border-ojen-gold"
      @click="locale.toggleLocale"
    >
      {{ locale.locale === 'ar' ? 'EN' : 'AR' }}
    </button>
    <div class="mx-auto max-w-2xl">
      <div class="mb-6 text-center">
        <div class="inline-block border border-ojen-gold/60 rounded px-3 py-1 text-ojen-gold tracking-[0.2em] font-semibold">
          OJEN
        </div>
        <h1 class="text-xl font-semibold mt-4">{{ locale.t('survey.title') }}</h1>
        <p class="text-sm text-ojen-muted">
          {{ locale.t('survey.subtitle') }}
        </p>
      </div>

      <div v-if="alreadySubmitted && !submitted" class="rounded-xl border border-ojen-border bg-ojen-panel p-6 text-center">
        <p class="font-medium mb-2">{{ locale.t('survey.alreadyUsed') }}</p>
        <p class="text-sm text-ojen-muted">{{ locale.t('survey.alreadyRecorded') }}</p>
      </div>

      <div v-else-if="submitted" class="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-6 text-center">
        <p class="font-semibold text-emerald-300 mb-2">{{ locale.t('survey.thankYou') }}</p>
        <p class="text-sm text-ojen-muted mb-4">
          {{ locale.t('survey.recalculated', { department: locale.department(department) }) }}
        </p>
        <button
          class="rounded-md bg-ojen-gold text-ojen-bg font-semibold px-5 py-2.5 text-sm hover:bg-ojen-gold-light transition"
          @click="goToDashboard"
        >
          {{ locale.t('survey.viewDashboard') }}
        </button>
      </div>

      <form v-else class="rounded-xl border border-ojen-border bg-ojen-panel p-6 space-y-6" @submit.prevent="submit">
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="text-xs text-ojen-muted mb-1 block">{{ locale.t('survey.yourName') }}</label>
            <input
              v-model="employeeName"
              type="text"
              class="w-full rounded-md bg-ojen-bg border border-ojen-border px-3 py-2.5 text-sm focus:outline-none focus:border-ojen-gold"
            />
          </div>
          <div>
            <label class="text-xs text-ojen-muted mb-1 block">{{ locale.t('survey.yourEmail') }}</label>
            <input
              v-model="employeeEmail"
              type="email"
              class="w-full rounded-md bg-ojen-bg border border-ojen-border px-3 py-2.5 text-sm focus:outline-none focus:border-ojen-gold"
            />
          </div>
        </div>
        <div>
          <label class="text-xs text-ojen-muted mb-1 block">{{ locale.t('survey.department') }}</label>
          <select
            v-model="department"
            class="w-full rounded-md bg-ojen-bg border border-ojen-border px-3 py-2.5 text-sm focus:outline-none focus:border-ojen-gold"
          >
            <option v-for="d in DEPARTMENTS" :key="d" :value="d">{{ locale.department(d) }}</option>
          </select>
        </div>

        <div class="space-y-5">
          <div v-for="dim in ALL_DIMENSIONS" :key="dim.key">
            <p class="text-sm mb-2">{{ surveyQuestion(dim.key, locale.t) }}</p>
            <div class="grid grid-cols-5 gap-1.5">
              <button
                v-for="n in 5"
                :key="n"
                type="button"
                class="rounded-md border py-2 text-[11px] leading-tight transition"
                :class="
                  answers[dim.key] === n
                    ? 'bg-ojen-gold text-ojen-bg border-ojen-gold font-semibold'
                    : 'border-ojen-border text-ojen-muted hover:border-ojen-gold'
                "
                @click="answers[dim.key] = n"
              >
                {{ n }}
              </button>
            </div>
            <div class="flex justify-between text-[10px] text-ojen-muted mt-1">
              <span>{{ locale.t(scaleLabelKeys[0]) }}</span>
              <span>{{ locale.t(scaleLabelKeys[1]) }}</span>
            </div>
          </div>
        </div>

        <p v-if="hasError" class="text-sm text-red-400">{{ locale.t('survey.fillNameEmail') }}</p>

        <button
          type="submit"
          class="w-full rounded-md bg-ojen-gold text-ojen-bg font-semibold py-3 text-sm hover:bg-ojen-gold-light transition"
        >
          {{ locale.t('survey.submit') }}
        </button>
      </form>
    </div>
  </div>
</template>
