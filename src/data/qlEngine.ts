import type { Dimension, DimensionMeta, QlStatus, SurveyAnswers, SurveyResponse } from '@/types'

export const DIMENSIONS: DimensionMeta[] = [
  { key: 'engagement', label: 'Engagement', icon: 'user', direction: 'higher-better' },
  { key: 'stress', label: 'Stress', icon: 'heart', direction: 'lower-better' },
  { key: 'alignment', label: 'Alignment', icon: 'target', direction: 'higher-better' },
  { key: 'energy', label: 'Energy', icon: 'bolt', direction: 'higher-better' },
  { key: 'workloadBalance', label: 'Workload Balance', icon: 'scale', direction: 'higher-better' },
  { key: 'growthDev', label: 'Growth & Dev', icon: 'chat', direction: 'higher-better' },
  { key: 'teamConnection', label: 'Team Connection', icon: 'heart-hand', direction: 'higher-better' },
]

/** Shown only in department "Key Drivers" breakdowns, not as a top-level dashboard card. */
export const HIDDEN_DIMENSION: DimensionMeta = {
  key: 'productivity',
  label: 'Productivity',
  icon: 'chart',
  direction: 'higher-better',
}

export const ALL_DIMENSIONS: DimensionMeta[] = [...DIMENSIONS, HIDDEN_DIMENSION]

export const KEY_DRIVER_ORDER: Dimension[] = [
  'productivity',
  'alignment',
  'engagement',
  'stress',
  'energy',
  'growthDev',
]

/** Survey question shown to employees for each dimension, phrased so a higher (1-5) answer means a healthier state, except stress which is phrased so a higher answer means more stress. */
export const SURVEY_QUESTIONS: Record<Dimension, string> = {
  engagement: 'I feel motivated and engaged by the work I do.',
  stress: 'I frequently feel overwhelmed or stressed by my workload.',
  alignment: 'I understand how my work connects to company goals.',
  energy: 'I have enough energy to get through my workday.',
  workloadBalance: 'My workload feels manageable and well balanced.',
  growthDev: 'I have opportunities to learn and grow in my role.',
  teamConnection: 'I feel connected and supported by my teammates.',
  productivity: 'I am able to get my most important work done efficiently.',
}

export function answersToPercent(answers: Record<Dimension, number>): SurveyAnswers {
  const out = {} as SurveyAnswers
  for (const dim of ALL_DIMENSIONS) {
    const raw = answers[dim.key] ?? 3
    out[dim.key] = Math.round(((raw - 1) / 4) * 100)
  }
  return out
}

export function averageDimensions(responses: SurveyResponse[]): SurveyAnswers {
  const totals = {} as Record<Dimension, number>
  for (const dim of ALL_DIMENSIONS) totals[dim.key] = 0

  if (responses.length === 0) {
    for (const dim of ALL_DIMENSIONS) totals[dim.key] = 0
    return totals
  }

  for (const response of responses) {
    for (const dim of ALL_DIMENSIONS) {
      totals[dim.key] += response.answers[dim.key] ?? 0
    }
  }
  for (const dim of ALL_DIMENSIONS) {
    totals[dim.key] = Math.round(totals[dim.key] / responses.length)
  }
  return totals
}

/** Overall QL score = plain average of the 7 headline dimensions (matches Ojen's published methodology). */
export function overallScore(metrics: SurveyAnswers): number {
  const sum = DIMENSIONS.reduce((acc, dim) => acc + (metrics[dim.key] ?? 0), 0)
  return Math.floor(sum / DIMENSIONS.length)
}

function goodness(dim: DimensionMeta, value: number): number {
  return dim.direction === 'higher-better' ? value : 100 - value
}

export function statusFor(dim: DimensionMeta, value: number): QlStatus {
  const g = goodness(dim, value)
  if (g >= 65) return 'strong'
  if (g >= 45) return 'monitor'
  return 'attention'
}

export const STATUS_LABEL: Record<QlStatus, string> = {
  strong: 'Strong',
  monitor: 'Monitor',
  attention: 'Needs Attention',
}

export const STATUS_CLASSES: Record<QlStatus, string> = {
  strong: 'bg-emerald-500/15 text-emerald-400',
  monitor: 'bg-sky-500/15 text-sky-400',
  attention: 'bg-amber-500/15 text-amber-400',
}

export interface DepartmentBreakdown {
  department: string
  responseCount: number
  metrics: SurveyAnswers
  score: number
}

export function computeDepartments(responses: SurveyResponse[]): DepartmentBreakdown[] {
  const byDept = new Map<string, SurveyResponse[]>()
  for (const r of responses) {
    const list = byDept.get(r.department) ?? []
    list.push(r)
    byDept.set(r.department, list)
  }
  const result: DepartmentBreakdown[] = []
  for (const [department, list] of byDept) {
    const metrics = averageDimensions(list)
    result.push({
      department,
      responseCount: list.length,
      metrics,
      score: overallScore(metrics),
    })
  }
  return result.sort((a, b) => a.score - b.score)
}

export function weakestDimension(metrics: SurveyAnswers, exclude: Dimension[] = []): DimensionMeta {
  let weakest = DIMENSIONS[0]
  let weakestGoodness = Infinity
  for (const dim of DIMENSIONS) {
    if (exclude.includes(dim.key)) continue
    const g = goodness(dim, metrics[dim.key] ?? 0)
    if (g < weakestGoodness) {
      weakestGoodness = g
      weakest = dim
    }
  }
  return weakest
}

export interface ImprovementOption {
  id: 1 | 2 | 3
  title: string
  focus: string
  description: string
  details: string[]
  impactTags: string[]
  reasonTags: string[]
  mostEffective: boolean
  ctaLabel: string
}

export function buildImprovementPlan(department: string, metrics: SurveyAnswers): ImprovementOption[] {
  const primaryWeak = weakestDimension(metrics)
  const secondaryWeak = weakestDimension(metrics, [primaryWeak.key])
  const primaryValue = metrics[primaryWeak.key]

  return [
    {
      id: 1,
      title: 'Performance training',
      focus: department,
      description: `Direct guidance session with Milli, focused on fast support for your highest-priority recommendation.`,
      details: ['Booking Mode: Online or in-person', `Focus: Fast support on your highest-priority recommendation`],
      impactTags: [],
      reasonTags: [
        `Reason: ${primaryWeak.label} is at ${primaryValue}%`,
        `Risk to improve: ${secondaryWeak.label} (${metrics[secondaryWeak.key]}%)`,
      ],
      mostEffective: false,
      ctaLabel: 'Ask for Advice',
    },
    {
      id: 2,
      title: 'Workshop + Coaching',
      focus: 'Sustained improvement with coaching support',
      description: 'Sustained improvement with coaching support',
      details: ['2 Days Workshop + 4 Coaching Sessions', 'Focus: Build engagement & team connection'],
      impactTags: ['+20% Engagement', '-15% Stress', '+10% Team Connection'],
      reasonTags: [],
      mostEffective: false,
      ctaLabel: 'Book a Session',
    },
    {
      id: 3,
      title: 'Complete Transformation Program',
      focus: 'Comprehensive program for lasting change',
      description: 'Comprehensive program for lasting change',
      details: ['Workshop + Coaching + 30-Day Program', 'Focus: Transform culture & sustain results'],
      impactTags: ['+30% Engagement', '-20% Stress', '+15% Productivity'],
      reasonTags: [],
      mostEffective: true,
      ctaLabel: 'Speak with an Expert',
    },
  ]
}
