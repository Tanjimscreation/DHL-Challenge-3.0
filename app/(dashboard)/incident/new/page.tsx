'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  Save,
  ArrowLeft
} from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import { DhlLogo } from '@/components/DhlLogo'
import { StatusBadge } from '@/components/StatusBadge'
import { SeverityBadge } from '@/components/SeverityBadge'
import { Toast } from '@/components/Toast'
import { ConfirmModal } from '@/components/ConfirmModal'

export default function NewIncidentPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: 'Operations',
    severity: 'Medium',
    recommended_action: ''
  })
  const [attachments, setAttachments] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiComplete, setAiComplete] = useState(false)
  const [duplicateWarning, setDuplicateWarning] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null)
  const [userRole, setUserRole] = useState('Reporter') // Would come from auth
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newAttachments = Array.from(files).map(file => file.name)
      setAttachments(prev => [...prev, ...newAttachments])
    }
  }

  const handleAnalyzeWithAI = async () => {
    if (attachments.length === 0) {
      setToast({ message: 'Please upload files first', type: 'warning' })
      return
    }

    setIsAnalyzing(true)
    
    // Simulate AI analysis
    setTimeout(() => {
      // Mock AI analysis results
      setFormData({
        title: 'Package Delivery Delay - Customer Complaint',
        description: 'Customer reported significant delay in package delivery. Package was supposed to be delivered yesterday but tracking shows no movement. Customer is threatening to switch to competitor service.',
        department: 'Customer Service',
        severity: 'High',
        recommended_action: '1. Contact customer immediately with apology and compensation offer\n2. Investigate package location in tracking system\n3. Expedite delivery if package is found\n4. Review delivery process to prevent future delays'
      })
      setAiComplete(true)
      setIsAnalyzing(false)
      setToast({ message: 'AI analysis complete!', type: 'success' })
    }, 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description) {
      setToast({ message: 'Please fill in all required fields', type: 'error' })
      return
    }

    // Simulate API call
    try {
      const response = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          reporter_name: 'John Doe',
          reporter_role: userRole,
          reporter_id: 'user-id',
          attachments
        })
      })

      if (response.ok) {
        setToast({ message: 'Incident created successfully!', type: 'success' })
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      } else {
        throw new Error('Failed to create incident')
      }
    } catch (error) {
      setToast({ message: 'Failed to create incident', type: 'error' })
    }
  }

  const handleLogout = () => {
    console.log('Logout clicked')
  }

  if (userRole !== 'Reporter') {
    return (
      <div className="flex">
        <Sidebar userName="John Doe" userRole={userRole} onLogout={handleLogout} />
        <div className="ml-60 flex-1 bg-dhl-light min-h-screen flex items-center justify-center">
          <div className="card p-8 max-w-md">
            <AlertTriangle className="w-16 h-16 text-dhl-yellow mx-auto mb-4" />
            <h2 className="text-xl font-bold text-dhl-dark text-center mb-2">Access Denied</h2>
            <p className="text-dhl-muted text-center">
              Only Reporter role can create new incidents. Contact your administrator for access.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      <Sidebar userName="John Doe" userRole={userRole} onLogout={handleLogout} />
      
      <div className="ml-60 flex-1 bg-dhl-light min-h-screen">
        <div className="p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-8 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <ArrowLeft 
                className="w-5 h-5 text-dhl-muted cursor-pointer hover:text-dhl-dark" 
                onClick={() => router.push('/dashboard')}
              />
              <DhlLogo size="medium" showSubtitle={false} />
            </div>
            <h1 className="text-3xl font-black text-dhl-dark">New Incident</h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="card p-6">
                <h2 className="text-xl font-bold text-dhl-dark mb-6">Incident Details</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="label-text">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="input-field"
                      placeholder="Enter incident title"
                      required
                    />
                    {duplicateWarning && (
                      <p className="text-dhl-red text-sm mt-1 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Similar incident title exists
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="label-text">Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                      className="input-field"
                    >
                      <option value="Operations">Operations</option>
                      <option value="IT">IT</option>
                      <option value="Customer Service">Customer Service</option>
                      <option value="Fleet">Fleet</option>
                      <option value="Warehouse">Warehouse</option>
                    </select>
                  </div>

                  <div>
                    <label className="label-text">Severity</label>
                    <select
                      value={formData.severity}
                      onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value }))}
                      className="input-field"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="label-text">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="input-field min-h-[120px] resize-none"
                      placeholder="Describe the incident in detail..."
                      required
                    />
                  </div>

                  <div>
                    <label className="label-text">Recommended Action</label>
                    <textarea
                      value={formData.recommended_action}
                      onChange={(e) => setFormData(prev => ({ ...prev, recommended_action: e.target.value }))}
                      className="input-field min-h-[100px] resize-none"
                      placeholder="What should be done to resolve this incident?"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full py-3 flex items-center justify-center space-x-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>Create Incident</span>
                  </button>
                </form>
              </div>
            </motion.div>

            {/* AI Auto-Fill Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className={`card p-6 border-2 ${aiComplete ? 'border-green-500 bg-green-50' : 'border-dhl-yellow border-dashed'}`}>
                <h3 className="text-lg font-bold text-dhl-dark mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  AI Auto-Fill
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="label-text">Upload Files</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2 px-4 border border-dhl-border rounded-lg hover:bg-dhl-light transition-colors flex items-center justify-center space-x-2"
                    >
                      <Upload className="w-5 h-5" />
                      <span>Choose Files</span>
                    </button>
                  </div>

                  {attachments.length > 0 && (
                    <div>
                      <label className="label-text">Attached Files</label>
                      <div className="space-y-2">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-dhl-light rounded">
                            <span className="text-sm text-dhl-dark truncate">{file}</span>
                            <button
                              type="button"
                              onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                              className="text-dhl-red hover:text-red-600"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleAnalyzeWithAI}
                    disabled={isAnalyzing || attachments.length === 0}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                      isAnalyzing 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : aiComplete
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-dhl-yellow text-dhl-dark hover:bg-yellow-400'
                    }`}
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-dhl-dark border-t-transparent animate-spin"></div>
                        <span>Analyzing...</span>
                      </>
                    ) : aiComplete ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Analysis Complete</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5" />
                        <span>Analyze with AI</span>
                      </>
                    )}
                  </button>
                </div>

                {aiComplete && (
                  <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>AI Analysis Complete!</strong> All fields have been populated based on the uploaded documents.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
