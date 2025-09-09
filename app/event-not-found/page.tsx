"use client"
import { useRouter } from 'next/navigation'
import { Container, Title, Text, Button } from '@mantine/core'

export default function EventNotFoundPage() {
  const router = useRouter()

  const handleScanNow = () => {
    router.push('/scan?eventId=UNKNOWN')
  }

  const handleReenterEventId = () => {
    router.push('/event-id')
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16
    }}>
      <div style={{
        width: '100%',
        maxWidth: 396,
        minHeight: 754,
        backgroundColor: '#ffffff',
        borderRadius: 15,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20
      }}>
        <img
          src="/assets/images/group1537.jpg"
          alt="Event not found"
          style={{ position: 'absolute', top: 142, width: 189, height: 189, left: '50%', transform: 'translateX(-50%)' }}
        />
        <Title order={1} style={{ position: 'absolute', top: 355, width: 170, height: 56, fontWeight: 600, fontSize: 20, lineHeight: '28px', textAlign: 'center', color: '#EF4444', left: '50%', transform: 'translateX(-50%)' }}>
          We cannot locate{'\n'}the Event
        </Title>
        <Text style={{ position: 'absolute', top: 435, width: 300, fontWeight: 300, fontSize: 18, lineHeight: '24px', textAlign: 'center', color: '#6B7280', left: '50%', transform: 'translateX(-50%)' }}>
          But, don't worry.{"\n"}This is the moment we say:{"\n"}"It's not you, it's us"
        </Text>
        <Text style={{ position: 'absolute', top: 575, width: 304, height: 66, fontWeight: 300, fontSize: 16, lineHeight: '22px', textAlign: 'center', color: '#000000', left: '50%', transform: 'translateX(-50%)' }}>
          Try using the QR code to access your event. You access the QR code from your account settings
        </Text>
        <Button onClick={handleScanNow} style={{ position: 'absolute', top: 672, width: 352, height: 61, backgroundColor: '#0000FF', borderRadius: 10, fontSize: 16, fontWeight: 600, left: '50%', transform: 'translateX(-50%)' }}>
          Scan Now
        </Button>
        <Button variant="outline" onClick={handleReenterEventId} style={{ position: 'absolute', top: 750, width: 352, height: 61, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#B0B0FF', borderRadius: 10, color: '#000000', fontSize: 16, fontWeight: 600, left: '50%', transform: 'translateX(-50%)' }}>
          Re-enter Event ID
        </Button>
      </div>
    </div>
  )
}


