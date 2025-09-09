"use client"
import {useState, useMemo} from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import {Container, Title, Text, Button, Card, Stack} from '@mantine/core'
import {EventheroLogoIcon} from '../../src/components/icons/EventheroLogoIcon'

export default function EventFoundPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [imageError, setImageError] = useState(false)

    const eventParam = searchParams.get('event')
    const eventData = useMemo(() => {
        try {
            return eventParam ? JSON.parse(eventParam) : null
        } catch {
            return null
        }
    }, [eventParam])

    const handleScanNow = () => {
        router.push(`/scan?eventId=${eventData?.EventID}`)
    }

    const handleReenterId = () => {
        router.push('/event-id')
    }

    if (!eventData) {
        return (
            <Container size="sm" style={{paddingTop: '4rem', textAlign: 'center'}}>
                <Text>No event data found</Text>
            </Container>
        )
    }

    return (
        <Container size="sm" style={{paddingTop: '1rem'}}>
            <Stack align="center" gap="lg">
                <div className="pt-4 pb-2 text-center">
                    <EventheroLogoIcon width={120} height={70} color="#0D091A"/>
                </div>
                <Title order={1} ta="center" size="1.25rem">Event Found</Title>
                <Card shadow="sm" padding="lg" radius="md" withBorder style={{width: '100%', position: 'relative'}}>
                    {eventData.posterUrl && !imageError ? (
                        <img src={eventData.posterUrl} alt="Event poster" style={{ width: '100%', height: 250, objectFit: 'cover', borderRadius: 8 }} onError={() => setImageError(true)} />
                    ) : (
                        <div style={{ width: '100%', height: 250, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>
                            <Text size="3rem">📅</Text>
                        </div>
                    )}
                    <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: 16, borderRadius: 8, color: 'white' }}>
                        {eventData.startDate && (<Text size="sm" mb={4}>{eventData.startDate}</Text>)}
                        <Text size="lg" fw={600} mb={4}>{eventData.title}</Text>
                        {eventData.Venue && (<Text size="sm" opacity={0.8}>{eventData.Venue}</Text>)}
                    </div>
                </Card>
                <Text ta="center" color="#6B7280" px="md">
                    Make sure this is the right one happening today.
                    If it's not, try entering the Event ID again.
                </Text>
                <Stack gap="md" style={{width: '100%'}}>
                    <Button fullWidth size="md" onClick={handleScanNow} style={{backgroundColor: '#0000FF', height: 48}}>Scan Now</Button>
                    <Button fullWidth size="md" variant="outline" onClick={handleReenterId} style={{borderColor: '#B0B0FF', color: '#B0B0FF', height: 48}}>Re-enter ID</Button>
                </Stack>
                <Text ta="center" size="sm" color="#6B7280">
                    Still having trouble?
                    <Text component="span" color="#B0B0FF" fw={500}> Contact support.</Text>
                </Text>
            </Stack>
        </Container>
    )
}


