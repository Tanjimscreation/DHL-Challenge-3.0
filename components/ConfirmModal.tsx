import React from 'react'
import { motion } from 'framer-motion'
import { X, AlertTriangle } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText: string
  cancelText: string
  onConfirm: () => void
  onCancel: () => void
  requireTypeToConfirm?: boolean
  confirmType?: string
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  requireTypeToConfirm = false,
  confirmType = 'DELETE'
}) => {
  const [typedValue, setTypedValue] = React.useState('')

  if (!isOpen) return null

  const canConfirm = !requireTypeToConfirm || typedValue === confirmType

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-dhl-red" />
            </div>
            <h3 className="text-lg font-semibold text-dhl-dark">{title}</h3>
          </div>
          <button onClick={onCancel} className="text-dhl-muted hover:text-dhl-dark">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-dhl-muted mb-6">{message}</p>

        {requireTypeToConfirm && (
          <div className="mb-6">
            <label className="label-text">
              Type <span className="font-mono bg-dhl-light px-1 rounded">{confirmType}</span> to confirm
            </label>
            <input
              type="text"
              value={typedValue}
              onChange={(e) => setTypedValue(e.target.value)}
              className="input-field mt-1"
              placeholder={confirmType}
            />
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-dhl-border text-dhl-dark rounded-lg hover:bg-dhl-light transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={!canConfirm}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              canConfirm
                ? 'bg-dhl-red text-white hover:bg-red-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
