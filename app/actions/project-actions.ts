"use server"

import { createServerClient, isSupabaseConfigured } from "@/lib/supabase-server"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export interface Project {
  id: string
  name: string
  year: number
  description: string
  project_url?: string
  technologies: string[]
  logo_url?: string
  images: string[]
  created_at: string
  updated_at: string
  created_by: string
}

export interface CreateProjectData {
  name: string
  year: number
  description: string
  project_url?: string
  technologies: string[]
  logo_url?: string
  images: string[]
}

export interface UpdateProjectData extends CreateProjectData {
  id: string
}

// Helper function to check if Supabase is available
function checkSupabaseAvailability() {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: "Base de datos no configurada. Algunas funciones pueden no estar disponibles.",
      data: null,
    }
  }
  return null
}

async function getAuthenticatedUser() {
  try {
    console.log("getAuthenticatedUser - Starting authentication check...")

    // Only read from cookies in server actions
    console.log("getAuthenticatedUser - Reading from cookies...")
    const cookieStore = cookies()
    const authUser = cookieStore.get("auth-user")
    const authToken = cookieStore.get("auth-token")

    if (authUser && authToken) {
      try {
        const user = JSON.parse(authUser.value)
        console.log("getAuthenticatedUser - Success from cookies:", {
          id: user.id,
          email: user.email,
          role: user.role,
        })

        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            user_metadata: { role: user.role },
          },
          reason: "Usuario autenticado desde cookies",
        }
      } catch (parseError) {
        console.error("getAuthenticatedUser - Error parsing cookie:", parseError)
      }
    }

    console.log("getAuthenticatedUser - No authentication found in cookies")
    return {
      success: false,
      user: null,
      reason: "No se encontró información de autenticación en cookies",
    }
  } catch (error) {
    console.error("getAuthenticatedUser - Unexpected error:", error)
    return {
      success: false,
      user: null,
      reason: `Error inesperado: ${error instanceof Error ? error.message : "Error desconocido"}`,
    }
  }
}

// Verificar si el usuario es administrador - VERSIÓN SIMPLIFICADA
async function isAdmin(): Promise<{ isAdmin: boolean; user: any | null; reason: string }> {
  try {
    console.log("isAdmin - Checking admin status...")

    // Only read from cookies - no database access
    const cookieStore = cookies()
    const authUser = cookieStore.get("auth-user")

    if (!authUser) {
      return {
        isAdmin: false,
        user: null,
        reason: "No authentication found in cookies",
      }
    }

    try {
      const user = JSON.parse(authUser.value)

      // Simple admin check based on email only
      const isAdminUser = user.email === "contacto@revdev.mx"

      console.log("isAdmin - Verification result:", {
        email: user.email,
        isAdmin: isAdminUser,
      })

      return {
        isAdmin: isAdminUser,
        user,
        reason: isAdminUser
          ? "Usuario autorizado como administrador"
          : `Usuario no autorizado: ${user.email}. Solo contacto@revdev.mx puede ser administrador.`,
      }
    } catch (parseError) {
      return {
        isAdmin: false,
        user: null,
        reason: "Error parsing user data from cookies",
      }
    }
  } catch (error) {
    console.error("isAdmin - Unexpected error:", error)
    return {
      isAdmin: false,
      user: null,
      reason: `Error verificando permisos: ${error instanceof Error ? error.message : "Error desconocido"}`,
    }
  }
}

function createServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase service role configuration")
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Obtener todos los proyectos
export async function getProjects() {
  try {
    // Check if Supabase is configured
    const availabilityCheck = checkSupabaseAvailability()
    if (availabilityCheck) {
      // Return mock data when Supabase is not available
      return {
        success: true,
        message: "Proyectos de demostración (base de datos no configurada)",
        data: [
          {
            id: "demo-1",
            name: "Proyecto Demo 1",
            year: 2024,
            description:
              "Este es un proyecto de demostración para mostrar la funcionalidad del carousel cuando la base de datos no está configurada.",
            project_url: "https://ejemplo.com",
            technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
            logo_url: "/placeholder.svg?height=80&width=200&text=Demo+Logo+1",
            images: ["/placeholder.svg?height=300&width=400&text=Demo+Image+1"],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            created_by: "demo-user",
          },
          {
            id: "demo-2",
            name: "Proyecto Demo 2",
            year: 2023,
            description:
              "Segundo proyecto de demostración con diferentes tecnologías para mostrar la variedad de nuestro trabajo.",
            project_url: "",
            technologies: ["Vue.js", "Firebase", "JavaScript", "Bootstrap"],
            logo_url: "/placeholder.svg?height=80&width=200&text=Demo+Logo+2",
            images: ["/placeholder.svg?height=300&width=400&text=Demo+Image+2"],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            created_by: "demo-user",
          },
        ] as Project[],
      }
    }

    const supabase = createServerClient()
    if (!supabase) {
      throw new Error("Could not create Supabase client")
    }

    console.log("getProjects - Fetching projects...")

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("year", { ascending: false })
      .order("created_at", { ascending: false })

    if (error) {
      console.error("getProjects - Database error:", error)
      return {
        success: false,
        message: `Error al obtener los proyectos: ${error.message}`,
        data: [],
      }
    }

    console.log("getProjects - Success:", data?.length || 0, "projects found")

    return {
      success: true,
      message: "Proyectos obtenidos exitosamente",
      data: data as Project[],
    }
  } catch (error) {
    console.error("getProjects - Unexpected error:", error)
    return {
      success: false,
      message: "Error inesperado al obtener los proyectos",
      data: [],
    }
  }
}

