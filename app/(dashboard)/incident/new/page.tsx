'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  Sparkles,
  AlertTriangle,
  User,
  Briefcase,
  BadgeCheck,
  FileText,
  CheckCircle,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageTransition } from '@/components/page-transition'
import { LoadingSpinner } from '@/components/loading-spinner'
import { getCurrentUser } from '@/lib/auth-store'
import { createIncident, checkDuplicateTitle } from '@/lib/incidents-store'
import { departments } from '@/lib/mock-data'
import type { User as UserType, IncidentSeverity } from '@/lib/types'
import { toast } from 'sonner'

// AI-simulated analysis results
const aiAnalysisResults = [
  {
    title: 'Delayed Shipment - Rotterdam Distribution Center',
    department: 'Operations',
    severity: 'High' as IncidentSeverity,
    description: 'A significant delay has been identified in the Rotterdam Distribution Center affecting multiple outbound shipments. The delay appears to be caused by a shortage of available trucks during peak hours. Approximately 150 packages are currently backlogged and require immediate attention.',
    recommendedAction: '1. Deploy additional trucks from nearby depots\n2. Activate overflow protocol for time-sensitive shipments\n3. Notify affected customers via automated SMS\n4. Schedule overtime for sorting staff'
  },
  {
    title: 'Equipment Malfunction - Scanner Unit B3',
    department: 'IT',
    severity: 'Medium' as IncidentSeverity,
    description: 'Scanner unit B3 in the main sorting facility has been reporting intermittent failures. The device successfully scans approximately 70% of packages but fails on the remainder, causing manual processing delays.',
    recommendedAction: '1. Replace scanner head unit\n2. Recalibrate laser alignment\n3. Update firmware to latest version\n4. Schedule preventive maintenance for all scanner units'
  },
  {
    title: 'Customer Escalation - Missing International Package',
    department: 'Customer Service',
    severity: 'Critical' as IncidentSeverity,
    description: 'A high-value international package (declared value: €15,000) has been missing for 5 days. The package was last scanned at Frankfurt airport customs. Customer is threatening legal action.',
    recommendedAction: '1. Immediately escalate to customs liaison team\n2. Initiate trace request with airport authorities\n3. Contact insurance department for potential claim\n4. Assign dedicated agent to customer communication'
  }
]

