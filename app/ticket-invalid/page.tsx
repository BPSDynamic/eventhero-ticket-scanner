"use client"
import { useRouter, useSearchParams } from 'next/navigation'
import { Container, Title, Text, Button } from '@mantine/core'

export default function TicketInvalidPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ticketId = searchParams.get('ticketId')
  const eventId = searchParams.get('eventId')

  const handleScanAgain = () => {
    router.push(`/scan?eventId=${eventId}`)
  }

  const handleTryTicketNumber = () => {
    router.push(`/ticket-number?eventId=${eventId}`)
  }

  return (
    <Container size="xs" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 20, maxWidth: 600, alignSelf: 'center', width: '100%' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingTop: 40, paddingBottom: 40, borderWidth: 4, borderStyle: 'solid', borderColor: '#EF4444', borderRadius: 12, margin: 20, backgroundColor: '#FEF2F2' }}>
          <div style={{ alignItems: 'center', textAlign: 'center' }}>
            <Title order={1} style={{ fontSize: 24, fontWeight: 600, color: '#EF4444', marginBottom: 16 }}>Invalid Ticket</Title>
            <Text style={{ fontSize: 16, color: '#374151', marginBottom: 8 }}>Ticket ID: {ticketId}</Text>
            <Text style={{ fontSize: 16, color: '#374151', marginBottom: 16 }}>Event ID: {eventId}</Text>
            <Text style={{ fontSize: 14, color: '#EF4444', textAlign: 'center', maxWidth: '80%' }}>
              This ticket is not valid for this event
            </Text>
          </div>
        </div>
        <div style={{ paddingBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Button onClick={handleScanAgain} style={{ width: '100%', height: 48, backgroundColor: '#0000FF', borderRadius: 10, fontSize: 16, fontWeight: 600 }}>
            Scan Again
          </Button>
          <Button variant="outline" onClick={handleTryTicketNumber} style={{ width: '100%', height: 48, backgroundColor: '#fff', borderWidth: 1, borderColor: '#0000FF', borderRadius: 10, color: '#0000FF', fontSize: 16, fontWeight: 600 }}>
            Try Ticket Number
          </Button>
        </div>
      </div>
    </Container>
  )
}


