'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Search,
  Eye
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { PageTransition } from '@/components/page-transition'
import { StatCard } from '@/components/stat-card'
import { StatusBadge } from '@/components/status-badge'
import { SeverityBadge } from '@/components/severity-badge'
import { getAllIncidents, getIncidentStats } from '@/lib/incidents-store'
import { getCurrentUser } from '@/lib/auth-store'
import { departments } from '@/lib/mock-data'
import type { Incident, IncidentStatus, IncidentSeverity, User } from '@/lib/types'
import Link from 'next/link'

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0, critical: 0 })
  const [user, setUser] = useState<User | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'all'>('all')
  const [severityFilter, setSeverityFilter] = useState<IncidentSeverity | 'all'>('all')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    
    const allIncidents = getAllIncidents()
    // Filter incidents based on role - Reporters only see their own
    if (currentUser?.role === 'Reporter') {
      setIncidents(allIncidents.filter(i => i.reporterId === currentUser.id))
    } else {
      setIncidents(allIncidents)
    }
    
    setStats(getIncidentStats())
  }, [])

  const filteredIncidents = useMemo(() => {
    return incidents.filter(incident => {
      const matchesSearch = 
        incident.title.toLowerCase().includes(search.toLowerCase()) ||
        incident.id.toLowerCase().includes(search.toLowerCase()) ||
        incident.description.toLowerCase().includes(search.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || incident.status === statusFilter
      const matchesSeverity = severityFilter === 'all' || incident.severity === severityFilter
      const matchesDepartment = departmentFilter === 'all' || incident.department === departmentFilter

      return matchesSearch && matchesStatus && matchesSeverity && matchesDepartment
    })
  }, [incidents, search, statusFilter, severityFilter, departmentFilter])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <PageTransition className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.name || 'User'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          title="Total Incidents"
          value={stats.total}
          icon={FileText}
          borderColor="border-t-dhl-dark"
          iconColor="text-dhl-dark"
          delay={0}
        />
        <StatCard
          title="Open"
          value={stats.open}
          icon={AlertCircle}
          borderColor="border-t-blue-500"
          iconColor="text-blue-500"
          delay={0.1}
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={Clock}
          borderColor="border-t-amber-500"
          iconColor="text-amber-500"
          delay={0.2}
        />
        <StatCard
          title="Resolved"
          value={stats.resolved}
          icon={CheckCircle}
          borderColor="border-t-green-500"
          iconColor="text-green-500"
          delay={0.3}
        />
        <StatCard
          title="Critical"
          value={stats.critical}
          icon={AlertTriangle}
          borderColor="border-t-dhl-red"
          iconColor="text-dhl-red"
          delay={0.4}
        />
      </div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.5, ease: 'easeOut' }}
        className="bg-card rounded-lg p-4 mb-6 shadow-sm"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search incidents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as IncidentStatus | 'all')}>
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Assigned">Assigned</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          {/* Severity Filter */}
          <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v as IncidentSeverity | 'all')}>
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
            </SelectContent>
          </Select>

          {/* Department Filter */}
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Incidents Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.6, ease: 'easeOut' }}
        className="bg-card rounded-lg shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground px-6 py-4">
                  ID
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground px-6 py-4">
                  Title
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground px-6 py-4">
                  Severity
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground px-6 py-4">
                  Department
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground px-6 py-4">
                  Status
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground px-6 py-4">
                  Date
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground px-6 py-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    No incidents found
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((incident, index) => (
                  <motion.tr
                    key={incident.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="border-b hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-semibold text-dhl-red">
                        {incident.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-foreground line-clamp-1 max-w-[300px]">
                        {incident.title}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <SeverityBadge severity={incident.severity} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">
                        {incident.department}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={incident.status} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">
                        {formatDate(incident.date)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/incident/${incident.id}`}>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-dhl-red hover:text-dhl-red hover:bg-dhl-red/10"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </PageTransition>
  )
}
