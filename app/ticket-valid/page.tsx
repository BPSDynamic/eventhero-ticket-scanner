"use client"
import {useState} from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import {Container, Title, Text, Button, Loader} from '@mantine/core'
import {IconCheck} from '@tabler/icons-react'

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
            const response = await fetch(process.env.NEXT_PUBLIC_ADMISSION_API_URL!, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customerEmail, ticketId })
            })
            const result = await response.json()
            if (response.ok && result.message === "Ticket validated successfully") {
                router.push(`/ticket-admitted?eventId=${eventId}`)
            } else if (result.error === "Ticket Already Scanned") {
                router.push(`/ticket-already-used?ticketId=${ticketId}&customerEmail=${encodeURIComponent(customerEmail)}&eventId=${eventId}`)
            } else {
                router.push(`/ticket-invalid?ticketId=${ticketId}&eventId=${eventId}`)
            }
        } catch (error) {
            console.error('🎫 API Error:', error)
            router.push(`/ticket-invalid?ticketId=${ticketId}&eventId=${eventId}`)
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


