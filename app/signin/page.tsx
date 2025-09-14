"use client"
import { useState } from 'react'
import { useAuth } from '../../src/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { TextInput, Button, Title, Text, Loader, PasswordInput } from '@mantine/core'
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
    } catch {
      setError('Invalid email or password')
    }
  }

  const handleSignUp = () => {
    router.push('/signup')
  }

  const handleForgotPassword = () => {
    router.push('/forgot-password')
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Ultra-Compact Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-center">
        <EventheroLogoIcon width={70} height={38} color="#0000FF" />
      </div>

      {/* Main Content - Optimized for mobile viewport */}
      <div className="flex-1 flex items-center justify-center px-4 py-3">
        <div className="w-full max-w-xs bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          {/* Compact Title */}
          <div className="text-center mb-4">
            <Title order={2} className="text-lg font-semibold text-gray-900 mb-1">
              Welcome Back
            </Title>
            <Text className="text-xs text-gray-500">
              Sign in to continue
            </Text>
          </div>

          <form onSubmit={handleSignIn} className="space-y-3">
            {/* Compact Email Input */}
            <div>
              <TextInput
                placeholder="Email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                size="sm"
                className="w-full"
                styles={{
                  input: { 
                    height: 40, 
                    fontSize: '15px', 
                    borderColor: '#E5E7EB', 
                    borderRadius: 8,
                    '&:focus': {
                      borderColor: '#0000FF',
                      boxShadow: '0 0 0 2px rgba(0, 0, 255, 0.1)'
                    }
                  }
                }}
                type="email"
                autoComplete="email"
                required
              />
            </div>

            {/* Compact Password Input */}
            <div>
              <PasswordInput
                placeholder="Password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                size="sm"
                className="w-full"
                styles={{
                  input: { 
                    height: 40, 
                    fontSize: '15px', 
                    borderColor: '#E5E7EB', 
                    borderRadius: 8,
                    '&:focus': {
                      borderColor: '#0000FF',
                      boxShadow: '0 0 0 2px rgba(0, 0, 255, 0.1)'
                    }
                  }
                }}
                required
              />
            </div>

            {/* Forgot Password - Compact */}
            <div className="text-right">
              <Button 
                variant="subtle" 
                size="xs" 
                onClick={handleForgotPassword}
                className="text-blue-600 hover:text-blue-700 p-0 h-auto text-xs"
              >
                Forgot password?
              </Button>
            </div>

            {/* Error Message - Compact */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-2">
                <Text className="text-red-600 text-xs text-center">{error}</Text>
              </div>
            )}

            {/* Compact Sign In Button */}
            <Button
              type="submit"
              size="sm"
              fullWidth
              disabled={loading}
              className="h-9 text-sm font-medium mt-4"
              style={{ 
                backgroundColor: loading ? '#9CA3AF' : '#0000FF',
                borderRadius: 8,
                border: 'none'
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader size="xs" color="white" className="mr-1" />
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Compact Sign Up Link */}
          <div className="mt-4 text-center">
            <Text className="text-xs text-gray-600">
              No account?{' '}
              <Button 
                variant="subtle" 
                onClick={handleSignUp}
                className="text-blue-600 hover:text-blue-700 p-0 h-auto text-xs font-medium"
              >
                Sign up
              </Button>
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}


