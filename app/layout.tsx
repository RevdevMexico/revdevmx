import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from "react"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "Desarrollo Web en Guadalajara | RevDev Solutions México - Expertos en React",
  description:
    "Desarrollo web profesional en Guadalajara, Jalisco. Especialistas en React, Next.js, Firebase y PostgreSQL. +10 años creando aplicaciones web modernas para empresas en Guadalajara.",
  keywords: [
    "desarrollo web guadalajara",
    "desarrollo web en guadalajara",
    "diseño web guadalajara",
    "programadores guadalajara",
    "react guadalajara",
    "next.js guadalajara",
    "aplicaciones web guadalajara",
    "desarrollo frontend guadalajara",
    "desarrollo backend guadalajara",
    "páginas web guadalajara",
    "desarrollo web jalisco",
    "programación web guadalajara",
  ],
  authors: [{ name: "RevDev Solutions México" }],
  creator: "RevDev Solutions México",
  publisher: "RevDev Solutions México",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://revdev.mx",
    siteName: "RevDev Solutions México",
    title: "Desarrollo Web en Guadalajara | RevDev Solutions México",
    description:
      "Desarrollo web profesional en Guadalajara, Jalisco. Especialistas en React, Next.js, Firebase y PostgreSQL. +10 años de experiencia.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "RevDev Solutions México - Desarrollo Web en Guadalajara",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Desarrollo Web en Guadalajara | RevDev Solutions México",
    description:
      "Desarrollo web profesional en Guadalajara, Jalisco. Especialistas en React, Next.js, Firebase y PostgreSQL.",
    images: ["/logo.png"],
    creator: "@revdevsolutions",
  },
  alternates: {
    canonical: "https://revdev.mx",
  },
  verification: {
    google: "google-site-verification-code",
  },
  category: "technology",
  generator: "Next.js",
}

// Structured Data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "RevDev Solutions México",
  alternateName: "RevDev",
  url: "https://revdev.mx",
  logo: "https://revdev.mx/logo.png",
  description:
    "Empresa de desarrollo web profesional en Guadalajara, Jalisco. Especialistas en React, Next.js, Firebase y PostgreSQL.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Sara Bertha de la Torre 5506",
    addressLocality: "Zapopan",
    addressRegion: "Jalisco",
    addressCountry: "MX",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+52-33-1234-5678",
    contactType: "customer service",
    areaServed: "MX",
    availableLanguage: "Spanish",
  },
  sameAs: [
    "https://facebook.com/revdevsolutions",
    "https://instagram.com/revdevsolutions",
    "https://x.com/revdevsolutions",
  ],
  foundingDate: "2014",
  foundingLocation: "Guadalajara, Jalisco, México",
  numberOfEmployees: "5-10",
  slogan: "Tu presencia digital profesional comienza aquí",
  serviceArea: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: "20.6597",
      longitude: "-103.3496",
    },
    geoRadius: "50000",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" sizes="32x32" />
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" sizes="180x180" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#fe6307" />
        <meta name="geo.region" content="MX-JAL" />
        <meta name="geo.placename" content="Guadalajara" />
        <meta name="geo.position" content="20.6597;-103.3496" />
        <meta name="ICBM" content="20.6597, -103.3496" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </head>
      <body className={inter.className}>
        <Suspense fallback={<div>Loading...</div>}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true} disableTransitionOnChange={false}>
            <AuthProvider>
              {children}
              <Analytics />
              <SpeedInsights />
            </AuthProvider>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  )
}
