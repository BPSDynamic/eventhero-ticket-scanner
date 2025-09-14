"use client"
import {useSearchParams} from 'next/navigation'
import {Container, Title, Text, Button} from '@mantine/core'
import {IconX} from '@tabler/icons-react'
import {useRouter} from 'next/navigation'

export default function TicketAlreadyUsedPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const ticketId = searchParams.get('ticketId')
    const customerEmail = searchParams.get('customerEmail')
    const eventId = searchParams.get('eventId')

    const handleScanAnother = () => {
        router.push(`/scan?eventId=${eventId}`)
    }

    const handleNewEvent = () => {
        router.push('/event-id')
    }

    return (
        <Container size="xs" style={{minHeight: '80vh', display: 'flex', flexDirection: 'column'}}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '0 20px', maxWidth: 600, alignSelf: 'center', width: '100%' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px 0', borderWidth: 4, borderStyle: 'solid', borderColor: '#EF4444', borderRadius: 12, margin: 20, backgroundColor: '#FEF2F2' }}>
                    <div style={{marginBottom: 20}}>
                        <IconX size={60} color="#EF4444"/>
                    </div>
                    <div style={{alignItems: 'center', textAlign: 'center'}}>
                        <Title order={1} style={{ fontSize: 24, fontWeight: 600, color: '#EF4444', marginBottom: 16 }}>Ticket Already Used</Title>
                        <Text style={{ fontSize: 16, color: '#374151', marginBottom: 8 }}>Ticket ID: {ticketId}</Text>
                        <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}>Customer: {customerEmail}</Text>
                        <Text style={{ fontSize: 16, color: '#374151' }}>This ticket has already been scanned</Text>
                    </div>
                </div>
                <div style={{paddingBottom: 24, display: 'flex', flexDirection: 'column', gap: 12}}>
                    <Button onClick={handleScanAnother} style={{ width: '100%', height: 48, backgroundColor: '#0000FF', borderRadius: 10, fontSize: 16, fontWeight: 600 }}>
                        Scan Another Ticket
                    </Button>
                    <Button onClick={handleNewEvent} variant="outline" style={{ width: '100%', height: 48, borderRadius: 10, fontSize: 16, fontWeight: 600 }}>
                        New Event
                    </Button>
                </div>
            </div>
        </Container>
    )
}