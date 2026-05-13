'use client'

import { cn } from '@/lib/utils'
import type { IncidentSeverity } from '@/lib/types'

interface SeverityBadgeProps {
  severity: IncidentSeverity
  className?: string
}

const severityConfig: Record<IncidentSeverity, { border: string; text: string; bg: string }> = {
  'Low': {
    border: 'border-green-300',
    text: 'text-green-700',
    bg: 'bg-green-50'
  },
  'Medium': {
    border: 'border-amber-300',
    text: 'text-amber-700',
    bg: 'bg-amber-50'
  },
  'High': {
    border: 'border-orange-300',
    text: 'text-orange-700',
    bg: 'bg-orange-50'
  },
  'Critical': {
    border: 'border-red-400',
    text: 'text-red-700',
    bg: 'bg-red-50'
  }
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const config = severityConfig[severity]
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded border text-xs font-semibold uppercase tracking-wide',
        config.border,
        config.text,
        config.bg,
        className
      )}
    >
      {severity}
    </span>
  )
}
