'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Eye, Plus } from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import { StatCard } from '@/components/StatCard'
import { StatusBadge } from '@/components/StatusBadge'
import { SeverityBadge } from '@/components/SeverityBadge'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { PageTransition, containerVariants, itemVariants } from '@/components/PageTransition'
import { 
  FileText, 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  AlertTriangle 
} from 'lucide-react'

interface Incident {
  id: string
  title: string
  severity: string
  department: string
  status: string
  date: string
  reporter_name: string
}

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [severityFilter, setSeverityFilter] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    critical: 0
  })

  // Mock data for demonstration
  const mockIncidents: Incident[] = [
    {
      id: 'INC-001',
      title: 'Package delivery delay at Frankfurt hub',
      severity: 'High',
      department: 'Operations',
      status: 'Open',
      date: '2024-01-15',
      reporter_name: 'John Smith'
    },
    {
      id: 'INC-002',
      title: 'System outage in shipping tracking',
      severity: 'Critical',
      department: 'IT',
      status: 'In Progress',
      date: '2024-01-14',
      reporter_name: 'Sarah Johnson'
    },
    {
      id: 'INC-003',
      title: 'Customer complaint about damaged package',
      severity: 'Medium',
      department: 'Customer Service',
      status: 'Resolved',
      date: '2024-01-13',
      reporter_name: 'Mike Wilson'
    },
    {
      id: 'INC-004',
      title: 'Vehicle maintenance issue',
      severity: 'Low',
      department: 'Fleet',
      status: 'Assigned',
      date: '2024-01-12',
      reporter_name: 'David Brown'
    },
    {
      id: 'INC-005',
      title: 'Warehouse inventory discrepancy',
      severity: 'Medium',
      department: 'Warehouse',
      status: 'Open',
      date: '2024-01-11',
      reporter_name: 'Lisa Anderson'
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIncidents(mockIncidents)
      setFilteredIncidents(mockIncidents)
      
      // Calculate stats
      const statsData = {
        total: mockIncidents.length,
        open: mockIncidents.filter(i => i.status === 'Open').length,
        inProgress: mockIncidents.filter(i => i.status === 'In Progress').length,
        resolved: mockIncidents.filter(i => i.status === 'Resolved').length,
        critical: mockIncidents.filter(i => i.severity === 'Critical').length
      }
      setStats(statsData)
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = incidents

    if (searchTerm) {
      filtered = filtered.filter(incident =>
        incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(incident => incident.status === statusFilter)
    }

    if (severityFilter) {
      filtered = filtered.filter(incident => incident.severity === severityFilter)
    }

    if (departmentFilter) {
      filtered = filtered.filter(incident => incident.department === departmentFilter)
    }

    setFilteredIncidents(filtered)
  }, [searchTerm, statusFilter, severityFilter, departmentFilter, incidents])

  const handleLogout = () => {
    console.log('Logout clicked')
  }

  if (isLoading) {
    return (
      <div className="flex">
        <Sidebar userName="John Doe" userRole="Admin" onLogout={handleLogout} />
        <div className="ml-60 flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="flex">
        <Sidebar userName="John Doe" userRole="Admin" onLogout={handleLogout} />
        
        <div className="ml-60 flex-1 bg-dhl-light min-h-screen">
          <div className="p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-black text-dhl-dark mb-2">Dashboard</h1>
              <p className="text-dhl-muted">Monitor and manage DHL incidents</p>
            </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
          >
            {[
              { title: "Total Incidents", value: stats.total, icon: FileText, borderColor: "border-blue-500" },
              { title: "Open", value: stats.open, icon: AlertCircle, borderColor: "border-blue-500" },
              { title: "In Progress", value: stats.inProgress, icon: Clock, borderColor: "border-yellow-500" },
              { title: "Resolved", value: stats.resolved, icon: CheckCircle, borderColor: "border-green-500" },
              { title: "Critical", value: stats.critical, icon: AlertTriangle, borderColor: "border-red-500" }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                variants={itemVariants}
                custom={index}
              >
                <StatCard
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  borderColor={stat.borderColor}
                />
              </motion.div>
            ))}
          </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
            >
              <StatCard
                title="Open"
                value={stats.open}
                icon={AlertCircle}
                borderColor="border-blue-500"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.3 }}
            >
              <StatCard
                title="In Progress"
                value={stats.inProgress}
                icon={Clock}
                borderColor="border-yellow-500"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.4 }}
            >
              <StatCard
                title="Resolved"
                value={stats.resolved}
                icon={CheckCircle}
                borderColor="border-green-500"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.5 }}
            >
              <StatCard
                title="Critical"
                value={stats.critical}
                icon={AlertTriangle}
                borderColor="border-red-500"
              />
            </motion.div>
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.6 }}
            className="card p-6"
          >
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dhl-muted" />
                  <input
                    type="text"
                    placeholder="Search incidents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field min-w-[150px]"
              >
                <option value="">All Status</option>
                <option value="Open">Open</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
              
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="input-field min-w-[150px]"
              >
                <option value="">All Severity</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
              
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="input-field min-w-[150px]"
              >
                <option value="">All Departments</option>
                <option value="Operations">Operations</option>
                <option value="IT">IT</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Fleet">Fleet</option>
                <option value="Warehouse">Warehouse</option>
              </select>
            </div>
          </motion.div>

          {/* Incidents Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.7 }}
            className="card"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-dhl-dark">Recent Incidents</h2>
                <button className="btn-primary flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>New Incident</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dhl-border">
                      <th className="text-left py-3 px-4 font-semibold text-dhl-dark">ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-dhl-dark">Title</th>
                      <th className="text-left py-3 px-4 font-semibold text-dhl-dark">Severity</th>
                      <th className="text-left py-3 px-4 font-semibold text-dhl-dark">Department</th>
                      <th className="text-left py-3 px-4 font-semibold text-dhl-dark">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-dhl-dark">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-dhl-dark">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredIncidents.map((incident, index) => (
                        <motion.tr
                          key={incident.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          variants={itemVariants}
                          custom={index}
                          className="border-b border-dhl-border hover:bg-dhl-light"
                        >
                          <td className="py-3 px-4">
                            <span className="font-mono text-sm font-semibold text-dhl-dark">{incident.id}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="max-w-xs">
                              <p className="font-medium text-dhl-dark truncate">{incident.title}</p>
                              <p className="text-xs text-dhl-muted">{incident.reporter_name}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <SeverityBadge severity={incident.severity as any} />
                          </td>
                          <td className="py-3 px-4 text-dhl-dark">{incident.department}</td>
                          <td className="py-3 px-4">
                            <StatusBadge status={incident.status as any} />
                          </td>
                          <td className="py-3 px-4 text-dhl-dark">{incident.date}</td>
                          <td className="py-3 px-4">
                            <button className="text-dhl-red hover:text-red-600 flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span className="text-sm">View</span>
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
              </table>
              
              {filteredIncidents.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <p className="text-dhl-muted">No incidents found matching your criteria.</p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </PageTransition>
)
}
