import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type {
  Booking,
  Employee,
  Invitation,
  Payment,
  SurveyResponse,
  Subscription,
} from '@/types'
import { averageDimensions, computeDepartments, overallScore } from '@/data/qlEngine'

const STORAGE_KEY = 'ojen-ql-demo-v1'

export const DEPARTMENTS = [
  'Finance & Accounting',
  'Sales & Marketing',
  'Operations',
  'Human Resources',
  'IT & Engineering',
]

function seedResponses(): SurveyResponse[] {
  return [
    {
      id: 'seed-1',
      employeeName: 'Marwa user',
      employeeEmail: 'user@demo.theojen.com',
      department: 'Finance & Accounting',
      answers: {
        engagement: 60,
        stress: 40,
        alignment: 50,
        energy: 70,
        workloadBalance: 40,
        growthDev: 60,
        teamConnection: 55,
        productivity: 40,
      },
      submittedAt: '2026-06-24T10:00:00.000Z',
    },
  ]
}

function seedEmployees(): Employee[] {
  return [
    {
      id: 'emp-1',
      name: 'Marwa user',
      email: 'user@demo.theojen.com',
      phone: '123456789',
      gender: 'Female',
      department: 'Finance & Accounting',
      joined: '2026-06-24',
      status: 'Active',
    },
  ]
}

function seedInvitations(): Invitation[] {
  return [
    {
      id: 'inv-1',
      token: 'seed-token-pending',
      email: 'user@demo.theojen.com',
      status: 'pending',
      sentDate: '2026-07-02',
    },
    {
      id: 'inv-2',
      token: 'seed-token-accepted',
      email: 'user@demo.theojen.com',
      status: 'accepted',
      sentDate: '2026-06-24',
    },
  ]
}

function seedSubscriptions(): Subscription[] {
  return [
    {
      id: 'sub-1',
      packageName: 'Corporate Quality of Life',
      journey: 'Full package',
      startDate: '2026-06-24',
      endDate: '2026-08-23',
      completionRate: '-',
      certificate: 'Not Available',
      status: 'Active',
    },
  ]
}

function seedBookings(): Booking[] {
  return [
    {
      id: 'bk-1',
      service: 'Corporate Quality of Life Interview',
      consultant: 'Millie Smith',
      date: '2026-06-25',
      time: '10:00',
      mode: 'Online',
      status: 'Completed',
    },
  ]
}

function seedPayments(): Payment[] {
  return [
    {
      id: 'pay-1',
      description: 'Corporate Quality of Life - Full package',
      date: '2026-06-24',
      amount: 200,
      method: 'Visa',
      status: 'Paid',
    },
  ]
}

interface CompanyProfile {
  email: string
  phone: string
  ageRange: string
  country: string
  departmentSection: string
  memberSince: string
}

function seedProfile(): CompanyProfile {
  return {
    email: 'hr.user@demo.theojen.com',
    phone: '+971935682796',
    ageRange: '25_34 years',
    country: 'United Arab Emirates',
    departmentSection: 'Human Resources',
    memberSince: '24 Jun 2026',
  }
}

interface PersistedState {
  responses: SurveyResponse[]
  employees: Employee[]
  invitations: Invitation[]
  subscriptions: Subscription[]
  bookings: Booking[]
  payments: Payment[]
  resolvedActionIds: string[]
  profile: CompanyProfile
}

function loadPersisted(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PersistedState
  } catch {
    return null
  }
}

export const useQlStore = defineStore('ql', () => {
  const persisted = loadPersisted()

  const companyName = ref('HrCompany HrCompany')
  const companyLegalName = ref('Ojen')
  const profile = ref<CompanyProfile>(persisted?.profile ?? seedProfile())

  const responses = ref<SurveyResponse[]>(persisted?.responses ?? seedResponses())
  const employees = ref<Employee[]>(persisted?.employees ?? seedEmployees())
  const invitations = ref<Invitation[]>(persisted?.invitations ?? seedInvitations())
  const subscriptions = ref<Subscription[]>(persisted?.subscriptions ?? seedSubscriptions())
  const bookings = ref<Booking[]>(persisted?.bookings ?? seedBookings())
  const payments = ref<Payment[]>(persisted?.payments ?? seedPayments())
  const resolvedActionIds = ref<string[]>(persisted?.resolvedActionIds ?? [])

  watch(
    [responses, employees, invitations, subscriptions, bookings, payments, resolvedActionIds, profile],
    () => {
      const state: PersistedState = {
        responses: responses.value,
        employees: employees.value,
        invitations: invitations.value,
        subscriptions: subscriptions.value,
        bookings: bookings.value,
        payments: payments.value,
        resolvedActionIds: resolvedActionIds.value,
        profile: profile.value,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    },
    { deep: true },
  )

  // ---- Instant, reactive QL calculations, always derived live from survey responses ----
  const overallMetrics = computed(() => averageDimensions(responses.value))
  const overallQlScore = computed(() => overallScore(overallMetrics.value))
  const departments = computed(() => computeDepartments(responses.value))
  const primaryFocusDepartment = computed(() => departments.value[0] ?? null)

  function sendInvitations(emails: string[]) {
    const today = new Date().toISOString().slice(0, 10)
    for (const email of emails) {
      const trimmed = email.trim()
      if (!trimmed) continue
      invitations.value.push({
        id: `inv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        token: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
        email: trimmed,
        status: 'pending',
        sentDate: today,
      })
    }
  }

  function findInvitation(token: string) {
    return invitations.value.find((inv) => inv.token === token) ?? null
  }

  function submitSurvey(payload: {
    token: string | null
    employeeName: string
    employeeEmail: string
    department: string
    answers: SurveyResponse['answers']
  }) {
    responses.value.push({
      id: `resp-${Date.now()}`,
      employeeName: payload.employeeName,
      employeeEmail: payload.employeeEmail,
      department: payload.department,
      answers: payload.answers,
      submittedAt: new Date().toISOString(),
    })

    const invitation = payload.token ? findInvitation(payload.token) : null
    if (invitation) invitation.status = 'accepted'

    const existing = employees.value.find(
      (e) => e.email.toLowerCase() === payload.employeeEmail.toLowerCase(),
    )
    if (!existing) {
      employees.value.push({
        id: `emp-${Date.now()}`,
        name: payload.employeeName,
        email: payload.employeeEmail,
        phone: '-',
        gender: 'Female',
        department: payload.department,
        joined: new Date().toISOString().slice(0, 10),
        status: 'Active',
      })
    }
  }

  function resetDemoData() {
    responses.value = seedResponses()
    employees.value = seedEmployees()
    invitations.value = seedInvitations()
    subscriptions.value = seedSubscriptions()
    bookings.value = seedBookings()
    payments.value = seedPayments()
    resolvedActionIds.value = []
  }

  function isResolved(actionId: string) {
    return resolvedActionIds.value.includes(actionId)
  }

  function markResolved(actionId: string) {
    if (!isResolved(actionId)) resolvedActionIds.value.push(actionId)
  }

  return {
    companyName,
    companyLegalName,
    profile,
    responses,
    employees,
    invitations,
    subscriptions,
    bookings,
    payments,
    overallMetrics,
    overallQlScore,
    departments,
    primaryFocusDepartment,
    sendInvitations,
    findInvitation,
    submitSurvey,
    resetDemoData,
    resolvedActionIds,
    isResolved,
    markResolved,
  }
})
