"use client"

import { useState, useEffect, useRef, memo, lazy, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Code2,
  Database,
  Globe,
  MapPin,
  Smartphone,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  Navigation,
  Instagram,
  Facebook,
  Server,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { OptimizedVideo } from "@/components/optimized-video"
import { ProjectCarousel } from "@/components/project-carousel"
import { MobileMenu } from "@/components/mobile-menu"
import { ContactForm } from "@/components/contact-form"
import { XIcon } from "@/components/icons"
import { useAuth } from "@/components/auth-provider"
import { getProjects, type Project } from "@/app/actions/project-actions"

// Lazy load heavy components
const Chatbot = lazy(() => import("@/components/chatbot").then((module) => ({ default: module.Chatbot })))

// Background Effects Component
const BackgroundEffects = memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Animated background circles */}
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl animate-pulse"></div>
    <div
      className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
      style={{ animationDelay: "1s" }}
    ></div>
    <div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl animate-pulse"
      style={{ animationDelay: "2s" }}
    ></div>

    {/* Grid pattern */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
  </div>
))

BackgroundEffects.displayName = "BackgroundEffects"

// Memoized components
const HeroSection = memo(() => (
  <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden min-h-screen md:min-h-0">
    <div className="absolute inset-0 z-0 w-full h-full">
      <OptimizedVideo
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Developer_working_01-JMSX8yg9lXlAilFPtGMUQOuDeFC02z.mp4"
        className="w-full h-full object-cover min-h-full"
        style={{ filter: "brightness(0.3)" }}
        poster="/placeholder.svg?height=600&width=1200&text=Hero+Video+Poster"
      />
      <div className="absolute inset-0 bg-black/30 dark:bg-black/50"></div>
    </div>

    <div className="container px-4 md:px-6 relative z-10 min-h-screen md:min-h-0 flex items-center">
      <div className="flex flex-col justify-center space-y-8 max-w-4xl mx-auto text-center">
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-2 text-brand-400 mb-4">
            <MapPin className="h-5 w-5" />
            <span className="text-base font-medium">Guadalajara, Jalisco</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white mb-6">
            Desarrollo Web Profesional
          </h1>
          <p className="max-w-[900px] text-gray-200 md:text-xl mx-auto leading-relaxed">
            Transformamos ideas en soluciones digitales innovadoras. Especializados en desarrollo web moderno con React,
            Next.js y las mejores tecnologías del mercado. Creamos experiencias digitales que impulsan el crecimiento de
            tu negocio.
          </p>
        </div>
        <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center pt-4">
          <Button
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/20"
            onClick={() => document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })}
          >
            Solicitar Cotización
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-gray-900 bg-transparent backdrop-blur-sm transition-all duration-200"
            onClick={() => document.getElementById("proyectos")?.scrollIntoView({ behavior: "smooth" })}
          >
            Ver Proyectos
          </Button>
        </div>
        <div className="flex items-center justify-center gap-6 pt-6">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-base text-gray-200 font-medium">+50 proyectos exitosos</span>
        </div>
      </div>
    </div>
  </section>
))

HeroSection.displayName = "HeroSection"

