"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ProjectManager } from "@/components/project-manager"
import { UserManager } from "@/components/user-manager"
import {
  BarChart3,
  Users,
  FolderOpen,
  Settings,
  LogOut,
  Loader2,
  Shield,
  User,
  Activity,
  TrendingUp,
} from "lucide-react"
import { getProjects } from "@/app/actions/project-actions"
import { getUserStats } from "@/app/actions/user-actions"

export default function DashboardPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalClients: 0,
    totalUsers: 0,
  })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    console.log("Dashboard - Auth state:", {
      user: user?.email,
      loading,
      hasUser: !!user,
    })

    if (!loading && !user) {
      console.log("Dashboard - No user found, redirecting to login")
      // Add a small delay before redirecting to allow for cookie reading
      setTimeout(() => {
        if (!user) {
          router.push("/login")
        }
      }, 500)
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Error during logout:", error)
      // Force redirect even if logout fails
      router.push("/")
    }
  }

  const loadStatistics = async () => {
    setLoadingStats(true)
    try {
      // Get projects data
      const projectsResult = await getProjects()
      let totalProjects = 0
      let activeProjects = 0
      let completedProjects = 0

      if (projectsResult.success && projectsResult.data) {
        totalProjects = projectsResult.data.length
        activeProjects = projectsResult.data.filter((p) => p.status === "development" || p.status === "planning").length
        completedProjects = projectsResult.data.filter((p) => p.status === "completed").length
      }

      // Get users data
      const usersResult = await getUserStats()
      let totalClients = 0
      let totalUsers = 0

      if (usersResult.success && usersResult.data) {
        totalClients = usersResult.data.total_clients
        totalUsers = usersResult.data.total_users
      }

      setStats({
        totalProjects,
        activeProjects,
        completedProjects,
        totalClients,
        totalUsers,
      })
    } catch (error) {
      console.error("Error loading statistics:", error)
      // Set default values on error
      setStats({
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        totalClients: 0,
        totalUsers: 0,
      })
    } finally {
      setLoadingStats(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadStatistics()
    }
  }, [user])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500 mx-auto mb-4" />
          <p className="text-gray-400">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  // Show access denied if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 bg-gray-800/50 border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-16 w-16 text-red-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">Acceso Denegado</h3>
            <p className="text-gray-400 text-center mb-6">Necesitas iniciar sesión para acceder al dashboard</p>
            <Button onClick={() => router.push("/login")} className="bg-brand-500 hover:bg-brand-600 text-white">
              Ir al Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isAdmin = user.role === "admin" || user.email === "contacto@revdev.mx"

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-brand-500/20 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-brand-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Dashboard</h1>
                <p className="text-sm text-gray-400">Bienvenido, {user.name || user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAdmin && (
                <div className="flex items-center gap-2 px-3 py-1 bg-brand-500/20 rounded-full">
                  <Shield className="h-4 w-4 text-brand-400" />
                  <span className="text-sm text-brand-400 font-medium">Admin</span>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tabs Navigation */}
          <div className="w-full">
            <TabsList className="w-full h-auto p-1 bg-gray-800/50 border border-gray-700 grid grid-cols-2 gap-1 sm:flex sm:justify-start">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-brand-500 data-[state=active]:text-white flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 px-2 sm:px-4 text-xs sm:text-sm min-h-[60px] sm:min-h-[40px]"
              >
                <BarChart3 className="h-4 w-4 flex-shrink-0" />
                <span>Resumen</span>
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="data-[state=active]:bg-brand-500 data-[state=active]:text-white flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 px-2 sm:px-4 text-xs sm:text-sm min-h-[60px] sm:min-h-[40px]"
              >
                <FolderOpen className="h-4 w-4 flex-shrink-0" />
                <span>Proyectos</span>
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger
                  value="users"
                  className="data-[state=active]:bg-brand-500 data-[state=active]:text-white flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 px-2 sm:px-4 text-xs sm:text-sm min-h-[60px] sm:min-h-[40px]"
                >
                  <Users className="h-4 w-4 flex-shrink-0" />
                  <span>Usuarios</span>
                </TabsTrigger>
              )}
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-brand-500 data-[state=active]:text-white flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 px-2 sm:px-4 text-xs sm:text-sm min-h-[60px] sm:min-h-[40px]"
              >
                <Settings className="h-4 w-4 flex-shrink-0" />
                <span>Configuración</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-200">Proyectos Activos</CardTitle>
                  <FolderOpen className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">
                    {loadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.activeProjects}
                  </div>
                  <p className="text-xs text-gray-400">En desarrollo y planificación</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-200">Clientes</CardTitle>
                  <User className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">
                    {loadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.totalClients}
                  </div>
                  <p className="text-xs text-gray-400">Usuarios registrados</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-200">Total Proyectos</CardTitle>
                  <TrendingUp className="h-4 w-4 text-brand-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-brand-400">
                    {loadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.totalProjects}
                  </div>
                  <p className="text-xs text-gray-400">Proyectos en total</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-200">Completados</CardTitle>
                  <Activity className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-400">
                    {loadingStats ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.completedProjects}
                  </div>
                  <p className="text-xs text-gray-400">Proyectos finalizados</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-200">Actividad Reciente</CardTitle>
                <CardDescription>Últimas acciones en tu cuenta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-gray-700/30 rounded-lg">
                    <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-200">Nuevo proyecto creado: "E-commerce Platform"</p>
                      <p className="text-xs text-gray-400">Hace 2 horas</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-700/30 rounded-lg">
                    <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-200">Cliente actualizado: "TechCorp Solutions"</p>
                      <p className="text-xs text-gray-400">Hace 4 horas</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-700/30 rounded-lg">
                    <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-200">Factura generada: #INV-2024-001</p>
                      <p className="text-xs text-gray-400">Hace 1 día</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <ProjectManager isAdmin={isAdmin} userRole={user.role} />
          </TabsContent>

          {/* Users Tab (Admin only) */}
          {isAdmin && (
            <TabsContent value="users">
              <UserManager isAdmin={isAdmin} />
            </TabsContent>
          )}

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-200">Configuración de Cuenta</CardTitle>
                <CardDescription>Administra tu información personal y preferencias</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-200">Email</label>
                    <p className="text-sm text-gray-400 mt-1">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-200">Rol</label>
                    <p className="text-sm text-gray-400 mt-1">{isAdmin ? "Administrador" : "Cliente"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-200">Último acceso</label>
                    <p className="text-sm text-gray-400 mt-1">
                      {user.last_sign_in_at
                        ? new Date(user.last_sign_in_at).toLocaleDateString("es-MX")
                        : "No disponible"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-200">Cuenta creada</label>
                    <p className="text-sm text-gray-400 mt-1">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString("es-MX") : "No disponible"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-200">Preferencias</CardTitle>
                <CardDescription>Personaliza tu experiencia en la plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-200">Notificaciones por email</p>
                      <p className="text-xs text-gray-400">Recibe actualizaciones sobre tus proyectos</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 bg-transparent">
                      Configurar
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-200">Tema</p>
                      <p className="text-xs text-gray-400">Personaliza la apariencia</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 bg-transparent">
                      Oscuro
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
