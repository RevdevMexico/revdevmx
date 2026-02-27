"use client"

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function isSupabaseConfigured() {
  return !!(supabaseUrl && supabaseAnonKey)
}

export const supabase = isSupabaseConfigured() ? createClient(supabaseUrl!, supabaseAnonKey!) : null

export function createClientClient() {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase is not configured")
    return null
  }
  return createClient(supabaseUrl!, supabaseAnonKey!)
}

export async function getCurrentSession() {
  if (!supabase) {
    console.warn("Supabase client not available")
    return null
  }

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.warn("Error getting session:", error)
      return null
    }

    // Sync session with cookies if available
    if (session && typeof window !== "undefined") {
      try {
        document.cookie = `supabase-access-token=${session.access_token}; path=/; max-age=${session.expires_in || 3600}; SameSite=Lax`
        if (session.refresh_token) {
          document.cookie = `supabase-refresh-token=${session.refresh_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
        }
        document.cookie = `supabase-user=${JSON.stringify({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email,
          role: session.user.user_metadata?.role || "cliente",
        })}; path=/; max-age=${session.expires_in || 3600}; SameSite=Lax`
      } catch (cookieError) {
        console.warn("Could not sync session with cookies:", cookieError)
      }
    }

    return session
  } catch (error) {
    console.warn("Unexpected error getting session:", error)
    return null
  }
}

export async function forceRefreshSession() {
  if (!supabase) {
    console.warn("Supabase client not available")
    return null
  }

  try {
    const { data, error } = await supabase.auth.refreshSession()

    if (error) {
      console.warn("Error refreshing session:", error)
      return null
    }

    return data.session
  } catch (error) {
    console.warn("Unexpected error refreshing session:", error)
    return null
  }
}

export function initializeSessionFromCookies() {
  if (typeof window === "undefined" || !supabase) {
    return null
  }

  try {
    const cookies = document.cookie.split(";").reduce(
      (acc, cookie) => {
        const [key, value] = cookie.trim().split("=")
        acc[key] = value
        return acc
      },
      {} as Record<string, string>,
    )

    const accessToken = cookies["supabase-access-token"]
    const userCookie = cookies["supabase-user"]

    if (accessToken && userCookie) {
      try {
        const user = JSON.parse(decodeURIComponent(userCookie))
        return { accessToken, user }
      } catch (parseError) {
        console.warn("Could not parse user cookie:", parseError)
      }
    }

    return null
  } catch (error) {
    console.warn("Error initializing session from cookies:", error)
    return null
  }
}
