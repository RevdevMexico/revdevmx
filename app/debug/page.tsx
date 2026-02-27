"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugPage() {
  const [diagnostics, setDiagnostics] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const runDiagnostics = async () => {
      try {
        const results = {
          timestamp: new Date().toISOString(),
          environment: {
            nodeEnv: process.env.NODE_ENV,
            hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          },
          browser: {
            userAgent: navigator.userAgent,
            cookiesEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
          },
          errors: [] as string[],
        }

        // Test component imports
        try {
          const { useAuth } = await import("@/components/auth-provider")
          results.errors.push("✅ AuthProvider imported successfully")
        } catch (error) {
          results.errors.push(`❌ AuthProvider import failed: ${error}`)
        }

        try {
          const { ProjectCarousel } = await import("@/components/project-carousel")
          results.errors.push("✅ ProjectCarousel imported successfully")
        } catch (error) {
          results.errors.push(`❌ ProjectCarousel import failed: ${error}`)
        }

        try {
          const { ContactForm } = await import("@/components/contact-form")
          results.errors.push("✅ ContactForm imported successfully")
        } catch (error) {
          results.errors.push(`❌ ContactForm import failed: ${error}`)
        }

        setDiagnostics(results)
      } catch (error) {
        setDiagnostics({
          error: `Diagnostic failed: ${error}`,
          timestamp: new Date().toISOString(),
        })
      } finally {
        setLoading(false)
      }
    }

    runDiagnostics()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Diagnóstico de la Aplicación</h1>
          <div className="animate-pulse">Ejecutando diagnósticos...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Diagnóstico de la Aplicación</h1>

        <div className="grid gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Estado General</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Timestamp:</strong> {diagnostics.timestamp}
                </p>
                <p>
                  <strong>Página cargada:</strong> ✅ Sí
                </p>
                <p>
                  <strong>React funcionando:</strong> ✅ Sí
                </p>
              </div>
            </CardContent>
          </Card>

          {diagnostics.environment && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Variables de Entorno</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <strong>NODE_ENV:</strong> {diagnostics.environment.nodeEnv}
                  </p>
                  <p>
                    <strong>Supabase URL:</strong>{" "}
                    {diagnostics.environment.hasSupabaseUrl ? "✅ Configurada" : "❌ No configurada"}
                  </p>
                  <p>
                    <strong>Supabase Key:</strong>{" "}
                    {diagnostics.environment.hasSupabaseKey ? "✅ Configurada" : "❌ No configurada"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {diagnostics.browser && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Navegador</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <strong>Cookies habilitadas:</strong> {diagnostics.browser.cookiesEnabled ? "✅ Sí" : "❌ No"}
                  </p>
                  <p>
                    <strong>En línea:</strong> {diagnostics.browser.onLine ? "✅ Sí" : "❌ No"}
                  </p>
                  <p>
                    <strong>User Agent:</strong> {diagnostics.browser.userAgent}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {diagnostics.errors && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Importaciones de Componentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {diagnostics.errors.map((error: string, index: number) => (
                    <p key={index} className="font-mono text-sm">
                      {error}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4">
            <Button
              onClick={() => (window.location.href = "/")}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              Ir a la Página Principal
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Recargar Diagnóstico
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
