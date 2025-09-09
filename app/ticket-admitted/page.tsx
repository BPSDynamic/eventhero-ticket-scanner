"use client"
import {useRouter, useSearchParams} from 'next/navigation'
import {Container, Title, Text, Button} from '@mantine/core'

export default function TicketAdmittedPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const eventId = searchParams.get('eventId')

    const handleScanNext = () => {
        if (eventId) {
            router.push(`/scan?eventId=${eventId}`)
        } else {
            router.push('/event-id')
        }
    }

    return (
        <Container size="xs" style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 20px', maxWidth: 500, alignSelf: 'center', width: '100%' }}>
                <div style={{ alignItems: 'center', marginBottom: 60, textAlign: 'center' }}>
                    <img src="/assets/images/essential-achievements-man-male-png.png" alt="Success" style={{ width: 200, height: 200, marginBottom: 20 }} />
                    <Title order={1} style={{ fontSize: 24, fontWeight: 600, color: '#22C55E', textAlign: 'center', marginBottom: 10 }}>
                        Ticket Admitted Successfully
                    </Title>
                    <Text style={{ fontSize: 16, color: '#6B7280', textAlign: 'center', lineHeight: '22px' }}>
                        The ticket has been validated and the guest can enter.
                    </Text>
                </div>
                <Button onClick={handleScanNext} style={{ width: '100%', height: 48, backgroundColor: '#0000FF', borderRadius: 10, fontSize: 16, fontWeight: 600 }}>
                    Scan Next Ticket
                </Button>
            </div>
        </Container>
    )
}


