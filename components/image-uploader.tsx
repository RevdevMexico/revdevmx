"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { uploadImage, deleteImage } from "@/app/actions/upload-actions"

interface ImageUploaderProps {
  label: string
  value: string
  onChange: (url: string) => void
  disabled?: boolean
  className?: string
  accept?: string
  maxSize?: number // en MB
}

export function ImageUploader({
  label,
  value,
  onChange,
  disabled = false,
  className = "",
  accept = "image/*",
  maxSize = 5,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!file) return

      // Validar tamaño
      if (file.size > maxSize * 1024 * 1024) {
        setUploadError(`El archivo es demasiado grande. Máximo ${maxSize}MB permitido`)
        return
      }

      setIsUploading(true)
      setUploadError(null)

      try {
        const formData = new FormData()
        formData.append("file", file)

        const result = await uploadImage(formData)

        if (result.success && result.url) {
          onChange(result.url)
        } else {
          setUploadError(result.message)
        }
      } catch (error) {
        setUploadError("Error al subir la imagen")
      } finally {
        setIsUploading(false)
      }
    },
    [onChange, maxSize],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFileUpload(file)
      }
    },
    [handleFileUpload],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragActive(false)

      const file = e.dataTransfer.files?.[0]
      if (file) {
        handleFileUpload(file)
      }
    },
    [handleFileUpload],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }, [])

  const handleRemoveImage = useCallback(async () => {
    if (value) {
      // Intentar eliminar del storage si es una imagen subida
      try {
        await deleteImage(value)
      } catch (error) {
        console.warn("Could not delete image from storage:", error)
      }
      onChange("")
    }
  }, [value, onChange])

  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value)
      setUploadError(null)
    },
    [onChange],
  )

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>

      {/* Vista previa de la imagen */}
      {value && (
        <Card className="relative">
          <CardContent className="p-4">
            <div className="relative">
              <Image
                src={value || "/placeholder.svg"}
                alt="Vista previa"
                width={200}
                height={120}
                className="w-full h-32 object-cover rounded-lg"
                onError={() => setUploadError("Error al cargar la imagen")}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={handleRemoveImage}
                disabled={disabled || isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Área de subida */}
      {!value && (
        <Card
          className={`border-2 border-dashed transition-colors ${
            dragActive ? "border-brand-500 bg-brand-50 dark:bg-brand-950" : "border-gray-300 dark:border-gray-600"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <CardContent className="p-8 text-center">
            {isUploading ? (
              <div className="space-y-2">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-brand-500" />
                <p className="text-sm text-muted-foreground">Subiendo imagen...</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Arrastra una imagen aquí o haz clic para seleccionar</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, WebP hasta {maxSize}MB</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Input de archivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Input para URL manual */}
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">O ingresa una URL:</Label>
        <Input
          type="url"
          value={value}
          onChange={handleUrlChange}
          placeholder="https://ejemplo.com/imagen.jpg"
          disabled={disabled || isUploading}
        />
      </div>

      {/* Error message */}
      {uploadError && <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>}
    </div>
  )
}
