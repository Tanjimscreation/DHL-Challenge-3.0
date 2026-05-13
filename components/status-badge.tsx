'use client'

import { cn } from '@/lib/utils'
import type { IncidentStatus } from '@/lib/types'

interface StatusBadgeProps {
  status: IncidentStatus
  className?: string
}

const statusConfig: Record<IncidentStatus, { bg: string; text: string; dot: string }> = {
  'Open': {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    dot: 'bg-blue-500'
  },
  'Assigned': {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    dot: 'bg-purple-500'
  },
  'In Progress': {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    dot: 'bg-amber-500'
  },
  'Resolved': {
    bg: 'bg-green-100',
    text: 'text-green-700',
    dot: 'bg-green-500'
  },
  'Closed': {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    dot: 'bg-gray-500'
  }
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        config.bg,
        config.text,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {status}
    </span>
  )
}
