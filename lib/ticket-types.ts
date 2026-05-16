export type TicketStatus = 'Open' | 'On Hold' | 'In Progress' | 'Closed'

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical'

export interface Ticket {
  id: string
  title: string
  department: string
  status: TicketStatus
  priority: TicketPriority
}
