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
        <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
            {/* Ultra-Compact Header */}
            <div className="bg-white border-b border-gray-100 px-4 py-2 flex items-center justify-center">
                <EventheroLogoIcon width={140} height={46} color="#0000FF"/>
            </div>
            
            {/* Main Content - Fits perfectly on mobile */}
            <div className="flex-1 flex items-center justify-center px-3 py-2">
                <div className="w-full max-w-xs bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    {/* Compact Title */}
                    <div className="text-center mb-4">
                        <Title order={2} className="text-lg font-semibold text-gray-900 mb-1">
                            Enter Event ID
                        </Title>
                        <Text className="text-xs text-gray-500">
                            Start scanning tickets
                        </Text>
                    </div>

                    {/* Input Section */}
                    <div className="space-y-3">
                        <TextInput
                            placeholder="Event ID (e.g., EVT123456)"
                            value={eventId}
                            onChange={handleInputChange}
                            size="sm"
                            className="w-full"
                            styles={{
                                input: { 
                                    height: 40, 
                                    fontSize: '15px', 
                                    borderColor: '#E5E7EB', 
                                    borderRadius: 8,
                                    backgroundColor: '#FFFFFF',
                                    '&:focus': {
                                        borderColor: '#0000FF',
                                        boxShadow: '0 0 0 2px rgba(0, 0, 255, 0.08)'
                                    }
                                }
                            }}
                        />
                        
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-2">
                                <Text className="text-red-600 text-xs text-center">{error}</Text>
                            </div>
                        )}
                    </div>

                    {/* Action Button */}
                    <div className="pt-3">
                        {loading ? (
                            <div className="h-9 flex items-center justify-center bg-gray-100 rounded-lg">
                                <Loader size="xs" color="#0000FF" className="mr-1"/>
                                <Text className="text-gray-600 text-sm">Searching...</Text>
                            </div>
                        ) : (
                            <Button
                                onClick={handleConfirm}
                                disabled={!isButtonEnabled}
                                size="sm"
                                fullWidth
                                className="h-9 text-sm font-medium"
                                style={{ 
                                    backgroundColor: isButtonEnabled ? '#0000FF' : '#E5E7EB',
                                    color: isButtonEnabled ? '#FFFFFF' : '#9CA3AF',
                                    borderRadius: 8,
                                    border: 'none'
                                }}
                            >
                                Find Event
                            </Button>
                        )}
                    </div>

                    {/* Helper Text */}
                    <div className="text-center pt-3">
                        <Text className="text-xs text-gray-400">
                            Need help? Contact support
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    )
}


