"use client"
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { Loader, Container } from '@mantine/core'

const publicRoutes = ['/home', '/signin']

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

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
            <Container style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Loader size="xl" color="#0000FF" />
            </Container>
        )
    }

    return <>{children}</>
}