'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  FileText,
  Sparkles,
  Clock,
  Paperclip,
  RefreshCw,
  Trash2,
  User,
  Calendar,
  Building2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageTransition } from '@/components/page-transition'
import { StatusBadge } from '@/components/status-badge'
import { SeverityBadge } from '@/components/severity-badge'
import { LoadingSpinner } from '@/components/loading-spinner'
import { ConfirmModal } from '@/components/confirm-modal'
import { getIncidentById, getIncidentHistory, updateIncidentStatus, deleteIncident } from '@/lib/incidents-store'
import { getCurrentUser } from '@/lib/auth-store'
import type { Incident, IncidentHistory, IncidentStatus, User as UserType } from '@/lib/types'
import { toast } from 'sonner'
import Link from 'next/link'

export default function IncidentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [incident, setIncident] = useState<Incident | null>(null)
  const [history, setHistory] = useState<IncidentHistory[]>([])
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<IncidentStatus | ''>('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    const inc = getIncidentById(id)
    if (inc) {
      setIncident(inc)
      setSelectedStatus(inc.status)
      setHistory(getIncidentHistory(id))
    }
    setIsLoading(false)
  }, [id])

  const refreshHistory = () => {
    setHistory(getIncidentHistory(id))
  }

  const handleStatusUpdate = async () => {
    if (!selectedStatus || !incident || !user) return
    if (selectedStatus === incident.status) {
      toast.info('Status is already set to this value')
      return
    }

    setIsUpdating(true)

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const result = updateIncidentStatus(incident.id, selectedStatus, user.name)

    if (result.success) {
      setIncident(result.incident!)
      refreshHistory()
      toast.success('Status Updated', {
        description: `Incident status changed to ${selectedStatus}`
      })
    } else {
      toast.error('Update Failed', {
        description: result.error
      })
    }

    setIsUpdating(false)
  }

  const handleDelete = async () => {
    const result = deleteIncident(id)
    if (result.success) {
      toast.success('Incident Deleted')
      router.push('/dashboard')
    } else {
      toast.error('Delete Failed', {
        description: result.error
      })
    }
    setShowDeleteModal(false)
  }

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const canUpdateStatus = user?.role === 'Resolver' || user?.role === 'Admin'
  const canDelete = user?.role === 'Admin'

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!incident) {
    return (
      <PageTransition className="p-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-foreground mb-2">Incident Not Found</h2>
          <p className="text-muted-foreground mb-6">The incident you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/dashboard">
            <Button className="bg-dhl-red hover:bg-dhl-red/90">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-start gap-4 flex-wrap">
            <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-dhl-red/10 text-dhl-red font-mono font-bold text-sm">
              {incident.id}
            </span>
            <StatusBadge status={incident.status} />
            <SeverityBadge severity={incident.severity} />
          </div>

          {canDelete && (
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Incident
            </Button>
          )}
        </div>

        <h1 className="text-2xl font-black text-foreground mt-4">
          {incident.title}
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
            className="bg-card rounded-lg p-6 shadow-sm"
          >
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Description
            </h2>
            <p className="text-foreground whitespace-pre-wrap leading-relaxed">
              {incident.description}
            </p>
          </motion.div>

          {/* AI Recommended Action */}
          {incident.recommendedAction && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2, ease: 'easeOut' }}
              className="bg-dhl-yellow/5 border border-dhl-yellow/30 rounded-lg p-6"
            >
              <h2 className="text-sm font-semibold uppercase tracking-wide text-dhl-yellow flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4" />
                AI Recommended Action
              </h2>
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                {incident.recommendedAction}
              </p>
            </motion.div>
          )}

          {/* Status History Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.3, ease: 'easeOut' }}
            className="bg-card rounded-lg p-6 shadow-sm"
          >
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Status History
            </h2>

            <div className="relative">
              {history.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex gap-4 pb-6 last:pb-0"
                >
                  {/* Timeline Line & Dot */}
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-dhl-red ring-4 ring-dhl-red/20" />
                    {index !== history.length - 1 && (
                      <div className="w-0.5 flex-1 bg-border mt-2" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 -mt-0.5">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={entry.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Changed by <span className="font-medium text-foreground">{entry.actor}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDateTime(entry.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15, ease: 'easeOut' }}
            className="bg-card rounded-lg p-6 shadow-sm"
          >
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
              Details
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="text-sm font-medium text-foreground">{incident.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Reporter</p>
                  <p className="text-sm font-medium text-foreground">{incident.reporterName}</p>
                  <p className="text-xs text-muted-foreground">{incident.reporterRole}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="text-sm font-medium text-foreground">
                    {formatDateTime(incident.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Attachments */}
          {incident.attachments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.25, ease: 'easeOut' }}
              className="bg-card rounded-lg p-6 shadow-sm"
            >
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4 flex items-center gap-2">
                <Paperclip className="w-4 h-4" />
                Attachments
              </h2>

              <div className="space-y-2">
                {incident.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 text-sm"
                  >
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground truncate flex-1">{file}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Status Update Panel */}
          {canUpdateStatus && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.35, ease: 'easeOut' }}
              className="bg-dhl-dark rounded-lg p-6"
            >
              <h2 className="text-xs font-semibold uppercase tracking-wide text-dhl-yellow mb-4 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Update Status
              </h2>

              <Select
                value={selectedStatus}
                onValueChange={(v) => setSelectedStatus(v as IncidentStatus)}
              >
                <SelectTrigger className="bg-[#2A2A2A] border-[#444] text-white mb-4">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Assigned">Assigned</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleStatusUpdate}
                disabled={isUpdating || selectedStatus === incident.status}
                className="w-full bg-dhl-yellow text-dhl-dark hover:bg-dhl-yellow/90 font-semibold transition-transform active:scale-[0.97]"
              >
                {isUpdating ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2 border-dhl-dark border-t-transparent" />
                    Updating...
                  </>
                ) : (
                  'Update Status'
                )}
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Incident"
        description={`Are you sure you want to delete incident ${incident.id}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        requireConfirmation="DELETE"
      />
    </PageTransition>
  )
}
