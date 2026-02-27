"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TechnologySelector } from "@/components/technology-selector"
import { MultipleImageUploader } from "@/components/multiple-image-uploader"
import { getProjects, createProject, updateProject, deleteProject } from "@/app/actions/project-actions"
import { Plus, Edit, Trash2, ExternalLink, Calendar, Code, Globe, FolderKanban, Loader2 } from "lucide-react"
import Image from "next/image"

interface ProjectManagerProps {
  isAdmin: boolean
  userRole: string
}

export function ProjectManager({ isAdmin, userRole }: ProjectManagerProps) {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    technologies: [] as string[],
    project_url: "",
    github_url: "",
    status: "planning",
    images: [] as string[],
  })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    setLoading(true)
    try {
      const result = await getProjects()
      if (result.success && result.data) {
        setProjects(result.data)
      } else {
        console.error("Error loading projects:", result.message)
        setMessage({ type: "error", text: result.message || "Error al cargar proyectos" })
      }
    } catch (error) {
      console.error("Error loading projects:", error)
      setMessage({ type: "error", text: "Error inesperado al cargar proyectos" })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)

    try {
      const projectData = {
        ...formData,
        technologies: formData.technologies.length > 0 ? formData.technologies : null,
        images: formData.images.length > 0 ? formData.images : null,
      }

      let result
      if (editingProject) {
        result = await updateProject({
          id: editingProject.id,
          ...projectData,
        })
      } else {
        result = await createProject(projectData)
      }

      if (result.success) {
        setMessage({
          type: "success",
          text: editingProject ? "Proyecto actualizado exitosamente" : "Proyecto creado exitosamente",
        })
        setDialogOpen(false)
        resetForm()
        loadProjects()
      } else {
        setMessage({ type: "error", text: result.message || "Error al guardar el proyecto" })
      }
    } catch (error) {
      console.error("Error submitting project:", error)
      setMessage({ type: "error", text: "Error inesperado al guardar el proyecto" })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (project: any) => {
    setEditingProject(project)
    setFormData({
      name: project.name || "",
      description: project.description || "",
      technologies: project.technologies || [],
      project_url: project.project_url || "",
      github_url: project.github_url || "",
      status: project.status || "planning",
      images: project.images || [],
    })
    setDialogOpen(true)
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este proyecto?")) {
      return
    }

    try {
      const result = await deleteProject(projectId)
      if (result.success) {
        setMessage({ type: "success", text: "Proyecto eliminado exitosamente" })
        loadProjects()
      } else {
        setMessage({ type: "error", text: result.message || "Error al eliminar el proyecto" })
      }
    } catch (error) {
      console.error("Error deleting project:", error)
      setMessage({ type: "error", text: "Error inesperado al eliminar el proyecto" })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      technologies: [],
      project_url: "",
      github_url: "",
      status: "planning",
      images: [],
    })
    setEditingProject(null)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    resetForm()
    setMessage(null)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      planning: { label: "Planificación", className: "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30" },
      development: { label: "En desarrollo", className: "bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30" },
      completed: { label: "Completado", className: "bg-green-500/20 text-green-300 hover:bg-green-500/30" },
      paused: { label: "Pausado", className: "bg-gray-500/20 text-gray-300 hover:bg-gray-500/30" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.planning
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500 mx-auto mb-4" />
          <p className="text-gray-400">Cargando proyectos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-200 flex items-center gap-2">
            <FolderKanban className="h-6 w-6" />
            Gestión de Proyectos
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {projects.length} proyecto{projects.length !== 1 ? "s" : ""} en total
          </p>
        </div>
        {isAdmin && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-brand-500 hover:bg-brand-600 text-white w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Proyecto
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProject ? "Editar Proyecto" : "Crear Nuevo Proyecto"}</DialogTitle>
                <DialogDescription className="text-gray-400">
                  {editingProject ? "Modifica los detalles del proyecto" : "Completa la información del nuevo proyecto"}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Proyecto *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Estado</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="planning">Planificación</SelectItem>
                        <SelectItem value="development">En desarrollo</SelectItem>
                        <SelectItem value="completed">Completado</SelectItem>
                        <SelectItem value="paused">Pausado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                    placeholder="Describe el proyecto..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tecnologías</Label>
                  <TechnologySelector
                    selectedTechnologies={formData.technologies}
                    onTechnologiesChange={(technologies) => setFormData({ ...formData, technologies })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project_url">URL del Proyecto</Label>
                    <Input
                      id="project_url"
                      type="url"
                      value={formData.project_url}
                      onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github_url">URL de GitHub</Label>
                    <Input
                      id="github_url"
                      type="url"
                      value={formData.github_url}
                      onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Imágenes del Proyecto</Label>
                  <MultipleImageUploader
                    label="Imágenes del Proyecto"
                    value={formData.images || []}
                    onChange={(images) => {
                      console.log("[v0] MultipleImageUploader onChange called with:", images)
                      setFormData((prev) => ({ ...prev, images: images || [] }))
                    }}
                    maxImages={5}
                    disabled={submitting}
                  />
                </div>

                {message && (
                  <Alert
                    className={
                      message.type === "success" ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"
                    }
                  >
                    <AlertDescription className={message.type === "success" ? "text-green-400" : "text-red-400"}>
                      {message.text}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-brand-500 hover:bg-brand-600 text-white flex-1"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {editingProject ? "Actualizando..." : "Creando..."}
                      </>
                    ) : editingProject ? (
                      "Actualizar Proyecto"
                    ) : (
                      "Crear Proyecto"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDialogClose}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 flex-1 bg-transparent"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
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

      {/* Projects Grid - Optimizado para móvil */}
      {projects.length === 0 ? (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderKanban className="h-16 w-16 text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No hay proyectos</h3>
            <p className="text-gray-400 text-center mb-6">
              {isAdmin ? "Crea tu primer proyecto para comenzar" : "Aún no hay proyectos disponibles"}
            </p>
            {isAdmin && (
              <Button onClick={() => setDialogOpen(true)} className="bg-brand-500 hover:bg-brand-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Proyecto
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg text-gray-200 truncate">{project.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(project.status)}
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(project.created_at)}
                      </span>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(project)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Imagen principal */}
                {project.images && project.images.length > 0 && (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-700">
                    <Image
                      src={project.images[0] || "/placeholder.svg"}
                      alt={project.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}

                {/* Descripción */}
                {project.description && (
                  <CardDescription className="text-gray-400 text-sm line-clamp-3">
                    {project.description}
                  </CardDescription>
                )}

                {/* Tecnologías */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Code className="h-3 w-3" />
                      <span>Tecnologías:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech: string) => (
                        <Badge
                          key={tech}
                          variant="outline"
                          className="text-xs bg-gray-700/50 text-gray-300 border-gray-600"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs bg-gray-700/50 text-gray-400 border-gray-600">
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Enlaces */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  {project.project_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 flex-1 bg-transparent"
                    >
                      <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-3 w-3 mr-2" />
                        <span className="truncate">Ver Proyecto</span>
                      </a>
                    </Button>
                  )}
                  {project.github_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 flex-1 bg-transparent"
                    >
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-2" />
                        <span className="truncate">GitHub</span>
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
