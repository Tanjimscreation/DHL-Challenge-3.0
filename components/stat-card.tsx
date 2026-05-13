'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number
  icon: LucideIcon
  borderColor: string
  iconColor: string
  delay?: number
}

export function StatCard({ title, value, icon: Icon, borderColor, iconColor, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      className={cn(
        'bg-card rounded-lg p-5 border-t-4 shadow-sm',
        borderColor
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-black text-card-foreground mt-1">
            {value}
          </p>
        </div>
        <div className={cn('p-2.5 rounded-lg bg-muted', iconColor)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  )
}
