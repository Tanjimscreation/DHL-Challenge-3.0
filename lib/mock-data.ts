import type { User, Incident, IncidentHistory } from './types'

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Reporter',
    email: 'reporter@dhl.com',
    role: 'Reporter',
    employeeId: 'DHL-R001',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Jane Resolver',
    email: 'resolver@dhl.com',
    role: 'Resolver',
    employeeId: 'DHL-V001',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@dhl.com',
    role: 'Admin',
    employeeId: 'DHL-A001',
    createdAt: '2024-01-01T00:00:00Z'
  }
]

export const mockIncidents: Incident[] = [
  {
    id: 'INC-001',
    title: 'Package Delivery Delay - Frankfurt Hub',
    description: 'Multiple packages stuck at Frankfurt sorting facility due to conveyor belt malfunction. Approximately 500 packages affected, causing delays of 24-48 hours for express deliveries.',
    department: 'Operations',
    severity: 'Critical',
    status: 'In Progress',
    reporterName: 'John Reporter',
    reporterRole: 'Reporter',
    reporterId: '1',
    recommendedAction: 'Deploy maintenance team immediately to repair conveyor belt. Reroute urgent packages through alternate sorting line. Notify affected customers via SMS.',
    attachments: ['conveyor_photo.jpg', 'incident_report.pdf'],
    duplicate: false,
    createdAt: '2024-01-15T09:30:00Z',
    date: '2024-01-15'
  },
  {
    id: 'INC-002',
    title: 'Vehicle Fleet GPS System Outage',
    description: 'GPS tracking system showing offline status for 23 delivery vehicles in the Munich region. Unable to track real-time locations and optimize routes.',
    department: 'IT',
    severity: 'High',
    status: 'Assigned',
    reporterName: 'John Reporter',
    reporterRole: 'Reporter',
    reporterId: '1',
    recommendedAction: 'Contact GPS vendor for system status check. Implement manual check-in protocol for affected drivers. Schedule system reboot during off-peak hours.',
    attachments: ['gps_error_log.txt'],
    duplicate: false,
    createdAt: '2024-01-14T14:20:00Z',
    date: '2024-01-14'
  },
  {
    id: 'INC-003',
    title: 'Customer Complaint - Damaged Package',
    description: 'High-value electronics package delivered with visible damage. Customer requesting full refund and compensation. Package value: €2,500.',
    department: 'Customer Service',
    severity: 'Medium',
    status: 'Open',
    reporterName: 'John Reporter',
    reporterRole: 'Reporter',
    reporterId: '1',
    recommendedAction: 'Initiate damage claim process. Send replacement package with express delivery. Offer €50 voucher as goodwill gesture. Investigate handling procedures at origin hub.',
    attachments: ['damaged_package.jpg', 'customer_email.pdf'],
    duplicate: false,
    createdAt: '2024-01-13T11:45:00Z',
    date: '2024-01-13'
  },
  {
    id: 'INC-004',
    title: 'Warehouse Temperature Control Failure',
    description: 'Cold storage unit 3 in Hamburg warehouse showing temperature fluctuations. Temperature rose from -18°C to -5°C over 2 hours. Pharmaceutical shipments at risk.',
    department: 'Warehouse',
    severity: 'Critical',
    status: 'Resolved',
    reporterName: 'Jane Resolver',
    reporterRole: 'Resolver',
    reporterId: '2',
    recommendedAction: 'Immediately transfer pharmaceutical shipments to backup cold storage. Call emergency HVAC technician. Document temperature log for insurance purposes.',
    attachments: ['temperature_log.csv', 'hvac_report.pdf'],
    duplicate: false,
    createdAt: '2024-01-12T08:00:00Z',
    date: '2024-01-12'
  },
  {
    id: 'INC-005',
    title: 'Security Breach - Unauthorized Access Attempt',
    description: 'Security cameras detected unauthorized individual attempting to access loading dock B at 2:30 AM. Individual fled before security arrived.',
    department: 'Security',
    severity: 'High',
    status: 'Closed',
    reporterName: 'Admin User',
    reporterRole: 'Admin',
    reporterId: '3',
    recommendedAction: 'Review all security footage from 2:00-3:00 AM. File police report. Increase night patrol frequency. Check access card logs for anomalies.',
    attachments: ['security_footage.mp4', 'police_report.pdf'],
    duplicate: false,
    createdAt: '2024-01-11T03:00:00Z',
    date: '2024-01-11'
  },
  {
    id: 'INC-006',
    title: 'Staff Shortage - Berlin Sorting Center',
    description: 'Due to flu outbreak, 15 staff members called in sick. Current shift operating at 60% capacity. Backlog building up.',
    department: 'HR',
    severity: 'Medium',
    status: 'In Progress',
    reporterName: 'John Reporter',
    reporterRole: 'Reporter',
    reporterId: '1',
    recommendedAction: 'Contact temp agency for immediate staffing. Authorize overtime for available staff. Prioritize express and time-sensitive packages. Communicate delays to affected customers.',
    attachments: ['staffing_report.xlsx'],
    duplicate: false,
    createdAt: '2024-01-10T06:30:00Z',
    date: '2024-01-10'
  },
  {
    id: 'INC-007',
    title: 'Invoice Processing Error',
    description: 'Batch of 150 invoices sent to customers with incorrect amounts. Overcharges ranging from €10 to €500. Requires immediate correction and customer notification.',
    department: 'Finance',
    severity: 'Low',
    status: 'Open',
    reporterName: 'John Reporter',
    reporterRole: 'Reporter',
    reporterId: '1',
    recommendedAction: 'Generate corrected invoices. Send apology email with corrected invoice attached. Process refunds for customers who already paid. Review invoice generation system for bugs.',
    attachments: ['affected_invoices.csv'],
    duplicate: false,
    createdAt: '2024-01-09T16:00:00Z',
    date: '2024-01-09'
  }
]

