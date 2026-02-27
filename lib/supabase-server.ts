import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Verificar que las variables de entorno existan
const isSupabaseConfiguredVar = supabaseUrl && supabaseAnonKey

// Cliente mejorado para el servidor que puede leer cookies
export const createServerClient = () => {
  if (!isSupabaseConfiguredVar) {
    console.warn("Supabase not configured - server client unavailable")
    return null
  }

  const cookieStore = cookies()

  return createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        "X-Client-Info": "revdev-solutions-server",
      },
    },
    // Configurar para que use las cookies del servidor
    cookies: {
      get(name: string) {
        try {
          const cookie = cookieStore.get(name)
          console.log(`Server - Getting cookie ${name}:`, cookie?.value ? "Present" : "Missing")
          return cookie?.value
        } catch (error) {
          console.warn(`Could not get cookie ${name}:`, error)
          return undefined
        }
      },
      set(name: string, value: string, options: any) {
        try {
          console.log(`Server - Setting cookie ${name}`)
          cookieStore.set(name, value, options)
        } catch (error) {
          console.warn(`Could not set cookie ${name}:`, error)
        }
      },
      remove(name: string, options: any) {
        try {
          console.log(`Server - Removing cookie ${name}`)
          cookieStore.set(name, "", { ...options, maxAge: 0 })
        } catch (error) {
          console.warn(`Could not remove cookie ${name}:`, error)
        }
      },
    },
  })
}

// Cliente alternativo que acepta un token directamente
export const createServerClientWithToken = (token: string) => {
  if (!isSupabaseConfiguredVar) {
    console.warn("Supabase not configured - server client with token unavailable")
    return null
  }

  return createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        "X-Client-Info": "revdev-solutions-server-token",
        Authorization: `Bearer ${token}`,
      },
    },
  })
}

// Función helper para verificar si Supabase está configurado
export const isSupabaseConfigured = () => {
  return isSupabaseConfiguredVar
}

// Función para obtener la sesión del servidor usando cookies
export const getServerSession = async () => {
  try {
    const supabase = createServerClient()
    if (!supabase) {
      console.warn("Server - Supabase not configured")
      return null
    }

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.warn("Server - Error getting session:", error)
      return null
    }

    if (session && session.user) {
      // Verificar que la sesión no haya expirado
      const now = Math.floor(Date.now() / 1000)
      if (session.expires_at && session.expires_at > now) {
        console.log("Server - Valid session found:", {
          userId: session.user.id,
          email: session.user.email,
          expiresAt: new Date(session.expires_at * 1000),
        })
        return session
      } else {
        console.log("Server - Session expired")
        return null
      }
    }

    console.log("Server - No session found")
    return null
  } catch (error) {
    console.warn("Server - Unexpected error getting session:", error)
    return null
  }
}
