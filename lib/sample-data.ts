import type { Ticket } from '@/lib/ticket-types'

export const sampleTickets: Ticket[] = [
  {
    id: 'TKT-001',
    title: 'Unable to access VPN',
    department: 'IT Support',
    status: 'Open',
    priority: 'High',
  },
  {
    id: 'TKT-002',
    title: 'Payroll statement mismatch',
    department: 'Finance',
    status: 'In Progress',
    priority: 'Medium',
  },
]