export const mockIncidentHistory: IncidentHistory[] = [
  {
    id: '1',
    incidentId: 'INC-001',
    status: 'Open',
    actor: 'John Reporter',
    timestamp: '2024-01-15T09:30:00Z',
    createdAt: '2024-01-15T09:30:00Z'
  },
  {
    id: '2',
    incidentId: 'INC-001',
    status: 'Assigned',
    actor: 'System',
    timestamp: '2024-01-15T09:35:00Z',
    createdAt: '2024-01-15T09:35:00Z'
  },
  {
    id: '3',
    incidentId: 'INC-001',
    status: 'In Progress',
    actor: 'Jane Resolver',
    timestamp: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '4',
    incidentId: 'INC-004',
    status: 'Open',
    actor: 'Jane Resolver',
    timestamp: '2024-01-12T08:00:00Z',
    createdAt: '2024-01-12T08:00:00Z'
  },
  {
    id: '5',
    incidentId: 'INC-004',
    status: 'Assigned',
    actor: 'System',
    timestamp: '2024-01-12T08:05:00Z',
    createdAt: '2024-01-12T08:05:00Z'
  },
  {
    id: '6',
    incidentId: 'INC-004',
    status: 'In Progress',
    actor: 'Jane Resolver',
    timestamp: '2024-01-12T08:30:00Z',
    createdAt: '2024-01-12T08:30:00Z'
  },
  {
    id: '7',
    incidentId: 'INC-004',
    status: 'Resolved',
    actor: 'Jane Resolver',
    timestamp: '2024-01-12T14:00:00Z',
    createdAt: '2024-01-12T14:00:00Z'
  },
  {
    id: '8',
    incidentId: 'INC-005',
    status: 'Open',
    actor: 'Admin User',
    timestamp: '2024-01-11T03:00:00Z',
    createdAt: '2024-01-11T03:00:00Z'
  },
  {
    id: '9',
    incidentId: 'INC-005',
    status: 'Assigned',
    actor: 'System',
    timestamp: '2024-01-11T03:05:00Z',
    createdAt: '2024-01-11T03:05:00Z'
  },
  {
    id: '10',
    incidentId: 'INC-005',
    status: 'In Progress',
    actor: 'Admin User',
    timestamp: '2024-01-11T03:30:00Z',
    createdAt: '2024-01-11T03:30:00Z'
  },
  {
    id: '11',
    incidentId: 'INC-005',
    status: 'Resolved',
    actor: 'Admin User',
    timestamp: '2024-01-11T12:00:00Z',
    createdAt: '2024-01-11T12:00:00Z'
  },
  {
    id: '12',
    incidentId: 'INC-005',
    status: 'Closed',
    actor: 'Admin User',
    timestamp: '2024-01-11T15:00:00Z',
    createdAt: '2024-01-11T15:00:00Z'
  }
]

export const departments = [
  'Operations',
  'IT',
  'Customer Service',
  'Warehouse',
  'Security',
  'HR',
  'Finance',
  'Logistics',
  'Maintenance'
]

export const demoAccounts = [
  { email: 'reporter@dhl.com', password: 'password123', role: 'Reporter' },
  { email: 'resolver@dhl.com', password: 'password123', role: 'Resolver' },
  { email: 'admin@dhl.com', password: 'password123', role: 'Admin' }
]
