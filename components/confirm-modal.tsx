'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning'
  requireConfirmation?: string
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  requireConfirmation
}: ConfirmModalProps) {
  const [confirmInput, setConfirmInput] = useState('')

  const canConfirm = !requireConfirmation || confirmInput === requireConfirmation

  const handleConfirm = () => {
    if (canConfirm) {
      onConfirm()
      setConfirmInput('')
    }
  }

  const handleClose = () => {
    setConfirmInput('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-card rounded-lg shadow-xl border">
              {/* Header */}
              <div className="flex items-start justify-between p-5 border-b">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'p-2 rounded-full',
                    variant === 'danger' ? 'bg-red-100' : 'bg-amber-100'
                  )}>
                    <AlertTriangle className={cn(
                      'w-5 h-5',
                      variant === 'danger' ? 'text-red-600' : 'text-amber-600'
                    )} />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
                </div>
                <button
                  onClick={handleClose}
                  className="text-muted-foreground hover:text-card-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5">
                <p className="text-muted-foreground">{description}</p>

                {requireConfirmation && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Type <span className="font-mono font-semibold text-card-foreground">{requireConfirmation}</span> to confirm:
                    </p>
                    <Input
                      value={confirmInput}
                      onChange={(e) => setConfirmInput(e.target.value)}
                      placeholder={requireConfirmation}
                      className="font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-5 border-t bg-muted/30">
                <Button variant="outline" onClick={handleClose}>
                  {cancelText}
                </Button>
                <Button
                  variant={variant === 'danger' ? 'destructive' : 'default'}
                  onClick={handleConfirm}
                  disabled={!canConfirm}
                  className={cn(
                    'transition-transform active:scale-[0.97]',
                    variant === 'danger' && 'bg-dhl-red hover:bg-dhl-red/90'
                  )}
                >
                  {confirmText}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
