"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TextInput, Button, Title, Text, Loader, PasswordInput } from '@mantine/core'
import { EventheroLogoIcon } from '../../src/components/icons/EventheroLogoIcon'
import { signUp, confirmSignUp } from 'aws-amplify/auth'

export default function SignUp() {
  const router = useRouter()
  const [step, setStep] = useState<'signup' | 'confirm'>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [confirmationCode, setConfirmationCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password || !confirmPassword || !fullName) {
      setError('All fields are required')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setLoading(true)
    try {
      await signUp({
        username: email,
        password: password,
        options: {
          userAttributes: {
            email: email,
            name: fullName,
          }
        }
      })
      setStep('confirm')
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!confirmationCode) {
      setError('Confirmation code is required')
      return
    }

    setLoading(true)
    try {
      await confirmSignUp({
        username: email,
        confirmationCode: confirmationCode
      })
      router.push('/signin')
    } catch (err: unknown) {
      setError((err as Error).message || 'Invalid confirmation code')
    } finally {
      setLoading(false)
    }
  }

  const handleBackToSignIn = () => {
    router.push('/signin')
  }

  if (step === 'confirm') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Compact Header */}
        <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-center">
          <EventheroLogoIcon width={80} height={42} color="#0000FF" />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center px-4 py-4">
          <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg p-5">
            <Title order={1} className="text-center mb-3 text-lg font-bold text-gray-900">
              Verify Email
            </Title>
            
            <Text className="text-center mb-4 text-gray-600 text-sm">
              Code sent to {email}
            </Text>

            <form onSubmit={handleConfirmSignUp} className="space-y-4">
              <div>
                <TextInput
                  label="Verification Code"
                  placeholder="Enter 6-digit code"
                  value={confirmationCode}
                  onChange={(e) => { setConfirmationCode(e.target.value); setError('') }}
                  size="md"
                  className="w-full"
                  styles={{
                    label: { 
                      fontSize: '14px', 
                      fontWeight: 500,
                      color: '#374151', 
                      marginBottom: 8 
                    },
                    input: { 
                      height: 48, 
                      fontSize: '16px', 
                      borderColor: '#D1D5DB', 
                      borderRadius: 12,
                      borderWidth: 1,
                      textAlign: 'center',
                      letterSpacing: '0.5em',
                      '&:focus': {
                        borderColor: '#0000FF',
                        boxShadow: '0 0 0 3px rgba(0, 0, 255, 0.1)'
                      }
                    }
                  }}
                  maxLength={6}
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <Text className="text-red-600 text-sm text-center">{error}</Text>
                </div>
              )}

              <Button
                type="submit"
                size="md"
                fullWidth
                disabled={loading}
                className="h-12 text-base font-semibold"
                style={{ 
                  backgroundColor: loading ? '#9CA3AF' : '#0000FF',
                  borderRadius: 12,
                  border: 'none'
                }}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader size="sm" color="white" className="mr-2" />
                    Verifying...
                  </div>
                ) : (
                  'Verify Account'
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <Text className="text-gray-600">
                Already have an account?{' '}
                <Button 
                  variant="subtle" 
                  onClick={handleBackToSignIn}
                  className="text-blue-600 hover:text-blue-700 p-0 h-auto font-medium underline"
                >
                  Sign in here
                </Button>
              </Text>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Ultra-Compact Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-2 flex items-center justify-center">
        <EventheroLogoIcon width={60} height={32} color="#0000FF" />
      </div>

      {/* Main Content - Ultra-compact for mobile */}
      <div className="flex-1 flex items-center justify-center px-3 py-2">
        <div className="w-full max-w-xs bg-white rounded-xl shadow-sm border border-gray-100 p-3">
          <div className="text-center mb-3">
            <Title order={2} className="text-base font-semibold text-gray-900 mb-0.5">
              Create Account
            </Title>
            <Text className="text-xs text-gray-500">
              Join EventHero
            </Text>
          </div>

          <form onSubmit={handleSignUp} className="space-y-2">
            <div>
              <TextInput
                label="Full Name"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); setError('') }}
                size="md"
                className="w-full"
                styles={{
                  label: { 
                    fontSize: '11px', 
                    fontWeight: 500,
                    color: '#6B7280', 
                    marginBottom: 2 
                  },
                  input: { 
                    height: 36, 
                    fontSize: '14px', 
                    borderColor: '#E5E7EB', 
                    borderRadius: 6,
                    borderWidth: 1,
                    '&:focus': {
                      borderColor: '#0000FF',
                      boxShadow: '0 0 0 2px rgba(0, 0, 255, 0.08)'
                    }
                  }
                }}
                required
              />
            </div>

            <div>
              <TextInput
                label="Email Address"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                size="md"
                className="w-full"
                styles={{
                  label: { 
                    fontSize: '11px', 
                    fontWeight: 500,
                    color: '#6B7280', 
                    marginBottom: 2 
                  },
                  input: { 
                    height: 36, 
                    fontSize: '14px', 
                    borderColor: '#E5E7EB', 
                    borderRadius: 6,
                    borderWidth: 1,
                    '&:focus': {
                      borderColor: '#0000FF',
                      boxShadow: '0 0 0 2px rgba(0, 0, 255, 0.08)'
                    }
                  }
                }}
                type="email"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                size="md"
                className="w-full"
                styles={{
                  label: { 
                    fontSize: '11px', 
                    fontWeight: 500,
                    color: '#6B7280', 
                    marginBottom: 2 
                  },
                  input: { 
                    height: 36, 
                    fontSize: '14px', 
                    borderColor: '#E5E7EB', 
                    borderRadius: 6,
                    borderWidth: 1,
                    '&:focus': {
                      borderColor: '#0000FF',
                      boxShadow: '0 0 0 2px rgba(0, 0, 255, 0.08)'
                    }
                  }
                }}
                required
              />
              <Text className="text-xs text-gray-400 mt-0.5">
                8+ chars
              </Text>
            </div>

            <div>
              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError('') }}
                size="md"
                className="w-full"
                styles={{
                  label: { 
                    fontSize: '11px', 
                    fontWeight: 500,
                    color: '#6B7280', 
                    marginBottom: 2 
                  },
                  input: { 
                    height: 36, 
                    fontSize: '14px', 
                    borderColor: '#E5E7EB', 
                    borderRadius: 6,
                    borderWidth: 1,
                    '&:focus': {
                      borderColor: '#0000FF',
                      boxShadow: '0 0 0 2px rgba(0, 0, 255, 0.08)'
                    }
                  }
                }}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <Text className="text-red-600 text-sm text-center">{error}</Text>
              </div>
            )}

            <Button
              type="submit"
              size="sm"
              fullWidth
              disabled={loading}
              className="h-8 text-sm font-medium mt-3"
              style={{ 
                backgroundColor: loading ? '#9CA3AF' : '#0000FF',
                borderRadius: 6,
                border: 'none'
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader size="xs" color="white" className="mr-1" />
                  Creating...
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-3 text-center">
            <Text className="text-xs text-gray-600">
              Have an account?{' '}
              <Button 
                variant="subtle" 
                onClick={handleBackToSignIn}
                className="text-blue-600 hover:text-blue-700 p-0 h-auto text-xs font-medium"
              >
                Sign in
              </Button>
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}
