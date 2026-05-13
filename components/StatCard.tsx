import React from 'react'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number
  icon: LucideIcon
  borderColor: string
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, borderColor }) => {
  return (
    <div className={`card border-t-4 ${borderColor}`}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-dhl-muted">{title}</p>
            <p className="text-3xl font-bold text-dhl-dark mt-2">{value}</p>
          </div>
          <div className="p-3 bg-dhl-light rounded-lg">
            <Icon className="w-6 h-6 text-dhl-red" />
          </div>
        </div>
      </div>
    </div>
  )
}
