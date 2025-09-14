import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { signIn, signOut, getCurrentUser } from 'aws-amplify/auth'

type AuthContextType = {
  user: unknown
  loading: boolean
  signIn: (email: string, password: string) => Promise<unknown>
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
        // Check if user is already authenticated
        const currentUser = await getCurrentUser()
        // Require re-auth if away more than 15 minutes
        if (lastActive && now - lastActive > INACTIVITY_LIMIT_MS) {
          // Sign out the user if inactive too long
          await signOut()
          setUser(null)
        } else {
          setUser(currentUser)
        }
      } catch {
        // If getCurrentUser fails, user is not authenticated
        console.log('No authenticated user found')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    
    // Only initialize if not already loading
    if (loading) {
      init()
    }
  }, [INACTIVITY_LIMIT_MS, loading])

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

  // const checkUser = async () => {
  //   try {
  //     const currentUser = await getCurrentUser()
  //     setUser(currentUser)
  //   } catch {
  //     setUser(null)
  //   }
  //   setLoading(false)
  // }

  const handleSignIn = async (email: string, password: string) => {
    try {
      // Check if user is already authenticated
      if (user) {
        console.log('User already authenticated')
        return user
      }
      
      // Check if already signed in via AWS Amplify
      try {
        const currentUser = await getCurrentUser()
        if (currentUser) {
          console.log('User already signed in via AWS Amplify')
          setUser(currentUser)
          return currentUser
        }
      } catch {
        // User not authenticated, proceed with sign in
      }
      
      const signedInUser = await signIn({ username: email, password })
      setUser(signedInUser)
      const now = Date.now()
      lastActiveRef.current = now
      localStorage.setItem('lastActiveAt', String(now))
      return signedInUser
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