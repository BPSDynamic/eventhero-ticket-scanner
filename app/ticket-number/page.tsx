"use client"
import {useState} from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import {Container, Title, TextInput, Button, Text, Loader} from '@mantine/core'
import {validateTicketWithSecurityChecks} from '../../src/services/api'
import { useEvent } from '../../src/contexts/EventContext'

export default function TicketNumberPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const paramEventId = searchParams.get('eventId')
    const { eventId: ctxEventId } = useEvent()
    const eventId = paramEventId || ctxEventId
    const [ticketNumber, setTicketNumber] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleValidate = async () => {
        if (loading) return
        const trimmedTicket = ticketNumber.trim()
        if (!trimmedTicket) {
            setError('Please enter a ticket number')
            return
        }
        if (!eventId) {
            setError('No event ID found. Please try again.')
            return
        }
        setError('')
        setLoading(true)
        try {
            const result = await validateTicketWithSecurityChecks(eventId as string, trimmedTicket)
            if (result.valid && result.ticket?.CustomerEmail) {
                router.push(`/ticket-valid?ticketId=${trimmedTicket}&customerEmail=${encodeURIComponent(result.ticket.CustomerEmail)}&eventId=${eventId}`)
            } else {
                const errorParams = new URLSearchParams({
                    ticketId: trimmedTicket,
                    eventId: eventId as string,
                    error: result.violationType || 'validation_failed',
                    message: result.error || 'Ticket validation failed'
                })
                router.push(`/ticket-invalid?${errorParams.toString()}`)
            }
        } catch (err) {
            console.error('🚨 Manual validation error:', err)
            router.push(`/ticket-invalid?ticketId=${trimmedTicket}&eventId=${eventId}&error=system_error`)
        } finally {
            setLoading(false)
        }
    }

    const isButtonActive = ticketNumber.trim().length > 0

    return (
        <Container size="xs" style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '40px 20px',
                maxWidth: 500,
                alignSelf: 'center',
                width: '100%'
            }}>
                <Title order={1} style={{ fontWeight: 300, fontSize: 16, lineHeight: '22px', textAlign: 'center', color: '#000', marginBottom: 20, padding: '0 20px' }}>
                    Enter the ticket number
                </Title>
                {eventId && (
                    <Text style={{ fontSize: 12, color: '#666', textAlign: 'center', marginBottom: 20 }}>
                        Event ID: {eventId}
                    </Text>
                )}
                <TextInput
                    placeholder="Enter ticket number"
                    value={ticketNumber}
                    onChange={(e) => { setTicketNumber(e.target.value); setError('') }}
                    maxLength={50}
                    style={{width: '100%', marginBottom: 25}}
                    styles={{ input: { height: 65, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: '0 16px', fontSize: 18, backgroundColor: '#fff', textAlign: 'center', color: '#000' } }}
                />
                {error && (
                    <Text style={{ color: '#EF4444', fontSize: 14, textAlign: 'center', marginBottom: 20, fontWeight: 400 }}>
                        {error}
                    </Text>
                )}
                {loading ? (
                    <div style={{ height: 52, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        <Loader size="lg" color="#0000FF"/>
                    </div>
                ) : (
                    <Button onClick={handleValidate} disabled={!isButtonActive} style={{ width: '100%', height: 48, backgroundColor: isButtonActive ? '#0000FF' : '#E5E7EB', color: isButtonActive ? '#fff' : '#9CA3AF', borderRadius: 10, fontSize: 16, fontWeight: 600 }}>
                        Validate Ticket
                    </Button>
                )}
            </div>
        </Container>
    )
}


