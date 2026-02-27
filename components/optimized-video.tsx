"use client"

import type React from "react"

import { useState, useRef, useEffect, memo } from "react"

interface OptimizedVideoProps {
  src: string
  className?: string
  style?: React.CSSProperties
  poster?: string
}

const OptimizedVideo = memo(({ src, className, style, poster }: OptimizedVideoProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isInView) {
            setIsInView(true)
            setIsLoaded(true)
          }
        })
      },
      { threshold: 0.1, rootMargin: "100px" },
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [isInView])

  return (
    <video
      ref={videoRef}
      autoPlay={isLoaded}
      muted
      loop
      playsInline
      className={className}
      style={style}
      preload="none"
      poster={poster}
      aria-label="Video de fondo"
    >
      {isLoaded && <source src={src} type="video/mp4" />}
    </video>
  )
})

OptimizedVideo.displayName = "OptimizedVideo"

export { OptimizedVideo }
