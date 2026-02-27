"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { signIn, signUp } from "@/app/actions/auth-actions"
import { useAuth } from "@/components/auth-provider"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      console.log("Login - User already authenticated, redirecting to dashboard")
      router.push("/dashboard")
    }
  }, [user, authLoading, router])

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const formData = new FormData(event.currentTarget)

    try {
      console.log("Login - Attempting to sign in")

      // Call the server action
      await signIn(formData)

      // If we reach here without error, it means login failed
      setMessage({ type: "error", text: "Error inesperado durante el login" })
      setIsLoading(false)
    } catch (error: any) {
      console.log("Login - Sign in error:", error)

      // Check if it's a redirect error (which is expected for successful login)
      if (error.message && (error.message.includes("NEXT_REDIRECT") || error.digest?.includes("NEXT_REDIRECT"))) {
        console.log("Login - Redirect detected, login successful")
        setMessage({ type: "success", text: "Inicio de sesión exitoso. Redirigiendo..." })
        // Don't set loading to false here, let the redirect happen
        return
      }

      // Handle other errors
      if (error.message) {
        setMessage({ type: "error", text: error.message })
      } else {
        setMessage({ type: "error", text: "Error inesperado al iniciar sesión" })
      }
      setIsLoading(false)
    }
  }

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const formData = new FormData(event.currentTarget)

    try {
      console.log("Login - Attempting to sign up")
      const result = await signUp(formData)

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || "Registro exitoso. Revisa tu email para confirmar tu cuenta.",
        })
      } else {
        setMessage({ type: "error", text: result.message || "Error al registrarse" })
      }
    } catch (error: any) {
      console.log("Login - Sign up error:", error)
      setMessage({ type: "error", text: error.message || "Error inesperado al registrarse" })
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
        <div className="text-center relative z-10">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-300">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // Show redirect message if user is authenticated
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
        <div className="text-center relative z-10">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-300">Ya has iniciado sesión. Redirigiendo al dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>

            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/30 to-red-500/30 blur-xl animate-pulse"></div>
                <div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-2xl animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <Image
                  src="/logo.png"
                  alt="RevDev Solutions"
                  width={80}
                  height={80}
                  className="rounded-full border-2 border-orange-500/30 shadow-[0_0_30px_rgba(254,99,7,0.3)] relative z-10"
                />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">Bienvenido</h1>
            <p className="text-gray-400">Accede a tu panel de administración</p>
          </div>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl shadow-black/50">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl text-center text-white">Iniciar Sesión</CardTitle>
              <CardDescription className="text-center text-gray-400">
                Ingresa tus credenciales para acceder
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/5 border-white/10 backdrop-blur-sm">
                  <TabsTrigger
                    value="signin"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white text-gray-300 transition-all duration-200"
                  >
                    Iniciar Sesión
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white text-gray-300 transition-all duration-200"
                  >
                    Registrarse
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="space-y-4 mt-6">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="text-gray-300">
                        Email
                      </Label>
                      <Input
                        id="signin-email"
                        name="email"
                        type="email"
                        placeholder="tu@email.com"
                        required
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500 backdrop-blur-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password" className="text-gray-300">
                        Contraseña
                      </Label>
                      <Input
                        id="signin-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500 backdrop-blur-sm"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-orange-500/25 transition-all duration-200 hover:scale-105 border-0"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Iniciando sesión...
                        </>
                      ) : (
                        "Iniciar Sesión"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4 mt-6">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-gray-300">
                        Nombre
                      </Label>
                      <Input
                        id="signup-name"
                        name="name"
                        type="text"
                        placeholder="Tu nombre"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500 backdrop-blur-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-gray-300">
                        Email
                      </Label>
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="tu@email.com"
                        required
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500 backdrop-blur-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-gray-300">
                        Contraseña
                      </Label>
                      <Input
                        id="signup-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500 backdrop-blur-sm"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-orange-500/25 transition-all duration-200 hover:scale-105 border-0"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Registrando...
                        </>
                      ) : (
                        "Crear Cuenta"
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Message Display */}
              {message && (
                <Alert
                  className={`mt-4 backdrop-blur-sm ${
                    message.type === "success"
                      ? "bg-green-900/30 border-green-400/30 text-green-400"
                      : "bg-red-900/30 border-red-400/30 text-red-400"
                  }`}
                >
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">© 2025 RevDev Solutions México</p>
          </div>
        </div>
      </div>
    </div>
  )
}
