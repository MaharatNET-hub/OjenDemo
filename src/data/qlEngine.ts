import type { Dimension, DimensionMeta, QlStatus, SurveyAnswers, SurveyResponse } from '@/types'

export type TFunction = (key: string, params?: Record<string, string | number>) => string

export const DIMENSIONS: DimensionMeta[] = [
  { key: 'engagement', labelKey: 'metrics.engagement', icon: 'user', direction: 'higher-better' },
  { key: 'stress', labelKey: 'metrics.stress', icon: 'heart', direction: 'lower-better' },
  { key: 'alignment', labelKey: 'metrics.alignment', icon: 'target', direction: 'higher-better' },
  { key: 'energy', labelKey: 'metrics.energy', icon: 'bolt', direction: 'higher-better' },
  {
    key: 'workloadBalance',
    labelKey: 'metrics.workloadBalance',
    icon: 'scale',
    direction: 'higher-better',
  },
  { key: 'growthDev', labelKey: 'metrics.growthDev', icon: 'chat', direction: 'higher-better' },
  {
    key: 'teamConnection',
    labelKey: 'metrics.teamConnection',
    icon: 'heart-hand',
    direction: 'higher-better',
  },
]

/** Shown only in department "Key Drivers" breakdowns, not as a top-level dashboard card. */
export const HIDDEN_DIMENSION: DimensionMeta = {
  key: 'productivity',
  labelKey: 'metrics.productivity',
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

export function surveyQuestion(dim: Dimension, t: TFunction): string {
  return t(`survey.q.${dim}`)
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

export const STATUS_KEY: Record<QlStatus, string> = {
  strong: 'status.strong',
  monitor: 'status.monitor',
  attention: 'status.attention',
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
  titleKey: string
  descriptionKey: string
  detailKeys: string[]
  impactTagKeys: string[]
  reasonTags: string[]
  mostEffective: boolean
  ctaKey: string
}

export function buildImprovementPlan(metrics: SurveyAnswers, t: TFunction): ImprovementOption[] {
  const primaryWeak = weakestDimension(metrics)
  const secondaryWeak = weakestDimension(metrics, [primaryWeak.key])
  const primaryValue = metrics[primaryWeak.key]

  return [
    {
      id: 1,
      titleKey: 'improvement.option1.title',
      descriptionKey: 'improvement.option1.description',
      detailKeys: ['improvement.option1.detail1', 'improvement.option1.detail2'],
      impactTagKeys: [],
      reasonTags: [
        t('improvement.option1.reason', { dimension: t(primaryWeak.labelKey), value: primaryValue }),
        t('improvement.option1.risk', {
          dimension: t(secondaryWeak.labelKey),
          value: metrics[secondaryWeak.key],
        }),
      ],
      mostEffective: false,
      ctaKey: 'improvement.option1.cta',
    },
    {
      id: 2,
      titleKey: 'improvement.option2.title',
      descriptionKey: 'improvement.option2.description',
      detailKeys: ['improvement.option2.detail1', 'improvement.option2.detail2'],
      impactTagKeys: ['improvement.option2.tag1', 'improvement.option2.tag2', 'improvement.option2.tag3'],
      reasonTags: [],
      mostEffective: false,
      ctaKey: 'improvement.option2.cta',
    },
    {
      id: 3,
      titleKey: 'improvement.option3.title',
      descriptionKey: 'improvement.option3.description',
      detailKeys: ['improvement.option3.detail1', 'improvement.option3.detail2'],
      impactTagKeys: ['improvement.option3.tag1', 'improvement.option3.tag2', 'improvement.option3.tag3'],
      reasonTags: [],
      mostEffective: true,
      ctaKey: 'improvement.option3.cta',
    },
  ]
}