export default function NewIncidentPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiCompleted, setAiCompleted] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    severity: '' as IncidentSeverity | '',
    description: '',
    recommendedAction: ''
  })

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }, [])

  // Check for duplicates when title changes
  useEffect(() => {
    if (formData.title.length > 5) {
      const isDuplicate = checkDuplicateTitle(formData.title)
      setShowDuplicateWarning(isDuplicate)
    } else {
      setShowDuplicateWarning(false)
    }
  }, [formData.title])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file.name)
      setAiCompleted(false)
    }
  }

  const handleAiAnalysis = async () => {
    if (!uploadedFile) {
      toast.error('Please upload a file first')
      return
    }

    setIsAnalyzing(true)

    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Randomly select an analysis result
    const result = aiAnalysisResults[Math.floor(Math.random() * aiAnalysisResults.length)]
    
    setFormData({
      title: result.title,
      department: result.department,
      severity: result.severity,
      description: result.description,
      recommendedAction: result.recommendedAction
    })

    setIsAnalyzing(false)
    setAiCompleted(true)
    toast.success('AI Analysis Complete', {
      description: 'Form fields have been auto-filled'
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return
    if (user.role === 'Resolver') {
      toast.error('Resolvers cannot create incidents')
      return
    }

    if (!formData.title || !formData.department || !formData.severity || !formData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const incident = createIncident({
      title: formData.title,
      description: formData.description,
      department: formData.department,
      severity: formData.severity as IncidentSeverity,
      status: 'Open',
      reporterName: user.name,
      reporterRole: user.role,
      reporterId: user.id,
      recommendedAction: formData.recommendedAction,
      attachments: uploadedFile ? [uploadedFile] : [],
      duplicate: showDuplicateWarning
    })

    toast.success('Incident Created', {
      description: `Incident ${incident.id} has been submitted`
    })

    router.push(`/incident/${incident.id}`)
  }

  const isResolver = user?.role === 'Resolver'

  return (
    <PageTransition className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground">Report New Incident</h1>
        <p className="text-muted-foreground mt-1">
          Submit a new incident for tracking and resolution
        </p>
      </div>

      {/* Resolver Warning */}
      {isResolver && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-center gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="font-medium text-amber-800">Resolver Role Restriction</p>
            <p className="text-sm text-amber-700">
              As a Resolver, you can view and update incidents but cannot create new ones.
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* AI Auto-Fill Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
          className="lg:col-span-1"
        >
          <div className={`rounded-lg p-5 border-2 border-dashed transition-colors ${
            aiCompleted 
              ? 'bg-green-50 border-green-300' 
              : 'bg-dhl-yellow/5 border-dhl-yellow'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              {aiCompleted ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Sparkles className="w-5 h-5 text-dhl-yellow" />
              )}
              <h3 className={`font-semibold ${aiCompleted ? 'text-green-700' : 'text-foreground'}`}>
                {aiCompleted ? 'AI Analysis Complete' : 'AI Auto-Fill'}
              </h3>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Upload a document and let AI analyze it to auto-fill the form fields.
            </p>

            {/* File Upload */}
            <div className="mb-4">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">
                Upload Document
              </Label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isResolver}
                />
                <div className={`flex items-center gap-2 px-4 py-3 rounded-lg border bg-card ${
                  uploadedFile ? 'border-green-300' : 'border-border'
                }`}>
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground flex-1 truncate">
                    {uploadedFile || 'PDF, DOCX, TXT, PNG, JPG'}
                  </span>
                  {uploadedFile && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setUploadedFile(null)
                        setAiCompleted(false)
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleAiAnalysis}
              disabled={!uploadedFile || isAnalyzing || isResolver}
              className="w-full bg-dhl-yellow text-dhl-dark hover:bg-dhl-yellow/90 font-semibold transition-transform active:scale-[0.97]"
            >
              {isAnalyzing ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2 border-dhl-dark border-t-transparent" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze with AI
                </>
              )}
            </Button>
          </div>

          {/* Reporter Info */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2, ease: 'easeOut' }}
              className="mt-6 bg-card rounded-lg p-5 shadow-sm"
            >
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Reporter Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium text-foreground">{user.name}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Role:</span>
                  <span className="font-medium text-foreground">{user.role}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <BadgeCheck className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">ID:</span>
                  <span className="font-medium text-foreground">{user.employeeId}</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Incident Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2, ease: 'easeOut' }}
          className="lg:col-span-2"
        >
          <form onSubmit={handleSubmit} className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Incident Details
            </h2>

            {/* Duplicate Warning */}
            <AnimatePresence>
              {showDuplicateWarning && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6 flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <p className="text-sm text-amber-700">
                    A similar incident may already exist. Please verify before submitting.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-5">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Incident Title *
                </Label>
                <Input
                  id="title"
                  placeholder="Brief description of the incident"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  disabled={isResolver}
                  required
                />
              </div>

              {/* Department & Severity */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Department *
                  </Label>
                  <Select
                    value={formData.department}
                    onValueChange={(v) => setFormData({ ...formData, department: v })}
                    disabled={isResolver}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="severity" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Severity *
                  </Label>
                  <Select
                    value={formData.severity}
                    onValueChange={(v) => setFormData({ ...formData, severity: v as IncidentSeverity })}
                    disabled={isResolver}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the incident..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={isResolver}
                  rows={5}
                  required
                />
              </div>

              {/* Recommended Action */}
              <div className="space-y-2">
                <Label htmlFor="recommendedAction" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Recommended Action
                </Label>
                <Textarea
                  id="recommendedAction"
                  placeholder="Suggested steps to resolve this incident..."
                  value={formData.recommendedAction}
                  onChange={(e) => setFormData({ ...formData, recommendedAction: e.target.value })}
                  disabled={isResolver}
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || isResolver}
                  className="w-full md:w-auto bg-dhl-red hover:bg-dhl-red/90 text-white font-semibold px-8 h-11 transition-transform active:scale-[0.97]"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2 border-white border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Incident'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </PageTransition>
  )
}
