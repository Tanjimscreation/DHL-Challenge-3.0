'use client'

import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  FilePlus, 
  Settings, 
  LogOut,
  User
} from 'lucide-react'
import { DhlLogo } from './dhl-logo'
import { cn } from '@/lib/utils'
import { logout, getCurrentUser } from '@/lib/auth-store'
import { useEffect, useState } from 'react'
import type { User as UserType } from '@/lib/types'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/incident/new', label: 'New Incident', icon: FilePlus },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-sidebar flex flex-col z-40">
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border">
        <DhlLogo size="sm" className="text-sidebar-foreground" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative',
                    isActive 
                      ? 'bg-sidebar-accent text-sidebar-foreground' 
                      : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-dhl-red rounded-r"
                    />
                  )}
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Info */}
      {user && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-dhl-red flex items-center justify-center">
              <span className="text-sm font-bold text-dhl-yellow">
                {getInitials(user.name)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user.name}
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {user.role}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </aside>
  )
}
