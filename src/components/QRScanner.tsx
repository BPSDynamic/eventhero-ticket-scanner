import React, { useEffect, useRef } from 'react'
import QrScanner from 'react-qr-scanner'

interface QRScannerProps {
    onResult: (data: string) => void;
    onDetect?: (detected: boolean, data?: string) => void;
    deviceId?: string;
    facingMode?: 'user' | 'environment';
    shouldScan?: boolean;
}
export const QRScanner: React.FC<QRScannerProps> = ({
    onResult,
    deviceId,
    facingMode = 'environment'
}) => {
    const scannerRef = useRef<any>(null)

    const handleScan = (data: any) => {
        if (data) {
            onResult(data.text || data)
        }
    }

    const handleError = (err: any) => {
        console.error('QR Scanner error:', err)
    }

    // Create constraints object for camera selection
    const getConstraints = () => {
        if (deviceId) {
            // Use specific device ID when provided
            return {
                video: {
                    deviceId: { exact: deviceId },
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            }
        } else {
            // Fallback to facingMode
            return {
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            }
        }
    }

    // Force scanner restart when camera changes
    useEffect(() => {
        // The react-qr-scanner component will automatically restart
        // when its key changes, forcing it to use new constraints
    }, [deviceId, facingMode])

    return (
        <div className="scanner-container">
            <QrScanner
                key={`${deviceId}-${facingMode}`} // Force remount on camera change
                ref={scannerRef}
                delay={100} // Faster detection
                onError={handleError}
                onScan={handleScan}
                style={{ width: '100%' }}
                facingMode={facingMode}
                constraints={getConstraints()}
                legacyMode={false}
            />
        </div>
    )
}