'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Calendar,
  FileText,
  Trash2,
  Edit,
  CheckCircle
} from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import { StatusBadge } from '@/components/StatusBadge'
import { SeverityBadge } from '@/components/SeverityBadge'
import { Toast } from '@/components/Toast'
import { ConfirmModal } from '@/components/ConfirmModal'

interface Incident {
  id: string
  title: string
  description: string
  department: string
  severity: string
  status: string
  date: string
  reporter_name: string
  reporter_role: string
  recommended_action?: string
  attachments?: string[]
}

interface HistoryEntry {
  id: string
  incident_id: string
  status: string
  actor: string
  timestamp: string
  created_at: string
}

export default function IncidentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [incident, setIncident] = useState<Incident | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [statusActor, setStatusActor] = useState('')
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [userRole, setUserRole] = useState('Admin') // Would come from auth

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const response = await fetch(`/api/incidents/${params.id}`)
        const data = await response.json()
        
        if (response.ok) {
          setIncident(data.incident)
          setHistory(data.history || [])
        } else {
          setToast({ message: 'Failed to fetch incident', type: 'error' })
        }
      } catch (error) {
        setToast({ message: 'Error fetching incident', type: 'error' })
      } finally {
        setIsLoading(false)
      }
    }

    fetchIncident()
  }, [params.id])

  const handleStatusUpdate = async () => {
    if (!newStatus || !statusActor) {
      setToast({ message: 'Please provide status and actor name', type: 'warning' })
      return
    }

    try {
      const response = await fetch(`/api/incidents/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          actor: statusActor
        })
      })

      if (response.ok) {
        const data = await response.json()
        setIncident(data.incident)
        
        // Add new history entry
        setHistory(prev => [...prev, {
          id: Date.now().toString(),
          incident_id: params.id,
          status: newStatus,
          actor: statusActor,
          timestamp: new Date().toISOString(),
          created_at: new Date().toISOString()
        }])
        
        setToast({ message: 'Status updated successfully', type: 'success' })
        setShowStatusModal(false)
        setNewStatus('')
        setStatusActor('')
      } else {
        setToast({ message: 'Failed to update status', type: 'error' })
      }
    } catch (error) {
      setToast({ message: 'Error updating status', type: 'error' })
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/incidents/${params.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setToast({ message: 'Incident deleted successfully', type: 'success' })
        router.push('/dashboard')
      } else {
        setToast({ message: 'Failed to delete incident', type: 'error' })
      }
    } catch (error) {
      setToast({ message: 'Error deleting incident', type: 'error' })
    }
  }

  const handleLogout = () => {
    console.log('Logout clicked')
  }

  if (isLoading) {
    return (
      <div className="flex">
        <Sidebar userName="John Doe" userRole={userRole} onLogout={handleLogout} />
        <div className="ml-60 flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-dhl-red border-t-transparent"></div>
        </div>
      </div>
    )
  }

  if (!incident) {
    return (
      <div className="flex">
        <Sidebar userName="John Doe" userRole={userRole} onLogout={handleLogout} />
        <div className="ml-60 flex-1 bg-dhl-light min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-dhl-muted">Incident not found</p>
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
            className="mb-8"
          >
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center text-dhl-muted hover:text-dhl-dark transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <span className="font-mono text-sm font-bold text-dhl-dark">{incident.id}</span>
                <StatusBadge status={incident.status as any} />
                <SeverityBadge severity={incident.severity as any} />
              </div>
            </div>
            
            <h1 className="text-3xl font-black text-dhl-dark">{incident.title}</h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
            >
              {/* Description Card */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-dhl-dark mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Description
                </h2>
                <p className="text-dhl-dark leading-relaxed">{incident.description}</p>
              </div>

              {/* AI Recommended Action Card */}
              {incident.recommended_action && (
                <div className="card p-6 border-l-4 border-dhl-yellow bg-yellow-50">
                  <h2 className="text-xl font-bold text-dhl-dark mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-dhl-yellow" />
                    AI Recommended Action
                  </h2>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-dhl-dark whitespace-pre-line">{incident.recommended_action}</p>
                  </div>
                </div>
              )}

              {/* Status History Timeline */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-dhl-dark mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Status History
                </h2>
                
                <div className="relative">
                  {history.length > 0 ? (
                    <div className="space-y-4">
                      {history.map((entry, index) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, delay: index * 0.1 }}
                          className="flex items-start space-x-4"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-dhl-red flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <StatusBadge status={entry.status as any} />
                              <span className="font-semibold text-dhl-dark">{entry.status}</span>
                            </div>
                            <p className="text-sm text-dhl-muted">{entry.actor}</p>
                            <p className="text-xs text-dhl-muted">
                              {new Date(entry.timestamp).toLocaleString()}
                            </p>
                          </div>
                          
                          {index < history.length - 1 && (
                            <div className="w-px-2 h-8 bg-dhl-border absolute left-5 top-10"></div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-dhl-muted text-center py-8">No status history available</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.3 }}
              className="space-y-6"
            >
              {/* Details Card */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-dhl-dark mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Details
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="label-text">Department</label>
                    <p className="text-dhl-dark font-medium">{incident.department}</p>
                  </div>
                  
                  <div>
                    <label className="label-text">Date Reported</label>
                    <p className="text-dhl-dark font-medium">{incident.date}</p>
                  </div>
                  
                  <div>
                    <label className="label-text">Reporter</label>
                    <p className="text-dhl-dark font-medium">{incident.reporter_name}</p>
                    <p className="text-sm text-dhl-muted">{incident.reporter_role}</p>
                  </div>
                </div>
              </div>

              {/* Attachments Card */}
              {incident.attachments && incident.attachments.length > 0 && (
                <div className="card p-6">
                  <h2 className="text-xl font-bold text-dhl-dark mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Attachments
                  </h2>
                  
                  <div className="space-y-2">
                    {incident.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-dhl-light rounded-lg">
                        <span className="text-dhl-dark truncate flex-1">{file}</span>
                        <button className="text-dhl-red hover:text-red-600 text-sm">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Update Panel */}
              <div className="card-dark p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Edit className="w-5 h-5 mr-2" />
                  Status Update
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="label-text">New Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="input-field bg-dhl-dark border-dhl-border text-white"
                    >
                      <option value="">Select Status</option>
                      <option value="Open">Open</option>
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="label-text">Your Name</label>
                    <input
                      type="text"
                      value={statusActor}
                      onChange={(e) => setStatusActor(e.target.value)}
                      placeholder="Enter your name"
                      className="input-field bg-dhl-dark border-dhl-border text-white"
                    />
                  </div>
                  
                  <button
                    onClick={() => setShowStatusModal(true)}
                    disabled={!newStatus || !statusActor}
                    className="btn-primary w-full py-2 disabled:opacity-50"
                  >
                    Update Status
                  </button>
                </div>

                {/* Admin Delete Button */}
                {userRole === 'Admin' && (
                  <div className="mt-6 pt-6 border-t border-dhl-border">
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="w-full py-2 px-4 border border-dhl-red text-dhl-red rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Incident
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <ConfirmModal
          isOpen={showStatusModal}
          title="Update Incident Status"
          message={`Are you sure you want to update the status to "${newStatus}"?`}
          confirmText="Update Status"
          cancelText="Cancel"
          onConfirm={handleStatusUpdate}
          onCancel={() => {
            setShowStatusModal(false)
            setNewStatus('')
            setStatusActor('')
          }}
        />
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <ConfirmModal
          isOpen={showDeleteModal}
          title="Delete Incident"
          message="Are you sure you want to delete this incident? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          requireTypeToConfirm={true}
          confirmType="DELETE"
        />
      )}

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
