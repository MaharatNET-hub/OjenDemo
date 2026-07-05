export type Dimension =
  | 'engagement'
  | 'stress'
  | 'alignment'
  | 'energy'
  | 'workloadBalance'
  | 'growthDev'
  | 'teamConnection'
  | 'productivity'

export interface DimensionMeta {
  key: Dimension
  label: string
  icon: string
  /** 'higher-better' metrics are healthier the higher they score; 'lower-better' metrics (like stress) are healthier the lower they score. */
  direction: 'higher-better' | 'lower-better'
}

export type SurveyAnswers = Record<Dimension, number>

export interface SurveyResponse {
  id: string
  employeeName: string
  employeeEmail: string
  department: string
  answers: SurveyAnswers
  submittedAt: string
}

export type InvitationStatus = 'pending' | 'accepted'

export interface Invitation {
  id: string
  token: string
  email: string
  status: InvitationStatus
  sentDate: string
}

export interface Employee {
  id: string
  name: string
  email: string
  phone: string
  gender: 'Male' | 'Female'
  department: string
  joined: string
  status: 'Active' | 'Invited'
}

export type QlStatus = 'strong' | 'monitor' | 'attention'

export interface Subscription {
  id: string
  packageName: string
  journey: string
  startDate: string
  endDate: string
  completionRate: string
  certificate: string
  status: 'Active' | 'Pending' | 'Completed' | 'Expired'
}

export interface Booking {
  id: string
  service: string
  consultant: string
  date: string
  time: string
  mode: 'Online' | 'In-person'
  status: 'Upcoming' | 'Completed' | 'Cancelled'
}

export interface Payment {
  id: string
  description: string
  date: string
  amount: number
  method: string
  status: 'Paid' | 'Pending' | 'Failed'
}
