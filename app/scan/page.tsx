"use client"
import {useRouter, useSearchParams} from 'next/navigation'
import {useState, useEffect} from 'react'
import {QRScanner} from '../../src/components/QRScanner'
import {validateTicketWithSecurityChecks, parseQRCode} from '../../src/services/api'
import {Button, Text, Loader, ActionIcon} from '@mantine/core'
import { useEvent } from '../../src/contexts/EventContext'

export default function ScanPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const paramEventId = searchParams.get('eventId')
    const { eventId: ctxEventId } = useEvent()
    const eventId = paramEventId || ctxEventId || ''
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [scanned, setScanned] = useState(false)
    const [isValidating, setIsValidating] = useState(false)
    const [cameraPermission, setCameraPermission] = useState<boolean | null>(null)
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
    const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([])
    const [currentDeviceId, setCurrentDeviceId] = useState<string>('')
    const [qrDetected, setQrDetected] = useState<boolean>(false)
    const [detectedQrData, setDetectedQrData] = useState<string>('')
    const [shouldScan, setShouldScan] = useState<boolean>(false)

    useEffect(() => {
        if (!eventId) {
            router.push('/event-id')
            return
        }
        const checkCameraAvailability = async () => {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                try {
                    await navigator.mediaDevices.getUserMedia({video: true})
                    setCameraPermission(true)
                    const devices = await navigator.mediaDevices.enumerateDevices()
                    const videoDevices = devices.filter(device => device.kind === 'videoinput')
                    setAvailableCameras(videoDevices)
                    const rearCamera = videoDevices.find(device =>
                        device.label.toLowerCase().includes('back') ||
                        device.label.toLowerCase().includes('rear') ||
                        device.label.toLowerCase().includes('environment')
                    )
                    if (rearCamera) {
                        setCurrentDeviceId(rearCamera.deviceId)
                    } else if (videoDevices.length > 0) {
                        setCurrentDeviceId(videoDevices[0].deviceId)
                    }
                } catch (err) {
                    setCameraPermission(false)
                }
            } else {
                setCameraPermission(false)
            }
        }
        checkCameraAvailability()
    }, [eventId, router])

    const handleQrDetection = (detected: boolean, data?: string) => {
        setQrDetected(detected)
        if (detected && data) {
            setDetectedQrData(data)
        } else {
            setDetectedQrData('')
        }
        if (shouldScan) {
            setShouldScan(false)
        }
    }

    const handleScanButtonClick = () => {
        if (qrDetected && detectedQrData) {
            setShouldScan(true)
        }
    }

    const handleScan = async (qrData: string) => {
        if (scanned || isValidating || !eventId) return
        setScanned(true)
        setIsValidating(true)
        setError('')
        try {
            const parsedData = parseQRCode(qrData)
            const ticketId = parsedData.ticketId
            const qrCodeEventId = parsedData.eventId
            const customerEmail = parsedData.customerEmail
            if (!ticketId) {
                setError('Invalid QR code: No ticket ID found')
                router.push(`/ticket-invalid?ticketId=${qrData}&eventId=${eventId}&error=invalid_qr`)
                return
            }
            const result = await validateTicketWithSecurityChecks(
                eventId as string,
                ticketId,
                qrCodeEventId
            )
            if (result.valid && result.ticket?.CustomerEmail) {
                const finalCustomerEmail = result.ticket.CustomerEmail || customerEmail || 'Unknown'
                router.push(`/ticket-valid?ticketId=${ticketId}&customerEmail=${encodeURIComponent(finalCustomerEmail)}&eventId=${eventId}`)
            } else {
                const errorParams = new URLSearchParams({
                    ticketId: ticketId,
                    eventId: eventId as string,
                    error: result.violationType || 'validation_failed',
                    message: result.error || 'Ticket validation failed'
                })
                router.push(`/ticket-invalid?${errorParams.toString()}`)
            }
        } catch (err) {
            console.error('🚨 Scan error:', err)
            setError('Ticket validation failed')
            router.push(`/ticket-invalid?ticketId=${qrData}&eventId=${eventId}&error=system_error`)
        } finally {
            setIsValidating(false)
            setScanned(false)
        }
    }

    const handleEnterTicketNumber = () => {
        router.push(`/ticket-number?eventId=${eventId}`)
    }

    const requestCameraPermission = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({video: true})
            setCameraPermission(true)
        } catch (err) {
            setCameraPermission(false)
        }
    }

    const switchCamera = () => {
        if (availableCameras.length > 1) {
            const currentIndex = availableCameras.findIndex(camera => camera.deviceId === currentDeviceId)
            const nextIndex = (currentIndex + 1) % availableCameras.length
            setCurrentDeviceId(availableCameras[nextIndex].deviceId)
            const nextCamera = availableCameras[nextIndex]
            const isFrontCamera = nextCamera.label.toLowerCase().includes('front') ||
                nextCamera.label.toLowerCase().includes('user') ||
                nextCamera.label.toLowerCase().includes('selfie')
            setFacingMode(isFrontCamera ? 'user' : 'environment')
        }
    }

    const CameraSwitchIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM15 15.5V13H9v2.5L5.5 12 9 8.5V11h6V8.5l3.5 3.5-3.5 3.5z" fill="currentColor"/>
        </svg>
    )

    if (cameraPermission === null) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Loader size="xl" color="#007AFF"/>
            </div>
        )
    }

    if (cameraPermission === false) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Text style={{ fontSize: 16, marginBottom: 20, textAlign: 'center' }}>
                    Camera permission is required
                </Text>
                <Button onClick={requestCameraPermission} style={{ backgroundColor: '#007AFF', padding: '12px 30px', borderRadius: 8, fontSize: 16, fontWeight: 600 }}>
                    Grant Permission
                </Button>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#000', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                <QRScanner onResult={handleScan} onDetect={handleQrDetection} deviceId={currentDeviceId} facingMode={facingMode} shouldScan={shouldScan} />
            </div>
            <div style={{ position: 'absolute', top: 80, left: 20, right: 20, display: 'flex', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center', backgroundColor: qrDetected ? 'rgba(0,150,0,0.8)' : 'rgba(0,0,0,0.7)', padding: 12, borderRadius: 8, border: qrDetected ? '2px solid #00ff00' : 'none' }}>
                    {error || (isValidating ? 'Validating ticket...' :
                        qrDetected ? 'QR Code detected! Tap &quot;Scan QR Code&quot; to proceed' : 'Point camera at QR code')}
                </Text>
            </div>
            {availableCameras.length > 1 && (
                <div style={{ position: 'absolute', top: 60, right: 20, zIndex: 10 }}>
                    <ActionIcon onClick={switchCamera} disabled={isValidating} size="lg" style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)' }}>
                        <CameraSwitchIcon />
                    </ActionIcon>
                </div>
            )}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 266, height: 266 }}>
                <div style={{ width: '100%', height: '100%', position: 'relative', boxShadow: qrDetected ? '0 0 20px rgba(0,255,0,0.6)' : 'none', borderRadius: 8 }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: 30, height: 30, borderTop: `3px solid ${qrDetected ? '#00ff00' : '#fff'}`, borderLeft: `3px solid ${qrDetected ? '#00ff00' : '#fff'}` }}/>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: 30, height: 30, borderTop: `3px solid ${qrDetected ? '#00ff00' : '#fff'}`, borderRight: `3px solid ${qrDetected ? '#00ff00' : '#fff'}` }}/>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: 30, height: 30, borderBottom: `3px solid ${qrDetected ? '#00ff00' : '#fff'}`, borderLeft: `3px solid ${qrDetected ? '#00ff00' : '#fff'}` }}/>
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderBottom: `3px solid ${qrDetected ? '#00ff00' : '#fff'}`, borderRight: `3px solid ${qrDetected ? '#00ff00' : '#fff'}` }}/>
                </div>
            </div>
            {isValidating && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Loader size="xl" color="#ffffff"/>
                </div>
            )}
            <div style={{position: 'absolute', bottom: 80, left: 20, right: 20}}>
                {qrDetected ? (
                    <Button onClick={handleScanButtonClick} disabled={isValidating || !detectedQrData} style={{ width: '100%', height: 50, backgroundColor: '#00ff00', color: '#000', borderRadius: 10, fontSize: 16, fontWeight: 600, boxShadow: '0 4px 20px rgba(0,255,0,0.4)' }}>
                        Scan QR Code
                    </Button>
                ) : (
                    <Button onClick={handleEnterTicketNumber} disabled={isValidating} style={{ width: '100%', height: 50, backgroundColor: '#fff', color: '#000', borderRadius: 10, fontSize: 16, fontWeight: 600 }}>
                        Enter Ticket Number
                    </Button>
                )}
            </div>
            {scanned && !isValidating && (
                <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(0,0,0,0.7)', padding: 12, borderRadius: 8 }}>
                    <Button variant="subtle" onClick={() => setScanned(false)} style={{color: '#fff', fontSize: 14}}>
                        Tap to Scan Again
                    </Button>
                </div>
            )}
        </div>
    )
}


