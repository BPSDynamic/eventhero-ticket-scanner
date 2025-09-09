"use client"
import { useRouter, useSearchParams } from 'next/navigation'
import { Container, Title, Text, Button } from '@mantine/core'

export default function TicketAlreadyUsedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ticketId = searchParams.get('ticketId')
  const customerEmail = searchParams.get('customerEmail')
  const eventId = searchParams.get('eventId')

  const handleScanAgain = () => {
    router.push(`/scan${eventId ? `?eventId=${eventId}` : ''}`)
  }

  const handleTryAnother = () => {
    router.push(`/ticket-number${eventId ? `?eventId=${eventId}` : ''}`)
  }

  return (
    <Container size="xs" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 20, maxWidth: 600, alignSelf: 'center', width: '100%' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingTop: 40, paddingBottom: 40, borderWidth: 4, borderStyle: 'solid', borderColor: '#F59E0B', borderRadius: 12, margin: 20, backgroundColor: '#FFFBEB' }}>
          <div style={{ alignItems: 'center', textAlign: 'center' }}>
            <Title order={1} style={{ fontSize: 24, fontWeight: 600, color: '#F59E0B', marginBottom: 16 }}>Ticket Already Used</Title>
            <Text style={{ fontSize: 16, color: '#374151', marginBottom: 8 }}>Ticket ID: {ticketId}</Text>
            <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 16 }}>Customer: {customerEmail}</Text>
            <Text style={{ fontSize: 14, color: '#F59E0B', textAlign: 'center', maxWidth: '80%' }}>
              This ticket has already been scanned and cannot be used again
            </Text>
          </div>
        </div>
        <div style={{ paddingBottom: 40, display: 'flex', flexDirection: 'column', gap: 15 }}>
          <Button onClick={handleScanAgain} style={{ width: '100%', height: 50, backgroundColor: '#0000FF', borderRadius: 10, fontSize: 16, fontWeight: 600 }}>
            Scan Again
          </Button>
          <Button variant="outline" onClick={handleTryAnother} style={{ width: '100%', height: 50, backgroundColor: '#fff', borderWidth: 1, borderColor: '#0000FF', borderRadius: 10, color: '#0000FF', fontSize: 16, fontWeight: 600 }}>
            Enter Ticket Number
          </Button>
        </div>
      </div>
    </Container>
  )
}