// Crear un nuevo proyecto (método principal)
export async function createProject(projectData: CreateProjectData) {
  try {
    console.log("createProject - Starting with data:", projectData)

    // Check if Supabase is configured
    const availabilityCheck = checkSupabaseAvailability()
    if (availabilityCheck) {
      return availabilityCheck
    }

    // Verificar permisos de administrador
    const adminCheck = await isAdmin()
    console.log("createProject - Admin check result:", adminCheck)

    if (!adminCheck.isAdmin) {
      return {
        success: false,
        message: `No tienes permisos para crear proyectos. ${adminCheck.reason}`,
      }
    }

    const user = adminCheck.user
    if (!user || !user.id) {
      return {
        success: false,
        message: "Usuario no encontrado después de verificación",
      }
    }

    const supabase = createServerClient()

    console.log("createProject - Inserting project for user:", user.id)

    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          ...projectData,
          created_by: user.id,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("createProject - Database error:", error)

      // Mensaje más específico para errores de permisos
      if (error.message.includes("permission denied") || error.message.includes("policy")) {
        return {
          success: false,
          message: `No tienes permisos de administrador para crear proyectos. Solo contacto@revdev.mx puede crear proyectos.`,
        }
      }

      return {
        success: false,
        message: `Error al crear el proyecto: ${error.message}`,
      }
    }

    console.log("createProject - Success:", data)

    return {
      success: true,
      message: "Proyecto creado exitosamente",
      data: data as Project,
    }
  } catch (error) {
    console.error("createProject - Unexpected error:", error)
    return {
      success: false,
      message: `Error inesperado al crear el proyecto: ${error instanceof Error ? error.message : "Error desconocido"}`,
    }
  }
}

// Actualizar un proyecto
export async function updateProject(projectData: UpdateProjectData) {
  try {
    console.log("[v0] updateProject - Starting with ID:", projectData.id)

    // Check if Supabase is configured
    const availabilityCheck = checkSupabaseAvailability()
    if (availabilityCheck) {
      return availabilityCheck
    }

    const cookieStore = cookies()
    const authUser = cookieStore.get("auth-user")

    if (!authUser) {
      return {
        success: false,
        message: "No tienes permisos para actualizar proyectos. Usuario no autenticado.",
      }
    }

    let user
    try {
      user = JSON.parse(authUser.value)
    } catch (parseError) {
      return {
        success: false,
        message: "Error al verificar permisos de usuario.",
      }
    }

    // Simple admin check based on email only - no database queries
    if (user.email !== "contacto@revdev.mx") {
      return {
        success: false,
        message: `No tienes permisos para actualizar proyectos. Solo contacto@revdev.mx puede actualizar proyectos.`,
      }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return {
        success: false,
        message: "Configuración de base de datos no disponible.",
      }
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      db: {
        schema: "public",
      },
    })

    const { id, ...rawUpdateData } = projectData

    const updateData = {
      name: rawUpdateData.name,
      year: rawUpdateData.year,
      description: rawUpdateData.description,
      project_url: rawUpdateData.project_url || null,
      technologies: rawUpdateData.technologies,
      logo_url: rawUpdateData.logo_url || null,
      images: rawUpdateData.images,
      updated_at: new Date().toISOString(),
    }

    console.log("[v0] updateProject - Executing direct update with service role...")

    const { data, error: updateError } = await supabase
      .from("projects")
      .update(updateData)
      .eq("id", id)
      .select("id, name, year, description, project_url, technologies, logo_url, images, created_at, updated_at")

    if (updateError) {
      console.error("updateProject - Database error:", updateError)
      return {
        success: false,
        message: `Error al actualizar el proyecto: ${updateError.message}`,
      }
    }

    if (!data || data.length === 0) {
      return {
        success: false,
        message: "No se encontró el proyecto para actualizar.",
      }
    }

    console.log("[v0] updateProject - Success:", data[0])

    return {
      success: true,
      message: "Proyecto actualizado exitosamente",
      data: data[0] as Project,
    }
  } catch (error) {
    console.error("updateProject - Unexpected error:", error)
    return {
      success: false,
      message: `Error inesperado al actualizar el proyecto: ${error instanceof Error ? error.message : "Error desconocido"}`,
    }
  }
}

