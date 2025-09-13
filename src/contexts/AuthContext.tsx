import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { signIn, signOut, getCurrentUser } from 'aws-amplify/auth'

type AuthContextType = {
  user: unknown
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const lastActiveRef = useRef<number>(0)
  const INACTIVITY_LIMIT_MS = 15 * 60 * 1000

  useEffect(() => {
    const init = async () => {
      const lastActive = Number(localStorage.getItem('lastActiveAt') || '0')
      const now = Date.now()
      try {
        const currentUser = await getCurrentUser()
        // Require re-auth if away more than 15 minutes
        if (lastActive && now - lastActive > INACTIVITY_LIMIT_MS) {
          setUser(null)
        } else {
          setUser(currentUser)
        }
      } catch (e) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  useEffect(() => {
    const updateActivity = () => {
      lastActiveRef.current = Date.now()
      localStorage.setItem('lastActiveAt', String(lastActiveRef.current))
    }
    const events = ['click', 'keydown', 'mousemove', 'touchstart', 'scroll']
    events.forEach(evt => window.addEventListener(evt, updateActivity, { passive: true }))
    updateActivity()
    return () => {
      events.forEach(evt => window.removeEventListener(evt, updateActivity))
    }
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      setUser(null)
    }
    setLoading(false)
  }

  const handleSignIn = async (email: string, password: string) => {
    try {
      const user = await signIn({ username: email, password })
      setUser(user)
      const now = Date.now()
      lastActiveRef.current = now
      localStorage.setItem('lastActiveAt', String(now))
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
    localStorage.removeItem('lastActiveAt')
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn: handleSignIn, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)