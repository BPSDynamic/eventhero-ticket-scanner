"use client"
import { useState } from 'react'
import { useAuth } from '../../src/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Container, TextInput, Button, Title, Text, Stack, Group, Loader, PasswordInput } from '@mantine/core'
import { EventheroLogoIcon } from '../../src/components/icons/EventheroLogoIcon'

export default function SignIn() {
  const { signIn, loading } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Email and password are required')
      return
    }
    try {
      await signIn(email, password)
      router.push('/event-id')
    } catch (err) {
      setError('Invalid email or password')
    }
  }

  const handleSignUp = () => {
    window.open('https://m9vuvsxvc4.eu-west-1.awsapprunner.com/register', '_blank')
  }

  const handleForgotPassword = () => {
    window.open('https://m9vuvsxvc4.eu-west-1.awsapprunner.com/forgot-password', '_blank')
  }

  return (
    <Container size="xs" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="pt-10 pb-6 text-center">
        <EventheroLogoIcon width={160} height={86} color="#0D091A" />
      </div>
      <div className="flex-1 flex flex-col justify-center pb-6">
        <Title order={1} ta="center" mb="xl" size="1.5rem" fw={700} c="#0D091A">
          Sign In
        </Title>
        <form onSubmit={handleSignIn}>
          <Stack gap="sm">
            <TextInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
              size="md"
              styles={{
                label: { fontSize: '0.75rem', color: '#9CA1AA', marginBottom: 6 },
                input: { height: 52, paddingTop: 14, fontSize: '1rem', borderColor: '#9CA1AA', borderRadius: 12 }
              }}
              type="email"
              autoComplete="email"
            />
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              size="md"
              styles={{
                label: { fontSize: '0.75rem', color: '#9CA1AA', marginBottom: 6 },
                input: { height: 52, paddingTop: 14, fontSize: '1rem', borderColor: '#9CA1AA', borderRadius: 12 }
              }}
            />
            <Group justify="space-between" mt="xs" mb="md">
              <Button variant="subtle" size="sm" onClick={handleSignUp} style={{ color: '#0000FF', fontWeight: 500 }}>Sign Up</Button>
              <Button variant="subtle" size="sm" onClick={handleForgotPassword} style={{ color: '#0000FF', fontWeight: 500 }}>Forgot Password?</Button>
            </Group>
            {error && (<Text c="red" ta="center" size="sm" mb="md">{error}</Text>)}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <Loader size="lg" color="#0000FF" />
              </div>
            ) : (
              <Button type="submit" size="md" fullWidth style={{ backgroundColor: '#0000FF', height: 48, borderRadius: 10, fontSize: '1rem', fontWeight: 600 }}>Sign In</Button>
            )}
          </Stack>
        </form>
      </div>
    </Container>
  )
}


