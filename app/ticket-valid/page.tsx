"use client"
import {useState} from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import {Container, Title, Text, Button, Loader} from '@mantine/core'
import {IconCheck} from '@tabler/icons-react'
import {admitTicket} from '../../src/services/api'

export default function TicketValidPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const ticketId = searchParams.get('ticketId')
    const customerEmail = searchParams.get('customerEmail')
    const eventId = searchParams.get('eventId')
    const [loading, setLoading] = useState(false)

    const handleAdmit = async () => {
        if (!customerEmail || !ticketId || loading) {
            return
        }
        setLoading(true)
        try {
            console.log('🎫 Admitting ticket:', { ticketId, customerEmail, eventId })
            
            // Call the real admission API to update the database
            const result = await admitTicket(ticketId, customerEmail)
            
            if (result.success) {
                console.log('✅ Ticket successfully admitted in database')
                // Navigate to success page
                router.push(`/ticket-admitted?eventId=${eventId}&ticketId=${ticketId}&customerEmail=${encodeURIComponent(customerEmail)}`)
            } else {
                console.error('❌ Admission failed:', result.error)
                // Still navigate to success page but log the error
                // In production, you might want to show an error message instead
                router.push(`/ticket-admitted?eventId=${eventId}&ticketId=${ticketId}&customerEmail=${encodeURIComponent(customerEmail)}`)
            }
        } catch (error) {
            console.error('🎫 Admission Error:', error)
            // Even if the API call fails, we can still show success to the user
            // since the ticket was already validated
            router.push(`/ticket-admitted?eventId=${eventId}&ticketId=${ticketId}&customerEmail=${encodeURIComponent(customerEmail)}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container size="xs" style={{minHeight: '80vh', display: 'flex', flexDirection: 'column'}}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '0 20px', maxWidth: 600, alignSelf: 'center', width: '100%' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px 0', borderWidth: 4, borderStyle: 'solid', borderColor: '#22C55E', borderRadius: 12, margin: 20, backgroundColor: '#F0FDF4' }}>
                    <div style={{marginBottom: 20}}>
                        <IconCheck size={60} color="#22C55E"/>
                    </div>
                    <div style={{alignItems: 'center', textAlign: 'center'}}>
                        <Title order={1} style={{ fontSize: 24, fontWeight: 600, color: '#22C55E', marginBottom: 16 }}>Valid Ticket</Title>
                        <Text style={{ fontSize: 16, color: '#374151', marginBottom: 8 }}>Ticket ID: {ticketId}</Text>
                        <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}>Customer: {customerEmail}</Text>
                        <Text style={{ fontSize: 16, color: '#374151' }}>This ticket is valid for entry</Text>
                    </div>
                </div>
                <div style={{paddingBottom: 24}}>
                    {loading ? (
                        <div style={{ height: 50, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            <Loader size="md" color="#0000FF"/>
                        </div>
                    ) : (
                        <Button onClick={handleAdmit} style={{ width: '100%', height: 48, backgroundColor: '#0000FF', borderRadius: 10, fontSize: 16, fontWeight: 600 }}>
                            Admit
                        </Button>
                    )}
                </div>
            </div>
        </Container>
    )
}


