import React from 'react'

interface DhlLogoProps {
  size?: 'small' | 'medium' | 'large'
  showSubtitle?: boolean
}

export const DhlLogo: React.FC<DhlLogoProps> = ({ size = 'medium', showSubtitle = true }) => {
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-2xl'
  }

  const subtitleSizeClasses = {
    small: 'text-xs',
    medium: 'text-xs',
    large: 'text-sm'
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="bg-dhl-red px-2 py-1 rounded">
        <span className="font-black text-dhl-yellow">DHL</span>
      </div>
      <div>
        <div className={`font-bold text-dhl-white ${sizeClasses[size]}`}>
          ResolvIQ
        </div>
        {showSubtitle && (
          <div className={`text-dhl-muted ${subtitleSizeClasses[size]}`}>
            Incident Management
          </div>
        )}
      </div>
    </div>
  )
}
