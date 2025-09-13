"use client"
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { IconId, IconQrcode, IconLogout, Icon123, IconLock } from '@tabler/icons-react'
import { useEvent } from '../contexts/EventContext'

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuth()
  const { eventId } = useEvent()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="mx-auto w-full max-w-md">
        <div className="grid grid-cols-4 gap-0">
          <button
            className={`flex flex-col items-center justify-center py-3 transition-colors ${
              isActive('/event-id') 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
            onClick={() => router.push('/event-id')}
          >
            <IconId size={20} stroke={2} />
            <span className="text-xs mt-1 font-medium">Event</span>
          </button>
          
          <button
            disabled={!eventId}
            className={`flex flex-col items-center justify-center py-3 transition-colors ${
              !eventId 
                ? 'text-gray-400 cursor-not-allowed' 
                : isActive('/scan') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
            onClick={() => eventId && router.push(`/scan?eventId=${eventId}`)}
          >
            {eventId ? (
              <IconQrcode size={20} stroke={2} />
            ) : (
              <IconLock size={20} stroke={2} />
            )}
            <span className="text-xs mt-1 font-medium">Scan</span>
          </button>
          
          <button
            disabled={!eventId}
            className={`flex flex-col items-center justify-center py-3 transition-colors ${
              !eventId 
                ? 'text-gray-400 cursor-not-allowed' 
                : isActive('/ticket-number') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
            onClick={() => eventId && router.push(`/ticket-number?eventId=${eventId}`)}
          >
            {eventId ? (
              <Icon123 size={20} stroke={2} />
            ) : (
              <IconLock size={20} stroke={2} />
            )}
            <span className="text-xs mt-1 font-medium">Manual</span>
          </button>
          
          <button
            className="flex flex-col items-center justify-center py-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
            onClick={() => signOut().then(() => router.push('/signin'))}
          >
            <IconLogout size={20} stroke={2} />
            <span className="text-xs mt-1 font-medium">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  )
}


