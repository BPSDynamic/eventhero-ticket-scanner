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
    <nav className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="mx-auto w-full max-w-phone tablet:max-w-tablet">
        <div className="grid grid-cols-4 gap-1 py-1">
          <button
            className={`flex flex-col items-center justify-center py-2 text-xs ${isActive('/event-id') ? 'text-brand' : 'text-gray-700'}`}
            onClick={() => router.push('/event-id')}
          >
            <IconId size={22} stroke={1.8} />
            <span className="mt-1">Event</span>
          </button>
          <button
            disabled={!eventId}
            className={`flex flex-col items-center justify-center py-2 text-xs ${!eventId ? 'text-gray-400' : isActive('/scan') ? 'text-brand' : 'text-gray-700'}`}
            onClick={() => eventId && router.push(`/scan?eventId=${eventId}`)}
          >
            {eventId ? <IconQrcode size={22} stroke={1.8} /> : <IconLock size={22} stroke={1.8} />}
            <span className="mt-1">Scan</span>
          </button>
          <button
            disabled={!eventId}
            className={`flex flex-col items-center justify-center py-2 text-xs ${!eventId ? 'text-gray-400' : isActive('/ticket-number') ? 'text-brand' : 'text-gray-700'}`}
            onClick={() => eventId && router.push(`/ticket-number?eventId=${eventId}`)}
          >
            {eventId ? <Icon123 size={22} stroke={1.8} /> : <IconLock size={22} stroke={1.8} />}
            <span className="mt-1">Manual</span>
          </button>
          <button
            className={`flex flex-col items-center justify-center py-2 text-xs text-red-600`}
            onClick={() => signOut().then(() => router.push('/signin'))}
          >
            <IconLogout size={22} stroke={1.8} />
            <span className="mt-1">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  )
}


