"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { isSupabaseConfigured, supabase } from "@/lib/supabase-client"

interface AuthUser {
  id: string
  email: string
  name: string
  role: string
  user_metadata?: {
    name?: string
    role?: string
  }
  created_at?: string
  last_sign_in_at?: string
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Function to get user from cookies
  const getUserFromCookies = (): AuthUser | null => {
    if (typeof window === "undefined") return null

    try {
      const cookies = document.cookie.split(";").reduce(
        (acc, cookie) => {
          const [key, value] = cookie.trim().split("=")
          if (key && value) {
            acc[key] = decodeURIComponent(value)
          }
          return acc
        },
        {} as Record<string, string>,
      )

      const userCookie = cookies["auth-user"]
      const tokenCookie = cookies["auth-token"]

      if (userCookie && tokenCookie) {
        try {
          const userData = JSON.parse(userCookie)
          console.log("AuthProvider - Found user in cookies:", userData.email)
          return userData
        } catch (error) {
          console.warn("AuthProvider - Error parsing user cookie:", error)
        }
      }

      return null
    } catch (error) {
      console.warn("AuthProvider - Error reading cookies:", error)
      return null
    }
  }

  // Function to clear auth state
  const clearAuthState = () => {
    console.log("AuthProvider - Clearing auth state")
    setUser(null)

    // Clear cookies
    if (typeof document !== "undefined") {
      document.cookie = "auth-user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      document.cookie = "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    }
  }

  // Logout function
  const logout = async () => {
    try {
      console.log("AuthProvider - Logout initiated")

      // Sign out from Supabase if configured
      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase.auth.signOut()
        if (error) {
          console.error("AuthProvider - Supabase logout error:", error)
        }
      }

      clearAuthState()

      // Redirect to home
      if (typeof window !== "undefined") {
        window.location.href = "/"
      }
    } catch (error) {
      console.error("AuthProvider - Logout error:", error)
      clearAuthState()
    }
  }

  // Initialize auth state
  useEffect(() => {
    console.log("AuthProvider - Initializing...")

    const initializeAuth = async () => {
      try {
        const cookieUser = getUserFromCookies()
        if (cookieUser) {
          console.log("AuthProvider - User found in cookies immediately:", cookieUser.email)
          setUser(cookieUser)
          setLoading(false)
          return
        }

        await new Promise((resolve) => setTimeout(resolve, 100))

        // Check cookies again after delay
        const delayedCookieUser = getUserFromCookies()
        if (delayedCookieUser) {
          console.log("AuthProvider - User found in cookies after delay:", delayedCookieUser.email)
          setUser(delayedCookieUser)
          setLoading(false)
          return
        }

        // If Supabase is configured, check for session
        if (isSupabaseConfigured() && supabase) {
          console.log("AuthProvider - Checking Supabase session...")

          const {
            data: { session },
            error,
          } = await supabase.auth.getSession()

          if (error) {
            console.error("AuthProvider - Error getting session:", error)
          } else if (session?.user) {
            console.log("AuthProvider - Supabase session found:", session.user.email)
            const authUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || "",
              name: session.user.user_metadata?.name || session.user.email || "",
              role: session.user.user_metadata?.role || "cliente",
              user_metadata: session.user.user_metadata,
              created_at: session.user.created_at,
              last_sign_in_at: session.user.last_sign_in_at,
            }
            setUser(authUser)
          } else {
            console.log("AuthProvider - No Supabase session found")
          }
        } else {
          console.log("AuthProvider - Supabase not configured")
        }
      } catch (error) {
        console.error("AuthProvider - Error initializing auth:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Set up Supabase auth listener if configured
    if (isSupabaseConfigured() && supabase) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("AuthProvider - Auth state change:", event)

        if (event === "SIGNED_IN" && session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.name || session.user.email || "",
            role: session.user.user_metadata?.role || "cliente",
            user_metadata: session.user.user_metadata,
            created_at: session.user.created_at,
            last_sign_in_at: session.user.last_sign_in_at,
          }
          setUser(authUser)
        } else if (event === "SIGNED_OUT") {
          setUser(null)
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    }

    const cookieInterval = setInterval(() => {
      const cookieUser = getUserFromCookies()
      if (cookieUser && (!user || user.id !== cookieUser.id)) {
        console.log("AuthProvider - User updated from cookies")
        setUser(cookieUser)
      } else if (!cookieUser && user) {
        console.log("AuthProvider - User removed from cookies")
        setUser(null)
      }
    }, 500) // Check every 500ms instead of 1000ms

    return () => {
      clearInterval(cookieInterval)
    }
  }, [])

  const value: AuthContextType = {
    user,
    loading,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
