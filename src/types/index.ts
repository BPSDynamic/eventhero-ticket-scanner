export interface TicketData {
  EventID: string
  TicketNumberID: string
}

export interface EventData {
  EventID: string
  title: string
  Venue: string
  startDate: string
  posterUrl?: string
}

export interface ValidationResult {
  valid: boolean
  ticket?: TicketData
  error?: string
}