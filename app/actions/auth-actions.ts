"use server"

import { createServerClient, isSupabaseConfigured } from "@/lib/supabase-server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Helper function to check if Supabase is available
function checkSupabaseAvailability() {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: "Autenticación no disponible - base de datos no configurada",
      token: null,
      user: null,
    }
  }
  return null
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  console.log("Server - Sign in attempt for:", email)

  if (!email || !password) {
    return {
      success: false,
      message: "Email y contraseña son requeridos",
    }
  }

  // Check if Supabase is configured
  const availabilityCheck = checkSupabaseAvailability()
  if (availabilityCheck) {
    // Demo credentials
    const demoCredentials = [
      { email: "contacto@revdev.mx", password: "admin123", role: "admin", name: "Administrador RevDev" },
      { email: "cliente@example.com", password: "cliente123", role: "cliente", name: "Cliente Demo" },
    ]

    const demoUser = demoCredentials.find((cred) => cred.email === email && cred.password === password)

    if (demoUser) {
      console.log("Server - Demo login successful for:", email)

      // Set cookies for demo mode
      const cookieStore = cookies()
      const userData = {
        id: `demo-${demoUser.role}`,
        email: demoUser.email,
        name: demoUser.name,
        role: demoUser.role,
      }

      cookieStore.set("auth-user", JSON.stringify(userData), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
      })

      cookieStore.set("auth-token", `demo-token-${demoUser.role}`, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
      })

      // Redirect to dashboard
      redirect("/dashboard")
    } else {
      return {
        success: false,
        message: "Credenciales inválidas. Usa: contacto@revdev.mx / admin123 o cliente@example.com / cliente123",
      }
    }
  }

  const supabase = createServerClient()
  if (!supabase) {
    return {
      success: false,
      message: "Error de configuración del servidor",
    }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Server - Supabase sign in error:", error)
    return {
      success: false,
      message: error.message === "Invalid login credentials" ? "Credenciales inválidas" : "Error al iniciar sesión",
    }
  }

  if (data.user && data.session) {
    console.log("Server - Sign in successful:", {
      userId: data.user.id,
      email: data.user.email,
      hasToken: !!data.session.access_token,
    })

    // Set cookies for real Supabase auth
    try {
      const cookieStore = cookies()
      const userData = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.email,
        role: data.user.user_metadata?.role || "cliente",
      }

      cookieStore.set("auth-user", JSON.stringify(userData), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: data.session.expires_in || 3600,
      })

      cookieStore.set("auth-token", data.session.access_token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: data.session.expires_in || 3600,
      })

      console.log("Server - Cookies set successfully")
    } catch (cookieError) {
      console.warn("Server - Could not set cookies:", cookieError)
    }

    // Redirect to dashboard
    redirect("/dashboard")
  }

  return {
    success: false,
    message: "Error al iniciar sesión",
  }
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  if (!email || !password) {
    return {
      success: false,
      message: "Email y contraseña son requeridos",
    }
  }

  try {
    // Check if Supabase is configured
    const availabilityCheck = checkSupabaseAvailability()
    if (availabilityCheck) {
      return {
        success: true,
        message: "Cuenta creada exitosamente (modo demo). Puedes iniciar sesión con las credenciales de demo.",
      }
    }

    const supabase = createServerClient()
    if (!supabase) {
      throw new Error("Could not create Supabase client")
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email,
          role: "cliente", // Rol por defecto
        },
      },
    })

    if (error) {
      console.error("Supabase sign up error:", error)
      return {
        success: false,
        message:
          error.message === "User already registered" ? "El usuario ya está registrado" : "Error al crear la cuenta",
      }
    }

    // Para signup, el usuario necesita confirmar su email primero
    return {
      success: true,
      message: "Cuenta creada exitosamente. Revisa tu email para confirmar tu cuenta.",
    }
  } catch (error) {
    console.error("Unexpected sign up error:", error)
    return {
      success: false,
      message: "Error inesperado al crear la cuenta",
    }
  }
}

export async function signOut() {
  try {
    console.log("Server - Sign out initiated")

    // Clear cookies
    const cookieStore = cookies()
    cookieStore.delete("auth-user")
    cookieStore.delete("auth-token")

    // Check if Supabase is configured
    const availabilityCheck = checkSupabaseAvailability()
    if (!availabilityCheck) {
      const supabase = createServerClient()
      if (supabase) {
        const { error } = await supabase.auth.signOut()
        if (error) {
          console.error("Supabase sign out error:", error)
        }
      }
    }

    console.log("Server - Sign out successful")
    redirect("/")
  } catch (error) {
    console.error("Unexpected sign out error:", error)
    redirect("/")
  }
}
