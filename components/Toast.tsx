import React from 'react'
import { motion } from 'framer-motion'
import { X, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'warning'
  onClose: () => void
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const getStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white'
      case 'error':
        return 'bg-dhl-red text-white'
      case 'warning':
        return 'bg-dhl-yellow text-dhl-dark'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />
      case 'error':
        return <AlertCircle className="w-5 h-5" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />
      default:
        return <AlertCircle className="w-5 h-5" />
    }
  }

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className={`fixed top-4 right-4 z-50 ${getStyles(type)} px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 min-w-[300px]`}
    >
      {getIcon(type)}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="hover:opacity-75">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}
