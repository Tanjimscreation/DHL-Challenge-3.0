export type UserRole = 'Reporter' | 'Resolver' | 'Admin'

export type IncidentSeverity = 'Low' | 'Medium' | 'High' | 'Critical'

export type IncidentStatus = 'Open' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  employeeId: string
  createdAt: string
}

export interface Incident {
  id: string
  title: string
  description: string
  department: string
  severity: IncidentSeverity
  status: IncidentStatus
  reporterName: string
  reporterRole: UserRole
  reporterId: string
  recommendedAction: string
  attachments: string[]
  duplicate: boolean
  createdAt: string
  date: string
}

export interface IncidentHistory {
  id: string
  incidentId: string
  status: IncidentStatus
  actor: string
  timestamp: string
  createdAt: string
}

export interface Log {
  id: string
  action: string
  fileName: string
  status: string
  message: string
  createdAt: string
}