// Eliminar un proyecto
export async function deleteProject(projectId: string) {
  try {
    console.log("deleteProject - Starting for project:", projectId)

    // Check if Supabase is configured
    const availabilityCheck = checkSupabaseAvailability()
    if (availabilityCheck) {
      return availabilityCheck
    }

    // Verificar permisos de administrador
    const adminCheck = await isAdmin()
    if (!adminCheck.isAdmin) {
      return {
        success: false,
        message: `No tienes permisos para eliminar proyectos. ${adminCheck.reason}`,
      }
    }

    const supabase = createServerClient()

    console.log("deleteProject - Deleting project:", projectId)

    const { error } = await supabase.from("projects").delete().eq("id", projectId)

    if (error) {
      console.error("deleteProject - Database error:", error)
      return {
        success: false,
        message: `Error al eliminar el proyecto: ${error.message}`,
      }
    }

    console.log("deleteProject - Success")

    return {
      success: true,
      message: "Proyecto eliminado exitosamente",
    }
  } catch (error) {
    console.error("deleteProject - Unexpected error:", error)
    return {
      success: false,
      message: `Error inesperado al eliminar el proyecto: ${error instanceof Error ? error.message : "Error desconocido"}`,
    }
  }
}

// Obtener un proyecto por ID
export async function getProjectById(projectId: string) {
  try {
    console.log("getProjectById - Fetching project:", projectId)

    // Check if Supabase is configured
    const availabilityCheck = checkSupabaseAvailability()
    if (availabilityCheck) {
      return availabilityCheck
    }

    const supabase = createServerClient()

    const { data, error } = await supabase.from("projects").select("*").eq("id", projectId).single()

    if (error) {
      console.error("getProjectById - Database error:", error)
      return {
        success: false,
        message: `Error al obtener el proyecto: ${error.message}`,
        data: null,
      }
    }

    console.log("getProjectById - Success:", data)

    return {
      success: true,
      message: "Proyecto obtenido exitosamente",
      data: data as Project,
    }
  } catch (error) {
    console.error("getProjectById - Unexpected error:", error)
    return {
      success: false,
      message: `Error inesperado al obtener el proyecto: ${error instanceof Error ? error.message : "Error desconocido"}`,
      data: null,
    }
  }
}

// Función de testing para verificar la conexión
export async function testConnection() {
  try {
    console.log("testConnection - Starting...")

    // Check if Supabase is configured
    const availabilityCheck = checkSupabaseAvailability()
    if (availabilityCheck) {
      return availabilityCheck
    }

    const authResult = await getAuthenticatedUser()
    const adminCheck = await isAdmin()
    const supabase = createServerClient()

    // Probar consulta simple
    const { data, error } = await supabase.from("projects").select("count", { count: "exact" })

    // Probar las funciones SQL si están disponibles
    let sqlFunctions = { available: false, results: {} }
    try {
      const { data: isAdminResult, error: adminFunctionError } = await supabase.rpc("is_user_admin")
      const { data: userInfoResult, error: userFunctionError } = await supabase.rpc("get_current_user_info")

      sqlFunctions = {
        available: true,
        results: {
          isAdmin: {
            result: isAdminResult,
            error: adminFunctionError?.message,
          },
          userInfo: {
            result: userInfoResult,
            error: userFunctionError?.message,
          },
        },
      }
    } catch (sqlError) {
      console.log("testConnection - SQL functions not available:", sqlError)
    }

    // Información adicional de debugging
    const debugInfo = {
      authentication: authResult,
      authorization: adminCheck,
      database: {
        projectCount: data?.[0]?.count || 0,
        hasError: !!error,
        errorMessage: error?.message,
      },
      sqlFunctions,
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Present" : "Missing",
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Present" : "Missing",
      },
      timestamp: new Date().toISOString(),
    }

    console.log("testConnection - Debug info:", debugInfo)

    return {
      success: true,
      message: "Test de conexión completado",
      data: debugInfo,
    }
  } catch (error) {
    console.error("testConnection - Error:", error)
    return {
      success: false,
      message: "Error de conexión",
      data: { error: error instanceof Error ? error.message : "Error desconocido" },
    }
  }
}
