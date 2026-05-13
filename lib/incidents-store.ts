'use client'

import type { Incident, IncidentHistory, IncidentStatus } from './types'
import { mockIncidents, mockIncidentHistory } from './mock-data'

const INCIDENTS_KEY = 'resolviq_incidents'
const HISTORY_KEY = 'resolviq_history'

function getStoredIncidents(): Incident[] {
  if (typeof window === 'undefined') return mockIncidents
  const stored = localStorage.getItem(INCIDENTS_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  localStorage.setItem(INCIDENTS_KEY, JSON.stringify(mockIncidents))
  return mockIncidents
}

function saveIncidents(incidents: Incident[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents))
}

function getStoredHistory(): IncidentHistory[] {
  if (typeof window === 'undefined') return mockIncidentHistory
  const stored = localStorage.getItem(HISTORY_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  localStorage.setItem(HISTORY_KEY, JSON.stringify(mockIncidentHistory))
  return mockIncidentHistory
}

function saveHistory(history: IncidentHistory[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
}

export function getAllIncidents(): Incident[] {
  return getStoredIncidents()
}

export function getIncidentById(id: string): Incident | undefined {
  const incidents = getStoredIncidents()
  return incidents.find(inc => inc.id === id)
}

export function getIncidentHistory(incidentId: string): IncidentHistory[] {
  const history = getStoredHistory()
  return history.filter(h => h.incidentId === incidentId).sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )
}

export function createIncident(data: Omit<Incident, 'id' | 'createdAt' | 'date'>): Incident {
  const incidents = getStoredIncidents()
  const history = getStoredHistory()
  
  // Generate new ID
  const maxId = incidents.reduce((max, inc) => {
    const num = parseInt(inc.id.replace('INC-', ''))
    return num > max ? num : max
  }, 0)
  
  const newId = `INC-${String(maxId + 1).padStart(3, '0')}`
  const now = new Date().toISOString()
  
  const newIncident: Incident = {
    ...data,
    id: newId,
    createdAt: now,
    date: now.split('T')[0]
  }
  
  incidents.unshift(newIncident)
  saveIncidents(incidents)
  
  // Add initial history entry
  const historyEntry: IncidentHistory = {
    id: crypto.randomUUID(),
    incidentId: newId,
    status: data.status,
    actor: data.reporterName,
    timestamp: now,
    createdAt: now
  }
  
  history.push(historyEntry)
  saveHistory(history)
  
  return newIncident
}

export function updateIncidentStatus(
  incidentId: string, 
  newStatus: IncidentStatus, 
  actorName: string
): { success: boolean; incident?: Incident; error?: string } {
  const incidents = getStoredIncidents()
  const history = getStoredHistory()
  
  const incidentIndex = incidents.findIndex(inc => inc.id === incidentId)
  
  if (incidentIndex === -1) {
    return { success: false, error: 'Incident not found' }
  }
  
  incidents[incidentIndex].status = newStatus
  saveIncidents(incidents)
  
  // Add history entry
  const now = new Date().toISOString()
  const historyEntry: IncidentHistory = {
    id: crypto.randomUUID(),
    incidentId,
    status: newStatus,
    actor: actorName,
    timestamp: now,
    createdAt: now
  }
  
  history.push(historyEntry)
  saveHistory(history)
  
  return { success: true, incident: incidents[incidentIndex] }
}

export function deleteIncident(incidentId: string): { success: boolean; error?: string } {
  const incidents = getStoredIncidents()
  const history = getStoredHistory()
  
  const filteredIncidents = incidents.filter(inc => inc.id !== incidentId)
  const filteredHistory = history.filter(h => h.incidentId !== incidentId)
  
  if (filteredIncidents.length === incidents.length) {
    return { success: false, error: 'Incident not found' }
  }
  
  saveIncidents(filteredIncidents)
  saveHistory(filteredHistory)
  
  return { success: true }
}

export function checkDuplicateTitle(title: string, excludeId?: string): boolean {
  const incidents = getStoredIncidents()
  const normalizedTitle = title.toLowerCase().trim()
  
  return incidents.some(inc => 
    inc.id !== excludeId && 
    inc.title.toLowerCase().trim().includes(normalizedTitle.slice(0, 20))
  )
}

export function getIncidentStats() {
  const incidents = getStoredIncidents()
  
  return {
    total: incidents.length,
    open: incidents.filter(i => i.status === 'Open').length,
    inProgress: incidents.filter(i => i.status === 'In Progress' || i.status === 'Assigned').length,
    resolved: incidents.filter(i => i.status === 'Resolved' || i.status === 'Closed').length,
    critical: incidents.filter(i => i.severity === 'Critical').length
  }
}
