"use client"
import React from 'react'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { AuthProvider } from '../src/contexts/AuthContext'
import { ProtectedRoute } from '../src/components/ProtectedRoute'
import { EventProvider } from '../src/contexts/EventContext'
import { BottomNav } from '../src/components/BottomNav'
import '../src/styles/globals.css'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '../lib/amplify'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white">
        <MantineProvider>
          <Notifications />
          <AuthProvider>
            <EventProvider>
              <ProtectedRoute>
                <div className="mx-auto w-full max-w-phone tablet:max-w-tablet min-h-screen flex flex-col">
                  <div className="flex-1">
                    {children}
                  </div>
                  <BottomNav />
                </div>
              </ProtectedRoute>
            </EventProvider>
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  )
}


