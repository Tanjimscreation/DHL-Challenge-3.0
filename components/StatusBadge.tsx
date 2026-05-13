import React from 'react'

interface StatusBadgeProps {
  status: 'Open' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed'
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Assigned':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Closed':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getDotColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-500'
      case 'Assigned':
        return 'bg-purple-500'
      case 'In Progress':
        return 'bg-yellow-500'
      case 'Resolved':
        return 'bg-green-500'
      case 'Closed':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(status)}`}>
      <div className={`w-2 h-2 rounded-full ${getDotColor(status)} mr-2`}></div>
      {status}
    </div>
  )
}
