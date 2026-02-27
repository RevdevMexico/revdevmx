"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, ExternalLink, Calendar, Keyboard, Smartphone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Project } from "@/app/actions/project-actions"

// Arreglo local de proyectos
const LOCAL_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Lamipint",
    year: 2024,
    description: "Proyecto control de materiales e insumos",
    project_url: "https://lamipint.mx",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Firebase", "Next JS"],
    logo_url: "/logos/lamipint.svg",
    images: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: "admin",
  },
  {
    id: "2",
    name: "Circuito del arte SMA",
    year: 2025,
    description: "Mapa interactivo con las galerías del circuito del arte y comida de San Miguel Allende.",
    project_url: "https://example.com/proyecto2",
    technologies: ["Next.js", "Node.js", "PostgreSQL"],
    logo_url: "/logos/circuitodelarte.png",
    images: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: "admin",
  },
  {
    id: "3",
    name: "Amazona Produce International",
    year: 2026,
    description: "Página web corpporativa",
    project_url: "https://example.com/proyecto3",
    technologies: ["Vue.js", "Vite", "Pinia"],
    logo_url: "/logos/amazona.png",
    images: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: "admin",
  },
  {
      id: "3",
    name: "Amazona Produce International",
    year: 2026,
    description: "Página web corpporativa",
    project_url: "https://amazonainternational.com",
    technologies: ["Next JS", "React"],
    logo_url: "/logos/amazona1.png",
    images: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: "admin", },
    {
    id: "4",
    name: "Ferlon México",
    year: 2020,
    description: "Página web ecommerce",
    project_url: "https://ferlon.com.mx",
    technologies: ["PHP", "MySQL", "Bootstrap"],
    logo_url: "/logos/ferlon.png",
    images: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: "admin",
  },
    {
    id: "5",
    name: "Futuro Sira",
    year: 2020,
    description: "Página web empresarial",
    project_url: "https://futurosira.com",
    technologies: ["PHP", "MySQL", "Bootstrap"],
    logo_url: "/logos/sira.png",
    images: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: "admin",
  },
      {
    id: "6",
    name: "El sabor",
    year: 2020,
    description: "Página web ecommerce",
    project_url: "https://futurosira.com",
    technologies: ["React", "Supabase", "Tailwind"],
    logo_url: "/logos/elsabor.png",
    images: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: "admin",
  },
        {
    id: "7",
    name: "Mystore",
    year: 2020,
    description: "Página web ecommerce",
    project_url: "https://mystore.com",
    technologies: ["Next JS", "Firebase", "React"],
    logo_url: "/logos/mystore.png",
    images: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: "admin",
  },
]

