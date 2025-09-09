"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../src/contexts/AuthContext'
import { Loader, Container } from '@mantine/core'

export default function IndexPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/event-id')
      } else {
        router.push('/home')
      }
    }
  }, [user, loading, router])

  return (
    <Container>
      <Loader size="xl" />
    </Container>
  )
}


