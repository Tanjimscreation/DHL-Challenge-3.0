import React from 'react'

interface SeverityBadgeProps {
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'Low':
        return 'border-green-200 text-green-800 bg-green-50'
      case 'Medium':
        return 'border-yellow-200 text-yellow-800 bg-yellow-50'
      case 'High':
        return 'border-orange-200 text-orange-800 bg-orange-50'
      case 'Critical':
        return 'border-red-200 text-red-800 bg-red-50'
      default:
        return 'border-gray-200 text-gray-800 bg-gray-50'
    }
  }

  return (
    <div className={`inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider border rounded-full ${getSeverityStyles(severity)}`}>
      {severity}
    </div>
  )
}
