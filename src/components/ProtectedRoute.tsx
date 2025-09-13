"use client"
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { Loader } from '@mantine/core'
import { BottomNav } from './BottomNav'

const publicRoutes = ['/home', '/signin', '/signup', '/forgot-password']
const authPages = ['/signin', '/signup', '/forgot-password']

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const isAuthPage = authPages.includes(pathname)

    useEffect(() => {
        if (!loading) {
            if (!user && !publicRoutes.includes(pathname)) {
                router.push('/signin')
            }
            if (user && publicRoutes.includes(pathname)) {
                router.push('/event-id')
            }
        }
    }, [user, loading, router, pathname])

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <Loader size="xl" color="#0000FF" />
            </div>
        )
    }

    if (isAuthPage) {
        // Auth pages: No bottom nav, full screen
        return <>{children}</>
    }

    // App pages: With bottom nav and mobile layout
    return (
        <div className="mx-auto w-full max-w-md min-h-screen flex flex-col bg-gray-50">
            <div className="flex-1 pb-20">
                {children}
            </div>
            <BottomNav />
        </div>
    )
}