const AboutSection = memo(() => {
  const [visibleItems, setVisibleItems] = useState<boolean[]>([false, false, false, false])
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers = itemRefs.current.map((ref, index) => {
      if (!ref) return null

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleItems((prev) => {
                const newState = [...prev]
                newState[index] = true
                return newState
              })
            }
          })
        },
        {
          threshold: 0.3,
          rootMargin: "0px 0px -50px 0px",
        },
      )

      observer.observe(ref)
      return observer
    })

    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
  }, [])

  return (
    <section
      id="nosotros"
      className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden"
    >
      <BackgroundEffects />
      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex items-center justify-center">
            <div className="relative rounded-xl overflow-hidden shadow-xl">
              <Image
                alt="Desarrolladora trabajando en la noche en un proyecto web"
                className="aspect-video object-cover rounded-xl"
                height="400"
                src="/images/young-developer.png"
                width="600"
                loading="lazy"
              />
              <div className="absolute inset-0 rounded-xl shadow-[inset_0_0_20px_rgba(254,99,7,0.3)] dark:shadow-[inset_0_0_20px_rgba(254,99,7,0.2)]"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/10 to-transparent opacity-60 rounded-xl"></div>
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <Badge variant="secondary" className="bg-gray-800 text-gray-200 border-gray-700">
                Sobre Nosotros
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">Expertos en Desarrollo Web</h2>
              <p className="text-gray-300 md:text-lg">
                Somos un equipo especializado en desarrollo web con más de 10 años de experiencia. Creamos soluciones
                digitales innovadoras para empresas en Guadalajara y toda la región.
              </p>
            </div>
            <div className="space-y-3">
              {[
                "+10 años de experiencia",
                "Especialistas en React y tecnologías modernas",
                "Soporte local en Guadalajara",
                "Proyectos entregados a tiempo",
              ].map((text, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    itemRefs.current[index] = el
                  }}
                  className={`flex items-center gap-2 transition-all duration-700 ease-out ${
                    visibleItems[index] ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
                  }`}
                  style={{
                    transitionDelay: visibleItems[index] ? `${index * 150}ms` : "0ms",
                  }}
                >
                  <div
                    className={`transition-all duration-500 ${
                      visibleItems[index] ? "scale-100 rotate-0" : "scale-0 rotate-45"
                    }`}
                    style={{
                      transitionDelay: visibleItems[index] ? `${index * 150 + 200}ms` : "0ms",
                    }}
                  >
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-gray-300">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

AboutSection.displayName = "AboutSection"

const ServicesSection = memo(() => (
  <section id="servicios" className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
    <div className="absolute inset-0 z-0 w-full h-full">
      <OptimizedVideo
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Hyper_realistc_mandala_202507161707_jkwk8-vcvIsRNHbjdWIuzC7K6fQK6RwSovG0.mp4"
        className="w-full h-full object-cover"
        style={{ filter: "brightness(0.4)" }}
        poster="/placeholder.svg?height=600&width=1200&text=Services+Video+Poster"
      />
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
    </div>

    <div className="absolute inset-0 z-[1] pointer-events-none">
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-brand-400/20 to-brand-600/20 rounded-full blur-xl animate-pulse"></div>
      <div
        className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-orange-400/15 to-red-500/15 rounded-full blur-lg animate-bounce"
        style={{ animationDuration: "3s" }}
      ></div>
      <div
        className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-yellow-400/10 to-brand-500/10 rounded-full blur-2xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-red-400/15 to-orange-500/15 rounded-full blur-xl animate-bounce"
        style={{ animationDuration: "4s", animationDelay: "2s" }}
      ></div>
    </div>

    <div className="container px-4 md:px-6 relative z-10">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <Badge variant="secondary" className="mb-4 bg-white/20 backdrop-blur-xl text-white border-white/30 shadow-lg">
            Nuestros Servicios
          </Badge>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-2xl">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white drop-shadow-lg">
              Tecnologías que dominamos
            </h2>
            <p className="max-w-[900px] text-gray-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
              Utilizamos las mejores tecnologías del mercado para crear soluciones robustas y escalables
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-3xl items-center gap-6 py-12">
        <div className="flex flex-col justify-center space-y-4">
          <div className="grid gap-6">
            <Card className="bg-white/15 backdrop-blur-xl border-white/30 text-white shadow-2xl hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-brand-500/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-brand-400/20 backdrop-blur-sm rounded-lg border border-brand-400/30">
                    <Code2 className="h-6 w-6 text-brand-400" />
                  </div>
                  <CardTitle className="text-white">Frontend Development</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-200">
                  Desarrollo frontend moderno y responsivo con React, el framework más popular del mercado.
                </CardDescription>
                <div className="flex flex-wrap gap-2 mt-3">
                  {["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS"].map((tech) => (
                    <Badge key={tech} variant="outline" className="border-brand-300 text-brand-300 bg-brand-500/20">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/15 backdrop-blur-xl border-white/30 text-white shadow-2xl hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-green-500/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-400/20 backdrop-blur-sm rounded-lg border border-green-400/30">
                    <Server className="h-6 w-6 text-green-400" />
                  </div>
                  <CardTitle className="text-white">Backend Development</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-200">
                  APIs robustas y escalables con Node.js, bases de datos optimizadas y arquitectura en la nube.
                </CardDescription>
                <div className="flex flex-wrap gap-2 mt-3">
                  {["Node.js", "Firebase", "PostgreSQL", "MongoDB", "Supabase", "Express"].map((tech) => (
                    <Badge key={tech} variant="outline" className="border-green-300 text-green-300 bg-green-500/20">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/15 backdrop-blur-xl border-white/30 text-white shadow-2xl hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-yellow-500/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-yellow-400/20 backdrop-blur-sm rounded-lg border border-yellow-400/30">
                    <Smartphone className="h-6 w-6 text-yellow-400" />
                  </div>
                  <CardTitle className="text-white">Mobile Development</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-200">
                  Aplicaciones móviles nativas y multiplataforma con React Native y tecnologías híbridas.
                </CardDescription>
                <div className="flex flex-wrap gap-2 mt-3">
                  {["React Native", "Flutter", "Ionic"].map((tech) => (
                    <Badge key={tech} variant="outline" className="border-yellow-300 text-yellow-300 bg-yellow-500/20">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </section>
))

ServicesSection.displayName = "ServicesSection"

export default function Component() {
  const [projects, setProjects] = useState<Project[]>([])
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [isLogoVisible, setIsLogoVisible] = useState(false)
  const [isFooterVisible, setIsFooterVisible] = useState(false)
  const footerRef = useRef<HTMLElement>(null)

  // Cargar proyectos reales de la base de datos
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setProjectsLoading(true)
        const result = await getProjects()
        if (result.success) {
          setProjects(result.data)
        } else {
          console.error("Error loading projects:", result.message)
        }
      } catch (error) {
        console.error("Error loading projects:", error)
      } finally {
        setProjectsLoading(false)
      }
    }

    loadProjects()
  }, [])

  // Optimized effects
  useEffect(() => {
    const timer = setTimeout(() => setIsLogoVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsFooterVisible(true)
          }
        })
      },
      { threshold: 0.3, rootMargin: "0px 0px -50px 0px" },
    )

    if (footerRef.current) {
      observer.observe(footerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const { user } = useAuth()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 border-b glass-header sticky top-0 z-50">
        <div className="h-16 flex items-center">
          <Link className="flex items-center justify-center" href="#">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400/30 to-red-400/30 blur-md animate-pulse"></div>
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-400/20 to-orange-400/20 blur-lg animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
              <Image
                src="/logo.png"
                alt="RevDev Solutions México"
                width={40}
                height={40}
                className={`rounded-full transition-all duration-700 ease-out relative z-10 ${
                  isLogoVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
                }`}
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="ml-auto hidden md:flex gap-4 sm:gap-6 items-center">
            {[
              { href: "#servicios", label: "Servicios" },
              { href: "#nosotros", label: "Nosotros" },
              { href: "#proyectos", label: "Proyectos" },
              { href: "#ubicacion", label: "Ubicación" },
              { href: "#contacto", label: "Contacto" },
            ].map((item) => (
              <Link
                key={item.href}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
            <ThemeToggle />
            {user ? (
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-300 hover:text-white bg-transparent border-gray-600 hover:border-gray-400"
                >
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-300 hover:text-white bg-transparent border-gray-600 hover:border-gray-400"
                >
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="ml-auto flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <MobileMenu />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ServicesSection />

        {/* Web Apps Benefits Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-gray-800 via-gray-950 to-gray-800 relative overflow-hidden">
          <BackgroundEffects />
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary" className="bg-gray-700 text-gray-200 border-gray-600">
                  Beneficios para tu Empresa
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                  ¿Por qué tu empresa necesita una web app?
                </h2>
                <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Las aplicaciones web modernas transforman la manera en que las empresas operan, mejorando la
                  eficiencia y reduciendo costos.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-6">
                <Card className="border-l-4 border-l-brand-500 bg-gray-700/50 border-gray-600">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-brand-100 dark:bg-brand-900/20 rounded-lg">
                        <Globe className="h-6 w-6 text-brand-500" />
                      </div>
                      <CardTitle className="text-xl text-white">Acceso Universal</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed text-gray-300">
                      Tus empleados y clientes pueden acceder desde cualquier dispositivo con internet. No necesitan
                      instalar software adicional, solo un navegador web.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 bg-gray-700/50 border-gray-600">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <Database className="h-6 w-6 text-green-600" />
                      </div>
                      <CardTitle className="text-xl text-white">Datos Centralizados</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed text-gray-300">
                      Toda la información de tu empresa en un solo lugar. Actualizaciones en tiempo real y
                      sincronización automática entre todos los usuarios.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 bg-gray-700/50 border-gray-600">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                      <CardTitle className="text-xl text-white">Colaboración Mejorada</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed text-gray-300">
                      Facilita el trabajo en equipo con herramientas colaborativas integradas. Múltiples usuarios pueden
                      trabajar simultáneamente en los mismos proyectos.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border-l-4 border-l-blue-500 bg-gray-700/50 border-gray-600">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl text-white">Reducción de Costos</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed text-gray-300">
                      Elimina la necesidad de software costoso en cada computadora. Reduce gastos de mantenimiento y
                      actualizaciones de sistemas.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-500 bg-gray-700/50 border-gray-600">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                        <ArrowRight className="h-6 w-6 text-yellow-600" />
                      </div>
                      <CardTitle className="text-xl text-white">Escalabilidad</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed text-gray-300">
                      Crece junto con tu empresa. Añade nuevos usuarios y funcionalidades sin complicaciones técnicas o
                      inversiones adicionales en infraestructura.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500 bg-gray-700/50 border-gray-600">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                        <Smartphone className="h-6 w-6 text-red-600" />
                      </div>
                      <CardTitle className="text-xl text-white">Movilidad Total</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed text-gray-300">
                      Trabaja desde cualquier lugar: oficina, casa o en movimiento. Perfecta adaptación a móviles y
                      tablets para máxima flexibilidad.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-6 text-center pt-16 pb-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white">¿Listo para modernizar tu empresa?</h3>
                <p className="max-w-[600px] text-gray-300">
                  Descubre cómo una aplicación web personalizada puede transformar tus procesos empresariales
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/20"
                >
                  Solicitar Consulta Gratuita
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section
          id="proyectos"
          className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden"
        >
          <BackgroundEffects />
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
              <div className="space-y-4">
                <Badge variant="secondary" className="mb-4 bg-gray-800 text-gray-200 border-gray-700">
                  Nuestros Proyectos
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">Casos de éxito</h2>
                <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Conoce algunos de los proyectos que hemos realizado para nuestros clientes
                </p>
              </div>
            </div>

            <div className="py-8 md:py-12">
              {/* Mostrar proyectos reales o estado de carga */}
              {projectsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-4"></div>
                  <p className="text-gray-300">Cargando proyectos...</p>
                </div>
              ) : projects.length > 0 ? (
                <ProjectCarousel />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-300 mb-4">No hay proyectos disponibles en este momento.</p>
                  <p className="text-sm text-gray-400">
                    Los proyectos se mostrarán aquí una vez que sean agregados desde el dashboard.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center justify-center space-y-6 text-center pt-12 mt-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white">¿Tienes un proyecto en mente?</h3>
                <p className="max-w-[600px] text-gray-300">
                  Únete a nuestros clientes satisfechos y lleva tu negocio al siguiente nivel
                </p>
              </div>
              <div className="flex flex-col gap-4 min-[400px]:flex-row pt-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/20"
                >
                  Iniciar Mi Proyecto
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white bg-transparent"
                >
                  Ver Más Proyectos
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-gray-800 via-gray-950 to-gray-800 relative overflow-hidden">
          <BackgroundEffects />
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">¿Por qué elegirnos?</h2>
                <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Somos expertos en desarrollo web con presencia local en Guadalajara
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-2 xl:grid-cols-4 lg:gap-8">
              <Card className="text-center bg-gray-700/50 border-gray-600">
                <CardHeader>
                  <div className="mx-auto mb-4 w-12 h-12 p-2 bg-brand-100 dark:bg-brand-900/20 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-brand-500" />
                  </div>
                  <CardTitle className="text-white">Aplicaciones Web Modernas</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-300">
                    Desarrollamos aplicaciones web responsivas y optimizadas para todos los dispositivos.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center bg-gray-700/50 border-gray-600">
                <CardHeader>
                  <div className="mx-auto mb-4 w-12 h-12 p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-white">Equipo Local</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-300">
                    Somos un equipo local en Guadalajara, disponibles para reuniones presenciales y soporte directo.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center bg-gray-700/50 border-gray-600">
                <CardHeader>
                  <div className="mx-auto mb-4 w-12 h-12 p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <Smartphone className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-white">Diseño Responsivo</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-300">
                    Todos nuestros proyectos se adaptan perfectamente a móviles, tablets y escritorio.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center bg-gray-700/50 border-gray-600">
                <CardHeader>
                  <div className="mx-auto mb-4 w-12 h-12 p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Globe className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-white">SEO Optimizado</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-300">
                    Optimizamos cada sitio web para motores de búsqueda, asegurando mejor visibilidad online.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contacto"
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden"
        >
          <BackgroundEffects />
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary" className="bg-gray-800 text-gray-200 border-gray-700">
                  Contacto
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                  ¿Listo para tu próximo proyecto?
                </h2>
                <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Contáctanos para una consulta gratuita y descubre cómo podemos ayudarte
                </p>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>

        {/* Location Section */}
        <section
          id="ubicacion"
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-gray-800 via-gray-950 to-gray-800 relative overflow-hidden"
        >
          <BackgroundEffects />
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary" className="mb-4 bg-gray-700 text-gray-200 border-gray-600">
                  Nuestra Ubicación
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">Encuéntranos en Zapopan</h2>
                <p className="max-w-[900px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Estamos ubicados en el corazón de la zona metropolitana de Guadalajara
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-6">
                <Card className="bg-gray-700/50 border-gray-600">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Navigation className="h-6 w-6 text-brand-500" />
                      <CardTitle className="text-white">Dirección de Nuestra Oficina</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-brand-500 mt-1" />
                      <div>
                        <p className="font-medium text-white">Sara Bertha de la Torre 5506</p>
                        <p className="text-gray-300">Zapopan, Jalisco</p>
                        <p className="text-gray-300">México</p>
                      </div>
                    </div>
                    <div className="pt-4">
                      <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/20">
                        <Navigation className="mr-2 h-4 w-4" />
                        Ver en Google Maps
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-full overflow-hidden rounded-xl shadow-lg">
                  <div className="relative w-full h-96">
                    <iframe
                      src="https://www.google.com/maps?q=Sara+Bertha+de+la+Torre+5506,+Zapopan,+Jalisco,+Mexico&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-xl"
                      title="Ubicación de la oficina"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Lazy load Chatbot */}
      <Suspense fallback={null}>
        <Chatbot />
      </Suspense>

      {/* Footer */}
      <footer
        ref={footerRef}
        className="flex flex-col gap-4 py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gray-900 dark:bg-black border-gray-800"
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400/25 to-red-400/25 blur-lg animate-pulse"></div>
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-400/15 to-orange-400/15 blur-xl animate-pulse"
              style={{ animationDelay: "1.5s" }}
            ></div>
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/10 to-brand-400/10 blur-2xl animate-pulse"
              style={{ animationDelay: "2.5s" }}
            ></div>
            <Image
              src="/logo.png"
              alt="RevDev Solutions"
              width={56}
              height={56}
              className={`rounded-full transition-all duration-800 ease-out relative z-10 ${
                isFooterVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              loading="lazy"
            />
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex items-center justify-center gap-4 mt-2">
          {[
            { href: "https://instagram.com/revdevsolutions", icon: Instagram, delay: "200ms" },
            { href: "https://facebook.com/revdevsolutions", icon: Facebook, delay: "400ms" },
            { href: "https://x.com/revdevsolutions", icon: XIcon, delay: "600ms" },
          ].map((social, index) => (
            <Link
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-gray-400 hover:text-brand-500 transition-all duration-600 ease-out ${
                isFooterVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: isFooterVisible ? social.delay : "0ms" }}
            >
              <social.icon className="h-5 w-5" />
            </Link>
          ))}
        </div>

        <div
          className={`flex flex-col sm:flex-row w-full items-center justify-between transition-all duration-700 ease-out ${
            isFooterVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: isFooterVisible ? "800ms" : "0ms" }}
        >
          <p className="text-xs text-gray-400">© 2025 Revdev Solutions México - Desarrollo Web en Guadalajara</p>
          <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
            <Link className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-gray-300" href="#">
              Términos de Servicio
            </Link>
            <Link className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-gray-300" href="#">
              Políticas de Privacidad
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