export function ProjectCarousel() {
  const [projects, setProjects] = useState<Project[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Touch handling
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Check if device is mobile
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkDevice()
    window.addEventListener("resize", checkDevice)
    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  // Load projects from local array
  useEffect(() => {
    setProjects(LOCAL_PROJECTS)
    setLoading(false)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        goToPrevious()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        goToNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentIndex, projects.length])

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return

    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      goToNext()
    } else if (isRightSwipe) {
      goToPrevious()
    }

    // Reset touch positions
    touchStartX.current = 0
    touchEndX.current = 0
  }

  const goToNext = () => {
    if (isTransitioning || projects.length === 0) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev + 1) % projects.length)
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const goToPrevious = () => {
    if (isTransitioning || projects.length === 0) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length)
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return
    setIsTransitioning(true)
    setCurrentIndex(index)
    setTimeout(() => setIsTransitioning(false), 300)
  }

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-red-500/10 to-yellow-500/20 rounded-3xl animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-3xl animate-pulse delay-1000"></div>

          <Card className="relative bg-white/10 border-white/20 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center justify-center h-96">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500/30 border-t-orange-500"></div>
                  <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-orange-500/20"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error || projects.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-orange-500/5 to-yellow-500/10 rounded-3xl"></div>

          <Card className="relative bg-white/10 border-white/20 backdrop-blur-xl shadow-2xl rounded-3xl">
            <CardContent className="p-8">
              <div className="text-center h-96 flex items-center justify-center">
                <div className="space-y-4">
                  <p className="text-white/90">{error || "No hay proyectos disponibles"}</p>
                  <Button
                    variant="outline"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                    onClick={() => window.location.reload()}
                  >
                    Reintentar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentProject = projects[currentIndex]

  return (
    <div className="w-full max-w-6xl mx-auto p-6 relative">
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-red-500/10 to-yellow-500/20 animate-pulse"></div>

        <div className="absolute top-10 left-10 w-32 h-32 bg-orange-500/20 rounded-full blur-xl animate-bounce delay-0"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-red-500/20 rounded-full blur-xl animate-bounce delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-500/20 rounded-full blur-xl animate-bounce delay-2000"></div>

        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent animate-pulse delay-500"></div>
      </div>

      <Card
        ref={carouselRef}
        className="relative bg-white/10 border-white/20 backdrop-blur-xl shadow-2xl overflow-hidden rounded-3xl transition-all duration-500 hover:shadow-3xl hover:bg-white/15"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
            <div className="relative bg-gradient-to-br from-black/40 to-gray-900/60 backdrop-blur-sm border-r border-white/10 flex items-center justify-center p-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-red-500/10"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl transform translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-500/20 rounded-full blur-2xl transform -translate-x-12 translate-y-12"></div>

              <div className="relative text-center space-y-6 z-10">
                {(currentProject.logo_url && currentProject.logo_url.trim() !== "") ||
                (currentProject.images && currentProject.images.length > 0) ? (
                  <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto group">
                    <div className="absolute inset-0 bg-orange-500/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="relative w-full h-full group-hover:scale-110 transition-all duration-300">
                      <Image
                        src={
                          currentProject.logo_url && currentProject.logo_url.trim() !== ""
                            ? currentProject.logo_url
                            : currentProject.images?.[0] || "/placeholder.svg"
                        }
                        alt={`${currentProject.name} logo`}
                        fill
                        className="object-contain transition-transform duration-500"
                        onError={(e) => {
                          // Hide the image on error and show fallback
                          e.currentTarget.style.display = "none"
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto group">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/40 to-red-500/40 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                    <div className="relative w-full h-full bg-gradient-to-br from-orange-500/80 to-red-500/80 backdrop-blur-sm rounded-full border border-white/30 flex flex-col items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-2xl">
                      <div className="text-6xl md:text-8xl font-bold text-white drop-shadow-lg mb-2">
                        {currentProject.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-xs md:text-sm text-white/80 font-medium text-center px-4">
                        Logo no disponible
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="text-3xl font-bold text-white drop-shadow-lg">{currentProject.name}</h3>
                  <div className="flex items-center justify-center gap-2 text-white/80">
                    <div className="p-1 bg-white/20 rounded-full backdrop-blur-sm">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{currentProject.year}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border-l border-white/10 p-8 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-orange-500/10 rounded-full blur-xl"></div>

              <div className="relative space-y-6 z-10">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                    Descripción
                  </h4>
                  <p className="text-white/90 leading-relaxed">
                    {currentProject.description ||
                      "Proyecto desarrollado con las mejores prácticas y tecnologías modernas."}
                  </p>
                </div>

                {currentProject.technologies && currentProject.technologies.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-yellow-500 rounded-full"></div>
                      Tecnologías
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {currentProject.technologies.map((tech, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-105"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {currentProject.project_url && (
                  <div>
                    <Link
                      href={currentProject.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm border border-white/20"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Ver Proyecto
                    </Link>
                  </div>
                )}
              </div>

              <div className="relative mt-6 pt-6 border-t border-white/20 z-10">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  {isMobile ? (
                    <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
                      <Smartphone className="w-4 h-4" />
                      <span>Desliza para navegar</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
                      <Keyboard className="w-4 h-4" />
                      <span>Usa las flechas del teclado para navegar</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none">
        <Button
          variant="outline"
          size="icon"
          className="pointer-events-auto bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 rounded-full"
          onClick={goToPrevious}
          disabled={isTransitioning}
          aria-label="Proyecto anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="pointer-events-auto bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 rounded-full"
          onClick={goToNext}
          disabled={isTransitioning}
          aria-label="Siguiente proyecto"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex justify-center mt-8 space-x-3">
        {projects.map((_, index) => (
          <button
            key={index}
            className={`relative transition-all duration-500 ${
              index === currentIndex
                ? "w-8 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg shadow-orange-500/50 scale-110"
                : "w-3 h-3 bg-white/30 hover:bg-white/50 rounded-full hover:scale-110 backdrop-blur-sm border border-white/20"
            }`}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
            aria-label={`Ir al proyecto ${index + 1}`}
          >
            {index === currentIndex && (
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"></div>
            )}
          </button>
        ))}
      </div>

      <div className="text-center mt-6">
        <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
          <span className="text-sm text-white/90 font-medium">
            {currentIndex + 1} de {projects.length} proyectos
          </span>
        </div>
      </div>
    </div>
  )
}
