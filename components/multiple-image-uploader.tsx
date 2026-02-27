"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Loader2, Plus } from "lucide-react"
import Image from "next/image"
import { uploadImage, deleteImage } from "@/app/actions/upload-actions"

interface MultipleImageUploaderProps {
  label: string
  value: string[]
  onChange: (urls: string[]) => void
  disabled?: boolean
  maxImages?: number
  maxSize?: number // en MB
}

export function MultipleImageUploader({
  label,
  value = [],
  onChange,
  disabled = false,
  maxImages = 5,
  maxSize = 5,
}: MultipleImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [newImageUrl, setNewImageUrl] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = useCallback(
    async (files: FileList) => {
      if (!files || files.length === 0) return

      const remainingSlots = maxImages - value.length
      const filesToUpload = Array.from(files).slice(0, remainingSlots)

      setIsUploading(true)
      setUploadError(null)

      const newUrls: string[] = []
      const errors: string[] = []

      for (const file of filesToUpload) {
        // Validar tamaño
        if (file.size > maxSize * 1024 * 1024) {
          errors.push(`${file.name}: Archivo demasiado grande (máximo ${maxSize}MB)`)
          continue
        }

        try {
          const formData = new FormData()
          formData.append("file", file)

          const result = await uploadImage(formData)

          if (result.success && result.url) {
            newUrls.push(result.url)
          } else {
            errors.push(`${file.name}: ${result.message}`)
          }
        } catch (error) {
          errors.push(`${file.name}: Error al subir`)
        }
      }

      if (newUrls.length > 0) {
        onChange([...value, ...newUrls])
      }

      if (errors.length > 0) {
        setUploadError(errors.join(", "))
      }

      setIsUploading(false)
    },
    [value, onChange, maxImages, maxSize],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files) {
        handleFileUpload(files)
      }
    },
    [handleFileUpload],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragActive(false)

      const files = e.dataTransfer.files
      if (files) {
        handleFileUpload(files)
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

  const handleRemoveImage = useCallback(
    async (index: number) => {
      const imageUrl = value[index]
      if (imageUrl) {
        // Intentar eliminar del storage si es una imagen subida
        try {
          await deleteImage(imageUrl)
        } catch (error) {
          console.warn("Could not delete image from storage:", error)
        }
      }
      const newUrls = value.filter((_, i) => i !== index)
      onChange(newUrls)
    },
    [value, onChange],
  )

  const handleAddUrl = useCallback(() => {
    if (newImageUrl.trim() && value.length < maxImages) {
      onChange([...value, newImageUrl.trim()])
      setNewImageUrl("")
      setUploadError(null)
    }
  }, [newImageUrl, value, onChange, maxImages])

  const canAddMore = value.length < maxImages

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>{label}</Label>
        <span className="text-xs text-muted-foreground">
          {value.length} / {maxImages} imágenes
        </span>
      </div>

      {/* Imágenes existentes */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {value.map((url, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-2">
                <div className="relative">
                  <Image
                    src={url || "/placeholder.svg"}
                    alt={`Imagen ${index + 1}`}
                    width={150}
                    height={100}
                    className="w-full h-24 object-cover rounded"
                    onError={() => setUploadError(`Error al cargar imagen ${index + 1}`)}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={() => handleRemoveImage(index)}
                    disabled={disabled || isUploading}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Área de subida */}
      {canAddMore && (
        <Card
          className={`border-2 border-dashed transition-colors ${
            dragActive ? "border-brand-500 bg-brand-50 dark:bg-brand-950" : "border-gray-300 dark:border-gray-600"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <CardContent className="p-6 text-center">
            {isUploading ? (
              <div className="space-y-2">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-brand-500" />
                <p className="text-sm text-muted-foreground">Subiendo imágenes...</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Arrastra imágenes aquí o haz clic para seleccionar</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, WebP hasta {maxSize}MB cada una</p>
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
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading || !canAddMore}
      />

      {/* Input para URL manual */}
      {canAddMore && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">O agrega una URL:</Label>
          <div className="flex gap-2">
            <Input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              disabled={disabled || isUploading}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddUrl}
              disabled={disabled || isUploading || !newImageUrl.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Error message */}
      {uploadError && <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>}
    </div>
  )
}
