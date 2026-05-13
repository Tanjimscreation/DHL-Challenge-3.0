'use client'

import { cn } from '@/lib/utils'

interface DhlLogoProps {
  showSubtitle?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function DhlLogo({ showSubtitle = true, size = 'md', className }: DhlLogoProps) {
  const sizes = {
    sm: {
      container: 'gap-2',
      logo: 'px-2 py-1',
      logoText: 'text-sm font-black',
      brandName: 'text-base font-bold',
      subtitle: 'text-[10px]'
    },
    md: {
      container: 'gap-3',
      logo: 'px-3 py-1.5',
      logoText: 'text-lg font-black',
      brandName: 'text-xl font-bold',
      subtitle: 'text-xs'
    },
    lg: {
      container: 'gap-4',
      logo: 'px-4 py-2',
      logoText: 'text-2xl font-black',
      brandName: 'text-3xl font-bold',
      subtitle: 'text-sm'
    }
  }

  const s = sizes[size]

  return (
    <div className={cn('flex flex-col', className)}>
      <div className={cn('flex items-center', s.container)}>
        {/* DHL Logo Badge */}
        <div className={cn('bg-dhl-red rounded', s.logo)}>
          <span className={cn('text-dhl-yellow tracking-wider', s.logoText)}>
            DHL
          </span>
        </div>
        
        {/* Brand Name */}
        <span className={cn('text-foreground', s.brandName)}>
          ResolvIQ
        </span>
      </div>
      
      {showSubtitle && (
        <span className={cn('text-muted-foreground uppercase tracking-widest mt-1', s.subtitle)}>
          Incident Management
        </span>
      )}
    </div>
  )
}
