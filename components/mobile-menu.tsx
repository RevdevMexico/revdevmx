"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  const closeMenu = () => setIsOpen(false)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      closeMenu()
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 md:hidden backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-80 border-white/10 [&>button]:hidden overflow-hidden"
        style={{
          background: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute top-1/2 -left-20 w-32 h-32 bg-gradient-to-br from-red-500/15 to-orange-500/15 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute -bottom-20 right-1/3 w-36 h-36 bg-gradient-to-br from-orange-400/10 to-red-400/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="flex flex-col h-full relative z-10">
          <div className="flex items-center justify-between px-3 py-4">
            {/* Logo simplificado */}
            <Link href="/" className="flex items-center" onClick={closeMenu}>
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400/50 to-red-400/50 blur-lg animate-pulse scale-150"></div>
                <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-full relative z-10" />
              </div>
            </Link>

            {/* Botón cerrar simplificado */}
            <Button
              variant="ghost"
              size="icon"
              onClick={closeMenu}
              className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/30 text-white transition-all duration-300 hover:scale-110 hover:rotate-90 rounded-full w-10 h-10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <nav className="flex-1 px-6 py-8">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection("inicio")}
                  className="text-white/80 hover:text-white transition-all duration-300 text-sm font-medium w-full text-left py-3 px-4 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("servicios")}
                  className="text-white/80 hover:text-white transition-all duration-300 text-sm font-medium w-full text-left py-3 px-4 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10"
                >
                  Servicios
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("proyectos")}
                  className="text-white/80 hover:text-white transition-all duration-300 text-sm font-medium w-full text-left py-3 px-4 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10"
                >
                  Proyectos
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("nosotros")}
                  className="text-white/80 hover:text-white transition-all duration-300 text-sm font-medium w-full text-left py-3 px-4 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10"
                >
                  Nosotros
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contacto")}
                  className="text-white/80 hover:text-white transition-all duration-300 text-sm font-medium w-full text-left py-3 px-4 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10"
                >
                  Contacto
                </button>
              </li>
            </ul>
          </nav>

          <div className="p-6 border-t border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="space-y-3">
              {user ? (
                <Link href="/dashboard" onClick={closeMenu}>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/login" onClick={closeMenu}>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30">
                    <User className="mr-2 h-4 w-4" />
                    Iniciar Sesión
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
