'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronDown,
  User
} from 'lucide-react'
import { DhlLogo } from './DhlLogo'

interface SidebarProps {
  userName?: string
  userRole?: string
  onLogout?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  userName = 'John Doe', 
  userRole = 'Reporter',
  onLogout 
}) => {
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/incident/new', label: 'New Incident', icon: FileText },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <motion.div
      initial={{ x: -240 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed left-0 top-0 h-full w-60 bg-dhl-dark text-white z-50"
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-6 border-b border-dhl-border"
        >
          <DhlLogo size="small" />
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <motion.ul
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { 
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.3
                }
              }
            }}
            className="space-y-2"
          >
            {navItems.map((item, index) => (
              <motion.li
                key={item.href}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  show: { opacity: 1, x: 0 }
                }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    pathname === item.href 
                      ? 'bg-dhl-red text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800 hover:scale-105'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </nav>

        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="p-4 border-t border-dhl-border"
        >
          <div className="flex items-center space-x-3 mb-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="w-10 h-10 rounded-full bg-dhl-red flex items-center justify-center"
            >
              <User className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.9 }}
                className="font-semibold text-white"
              >
                {userName}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.0 }}
                className="text-sm text-gray-400"
              >
                {userRole}
              </motion.p>
            </div>
          </div>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}
