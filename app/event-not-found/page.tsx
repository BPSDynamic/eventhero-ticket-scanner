"use client"
import { useRouter } from 'next/navigation'
import { Title, Text, Button } from '@mantine/core'
import { EventheroLogoIcon } from '../../src/components/icons/EventheroLogoIcon'

export default function EventNotFoundPage() {
  const router = useRouter()

  const handleScanNow = () => {
    router.push('/scan?eventId=UNKNOWN')
  }

  const handleReenterEventId = () => {
    router.push('/event-id')
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Ultra-Compact Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-2 flex items-center justify-center">
        <EventheroLogoIcon width={140} height={46} color="#0000FF"/>
      </div>
      
      {/* Main Content - Mobile Optimized */}
      <div className="flex-1 flex items-center justify-center px-4 py-4">
        <div className="w-full max-w-xs bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          
          {/* Compact Error Icon */}
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                      stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Compact Title */}
          <Title order={2} className="text-lg font-semibold text-red-600 mb-2">
            Event Not Found
          </Title>

          {/* Essential Message Only */}
          <Text className="text-sm text-gray-600 mb-6 leading-relaxed">
            Use your QR code to access the event
          </Text>

          {/* Primary Action - Prominent */}
          <Button
            onClick={handleScanNow}
            size="sm"
            fullWidth
            className="h-10 text-sm font-semibold mb-3"
            style={{ 
              backgroundColor: '#0000FF',
              borderRadius: 8,
              border: 'none'
            }}
          >
            Scan QR Code
          </Button>

          {/* Secondary Action - De-emphasized */}
          <Button
            variant="subtle"
            onClick={handleReenterEventId}
            size="xs"
            className="text-gray-500 hover:text-gray-700 text-xs font-medium"
          >
            Enter Event ID instead
          </Button>
        </div>
      </div>
    </div>
  )
}


