"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getAllUsers, updateUserRole, deleteUser, getUserStats } from "@/app/actions/user-actions"
import { Users, Edit, Trash2, Shield, User, Crown, Loader2, AlertTriangle } from "lucide-react"

interface UserManagerProps {
  isAdmin: boolean
}

export function UserManager({ isAdmin }: UserManagerProps) {
  const [users, setUsers] = useState<any[]>([])
  const [stats, setStats] = useState({ total_users: 0, total_clients: 0, total_admins: 0 })
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [newRole, setNewRole] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    if (isAdmin) {
      loadUsers()
      loadStats()
    }
  }, [isAdmin])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const result = await getAllUsers()
      if (result.success && result.data) {
        setUsers(result.data)
      } else {
        console.error("Error loading users:", result.message)
        setMessage({ type: "error", text: result.message || "Error al cargar usuarios" })
      }
    } catch (error) {
      console.error("Error loading users:", error)
      setMessage({ type: "error", text: "Error inesperado al cargar usuarios" })
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const result = await getUserStats()
      if (result.success && result.data) {
        setStats(result.data)
      }
    } catch (error) {
      console.error("Error loading user stats:", error)
    }
  }

  const handleUpdateRole = async () => {
    if (!editingUser || !newRole) return

    setSubmitting(true)
    setMessage(null)

    try {
      const result = await updateUserRole(editingUser.id, newRole)
      if (result.success) {
        setMessage({ type: "success", text: "Rol actualizado exitosamente" })
        setDialogOpen(false)
        setEditingUser(null)
        setNewRole("")
        loadUsers()
        loadStats()
      } else {
        setMessage({ type: "error", text: result.message || "Error al actualizar el rol" })
      }
    } catch (error) {
      console.error("Error updating user role:", error)
      setMessage({ type: "error", text: "Error inesperado al actualizar el rol" })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar al usuario ${userEmail}?`)) {
      return
    }

    try {
      const result = await deleteUser(userId)
      if (result.success) {
        setMessage({ type: "success", text: "Usuario eliminado exitosamente" })
        loadUsers()
        loadStats()
      } else {
        setMessage({ type: "error", text: result.message || "Error al eliminar el usuario" })
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      setMessage({ type: "error", text: "Error inesperado al eliminar el usuario" })
    }
  }

  const openEditDialog = (user: any) => {
    setEditingUser(user)
    setNewRole(user.role || "cliente")
    setDialogOpen(true)
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4 text-yellow-400" />
      case "cliente":
        return <User className="h-4 w-4 text-blue-400" />
      default:
        return <Shield className="h-4 w-4 text-gray-400" />
    }
  }

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { label: "Administrador", className: "bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30" },
      cliente: { label: "Cliente", className: "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30" },
    }
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.cliente
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!isAdmin) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertTriangle className="h-16 w-16 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">Acceso Denegado</h3>
          <p className="text-gray-400 text-center">Solo los administradores pueden acceder a la gestión de usuarios</p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500 mx-auto mb-4" />
          <p className="text-gray-400">Cargando usuarios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base text-gray-200 flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-400" />
              Total Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-blue-400">{stats.total_users}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base text-gray-200 flex items-center gap-2">
              <User className="h-4 w-4 text-green-400" />
              Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-green-400">{stats.total_clients}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base text-gray-200 flex items-center gap-2">
              <Crown className="h-4 w-4 text-yellow-400" />
              Administradores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-yellow-400">{stats.total_admins}</div>
          </CardContent>
        </Card>
      </div>

      {/* Message Display */}
      {message && (
        <Alert
          className={message.type === "success" ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"}
        >
          <AlertDescription className={message.type === "success" ? "text-green-400" : "text-red-400"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Users Table */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-200 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Usuarios Registrados
          </CardTitle>
          <CardDescription>Gestiona los usuarios de la plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">No hay usuarios</h3>
              <p className="text-gray-400">Aún no hay usuarios registrados en la plataforma</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Usuario</TableHead>
                    <TableHead className="text-gray-300 hidden md:table-cell">Rol</TableHead>
                    <TableHead className="text-gray-300 hidden lg:table-cell">Registro</TableHead>
                    <TableHead className="text-gray-300">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="border-gray-700">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-brand-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-brand-400">
                              {user.email?.charAt(0).toUpperCase() || "U"}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-200 truncate">{user.name || user.email}</p>
                            <p className="text-xs text-gray-400 truncate md:hidden">
                              {getRoleIcon(user.role)} {user.role === "admin" ? "Admin" : "Cliente"}
                            </p>
                            {user.email !== (user.name || user.email) && (
                              <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          {getRoleBadge(user.role)}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-sm text-gray-400">{formatDate(user.created_at)}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(user)}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id, user.email)}
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Role Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription className="text-gray-400">
              Modifica el rol del usuario {editingUser?.email}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Rol del Usuario</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="cliente">Cliente</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button
                onClick={handleUpdateRole}
                disabled={submitting || newRole === editingUser?.role}
                className="bg-brand-500 hover:bg-brand-600 text-white flex-1"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  "Actualizar Rol"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
