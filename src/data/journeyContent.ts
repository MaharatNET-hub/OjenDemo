import type { BadgeId, ExerciseTemplate, JourneyProgram } from '@/types'

export const JOURNEY_PROGRAMS: JourneyProgram[] = [
  {
    id: 'loyalty-90',
    nameKey: 'journeyPrograms.loyalty90.name',
    durationDays: 90,
    descriptionKey: 'journeyPrograms.loyalty90.description',
    icon: 'briefcase',
    priceLabel: '499',
  },
  {
    id: 'resilience-30',
    nameKey: 'journeyPrograms.resilience30.name',
    durationDays: 30,
    descriptionKey: 'journeyPrograms.resilience30.description',
    icon: 'heart',
    priceLabel: '199',
  },
  {
    id: 'leadership-60',
    nameKey: 'journeyPrograms.leadership60.name',
    durationDays: 60,
    descriptionKey: 'journeyPrograms.leadership60.description',
    icon: 'rocket',
    priceLabel: '349',
  },
  {
    id: 'mindfulness-14',
    nameKey: 'journeyPrograms.mindfulness14.name',
    durationDays: 14,
    descriptionKey: 'journeyPrograms.mindfulness14.description',
    icon: 'target',
    priceLabel: '99',
  },
]

/** A small rotating set of daily-practice exercises; day N uses templates[(N-1) % templates.length]. */
export const EXERCISE_TEMPLATES: ExerciseTemplate[] = [
  {
    titleKey: 'exercise.activeListening.title',
    icon: 'chat',
    descriptionKey: 'exercise.activeListening.description',
    practiceKey: 'exercise.activeListening.practice',
    checklistKeys: [
      'exercise.activeListening.check1',
      'exercise.activeListening.check2',
      'exercise.activeListening.check3',
      'exercise.activeListening.check4',
    ],
  },
  {
    titleKey: 'exercise.gratitude.title',
    icon: 'heart',
    descriptionKey: 'exercise.gratitude.description',
    practiceKey: 'exercise.gratitude.practice',
    checklistKeys: [
      'exercise.gratitude.check1',
      'exercise.gratitude.check2',
      'exercise.gratitude.check3',
    ],
  },
  {
    titleKey: 'exercise.mindfulBreathing.title',
    icon: 'zap',
    descriptionKey: 'exercise.mindfulBreathing.description',
    practiceKey: 'exercise.mindfulBreathing.practice',
    checklistKeys: [
      'exercise.mindfulBreathing.check1',
      'exercise.mindfulBreathing.check2',
      'exercise.mindfulBreathing.check3',
    ],
  },
  {
    titleKey: 'exercise.boundaries.title',
    icon: 'shield',
    descriptionKey: 'exercise.boundaries.description',
    practiceKey: 'exercise.boundaries.practice',
    checklistKeys: [
      'exercise.boundaries.check1',
      'exercise.boundaries.check2',
      'exercise.boundaries.check3',
    ],
  },
  {
    titleKey: 'exercise.focusBlock.title',
    icon: 'target',
    descriptionKey: 'exercise.focusBlock.description',
    practiceKey: 'exercise.focusBlock.practice',
    checklistKeys: [
      'exercise.focusBlock.check1',
      'exercise.focusBlock.check2',
      'exercise.focusBlock.check3',
      'exercise.focusBlock.check4',
    ],
  },
  {
    titleKey: 'exercise.teamCheckIn.title',
    icon: 'users',
    descriptionKey: 'exercise.teamCheckIn.description',
    practiceKey: 'exercise.teamCheckIn.practice',
    checklistKeys: [
      'exercise.teamCheckIn.check1',
      'exercise.teamCheckIn.check2',
      'exercise.teamCheckIn.check3',
    ],
  },
]

export function templateForDay(day: number): ExerciseTemplate {
  return EXERCISE_TEMPLATES[(day - 1) % EXERCISE_TEMPLATES.length]
}

export interface BadgeMeta {
  id: BadgeId
  labelKey: string
  icon: string
  /** Fraction of the program (0-1) that must be completed to unlock, except weekWarrior which checks streak. */
  threshold: number
}

export const BADGES: BadgeMeta[] = [
  { id: 'firstStep', labelKey: 'badges.firstStep', icon: 'sun', threshold: 0 },
  { id: 'weekWarrior', labelKey: 'badges.weekWarrior', icon: 'zap', threshold: 7 },
  { id: 'quarterMaster', labelKey: 'badges.quarterMaster', icon: 'shield', threshold: 0.25 },
  { id: 'halfwayHero', labelKey: 'badges.halfwayHero', icon: 'rocket', threshold: 0.5 },
  { id: 'almostThere', labelKey: 'badges.almostThere', icon: 'gauge', threshold: 0.9 },
  { id: 'programComplete', labelKey: 'badges.programComplete', icon: 'crown', threshold: 1 },
]
