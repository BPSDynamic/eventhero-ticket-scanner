"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TextInput, Button, Title, Text, Loader, PasswordInput } from '@mantine/core'
import { EventheroLogoIcon } from '../../src/components/icons/EventheroLogoIcon'
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth'

export default function ForgotPassword() {
  const router = useRouter()
  const [step, setStep] = useState<'request' | 'confirm'>('request')
  const [email, setEmail] = useState('')
  const [confirmationCode, setConfirmationCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email) {
      setError('Email is required')
      return
    }

    setLoading(true)
    try {
      await resetPassword({ username: email })
      setStep('confirm')
      setSuccess('Password reset code sent to your email')
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to send reset code')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!confirmationCode || !newPassword || !confirmPassword) {
      setError('All fields are required')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setLoading(true)
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: confirmationCode,
        newPassword: newPassword
      })
      setSuccess('Password reset successfully! Redirecting to sign in...')
      setTimeout(() => router.push('/signin'), 2000)
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  const handleBackToSignIn = () => {
    router.push('/signin')
  }

  const handleBackToRequest = () => {
    setStep('request')
    setError('')
    setSuccess('')
  }

  if (step === 'confirm') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header with Logo */}
        <div className="pt-16 pb-8 px-6 text-center">
          <EventheroLogoIcon width={120} height={64} color="#0000FF" />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center px-6 pb-8">
          <div className="w-full max-w-sm mx-auto">
            <Title order={1} className="text-center mb-4 text-2xl font-bold text-gray-900">
              Reset Password
            </Title>
            
            <Text className="text-center mb-8 text-gray-600">
              Enter the code sent to {email} and your new password
            </Text>

            <form onSubmit={handleConfirmReset} className="space-y-6">
              <div>
                <TextInput
                  label="Verification Code"
                  placeholder="Enter 6-digit code"
                  value={confirmationCode}
                  onChange={(e) => { setConfirmationCode(e.target.value); setError(''); setSuccess('') }}
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

              <div>
                <PasswordInput
                  label="New Password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setError(''); setSuccess('') }}
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
                      '&:focus': {
                        borderColor: '#0000FF',
                        boxShadow: '0 0 0 3px rgba(0, 0, 255, 0.1)'
                      }
                    }
                  }}
                  required
                />
                <Text className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters long
                </Text>
              </div>

              <div>
                <PasswordInput
                  label="Confirm New Password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); setSuccess('') }}
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
                      '&:focus': {
                        borderColor: '#0000FF',
                        boxShadow: '0 0 0 3px rgba(0, 0, 255, 0.1)'
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

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <Text className="text-green-600 text-sm text-center">{success}</Text>
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
                    Resetting password...
                  </div>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>

            <div className="mt-8 text-center space-y-2">
              <div>
                <Button 
                  variant="subtle" 
                  onClick={handleBackToRequest}
                  className="text-blue-600 hover:text-blue-700 p-0 h-auto font-medium underline"
                >
                  Back to email entry
                </Button>
              </div>
              <Text className="text-gray-600">
                Remember your password?{' '}
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with Logo */}
      <div className="pt-16 pb-8 px-6 text-center">
        <EventheroLogoIcon width={120} height={64} color="#0000FF" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-8">
        <div className="w-full max-w-sm mx-auto">
          <Title order={1} className="text-center mb-4 text-2xl font-bold text-gray-900">
            Forgot Password?
          </Title>
          
          <Text className="text-center mb-8 text-gray-600">
            Enter your email address and we&apos;ll send you a code to reset your password
          </Text>

          <form onSubmit={handleRequestReset} className="space-y-6">
            <div>
              <TextInput
                label="Email Address"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); setSuccess('') }}
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
                    '&:focus': {
                      borderColor: '#0000FF',
                      boxShadow: '0 0 0 3px rgba(0, 0, 255, 0.1)'
                    }
                  }
                }}
                type="email"
                autoComplete="email"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <Text className="text-red-600 text-sm text-center">{error}</Text>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <Text className="text-green-600 text-sm text-center">{success}</Text>
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
                  Sending code...
                </div>
              ) : (
                'Send Reset Code'
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Text className="text-gray-600">
              Remember your password?{' '}
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
