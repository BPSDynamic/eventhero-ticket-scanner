"use client"
import {useState, useMemo, useCallback} from 'react'
import {useRouter} from 'next/navigation'
import {Container, TextInput, Button, Title, Text, Stack, Loader} from '@mantine/core'
import {EventheroLogoIcon} from '../../src/components/icons/EventheroLogoIcon'
import {getEvent} from '../../src/services/api'
import { useEvent } from '../../src/contexts/EventContext'

export default function EventIdPage() {
    const router = useRouter()
    const { setEventId } = useEvent()
    const [eventId, setLocalEventId] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const isButtonEnabled = useMemo(() => eventId.trim().length > 0, [eventId])

    const handleConfirm = useCallback(async () => {
        if (loading || !isButtonEnabled) return
        const trimmedEventId = eventId.trim()
        if (!trimmedEventId) {
            setError('Event ID is required')
            return
        }
        setError('')
        setLoading(true)
        try {
            const result = await getEvent(trimmedEventId)
            if (result.found && result.event) {
                const eventData = {
                    EventID: result.event.EventID,
                    title: result.event.EventName,
                    Venue: result.event.Venue,
                    startDate: result.event.StartDate,
                    posterUrl: result.event.PosterURL,
                    description: result.event.Description
                }
                setEventId(result.event.EventID)
                router.push(`/event-found?event=${encodeURIComponent(JSON.stringify(eventData))}`)
            } else {
                router.push('/event-not-found')
            }
        } catch (error) {
            console.error('❌ Error during event lookup:', error)
            router.push('/event-not-found')
        } finally {
            setLoading(false)
        }
    }, [loading, isButtonEnabled, eventId, router])

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalEventId(e.target.value)
        setError('')
    }, [])

    return (
        <Container size="xs" style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
            <div className="pt-10 pb-6 text-center">
                <EventheroLogoIcon width={160} height={86} color="#0D091A"/>
            </div>
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                paddingBottom: '2rem'
            }}>
                <Stack align="center" gap="xl">
                    <Title order={1} ta="center" size="1.75rem" fw={700} c="#0D091A">Event ID</Title>
                    <Text ta="center" size="md" fw={300} c="#6B7280" style={{lineHeight: 1.4, maxWidth: 400, paddingHorizontal: 10}}>
                        To start scanning the tickets, please enter the eventID associated with your event.
                    </Text>
                    <TextInput
                        placeholder="Enter Event ID"
                        value={eventId}
                        onChange={handleInputChange}
                        size="md"
                        style={{width: '100%'}}
                        styles={{ input: { height: 50, fontSize: '1rem', borderColor: '#D1D5DB', borderRadius: 8, color: '#0D091A' } }}
                    />
                    {error && (<Text c="red" ta="center" size="sm" fw={400}>{error}</Text>)}
                    {loading ? (
                        <div style={{ height: 52, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            <Loader size="lg" color="#0000FF"/>
                        </div>
                    ) : (
                        <Button onClick={handleConfirm} disabled={!isButtonEnabled} size="md" fullWidth style={{ backgroundColor: isButtonEnabled ? '#0000FF' : '#E5E7EB', color: isButtonEnabled ? '#fff' : '#9CA3AF', height: 48, borderRadius: 10, fontSize: '1rem', fontWeight: 600 }}>
                            Confirm
                        </Button>
                    )}
                </Stack>
            </div>
        </Container>
    )
}


