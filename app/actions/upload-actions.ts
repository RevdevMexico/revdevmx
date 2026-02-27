"use server"

import { put, del } from "@vercel/blob"

export interface UploadResult {
  success: boolean
  message: string
  url?: string
}

// Función para subir una imagen
export async function uploadImage(formData: FormData): Promise<UploadResult> {
  try {
    const file = formData.get("file") as File

    if (!file) {
      return {
        success: false,
        message: "No se proporcionó ningún archivo",
      }
    }

    // Validar tipo de archivo
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        message: "Tipo de archivo no permitido. Solo se permiten imágenes (JPG, PNG, WebP, GIF)",
      }
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        message: "El archivo es demasiado grande. Máximo 5MB permitido",
      }
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split(".").pop()
    const fileName = `projects/${timestamp}-${randomString}.${extension}`

    // Subir archivo a Vercel Blob
    const blob = await put(fileName, file, {
      access: "public",
    })

    return {
      success: true,
      message: "Imagen subida exitosamente",
      url: blob.url,
    }
  } catch (error) {
    console.error("Error uploading image:", error)
    return {
      success: false,
      message: "Error al subir la imagen",
    }
  }
}

// Función para eliminar una imagen
export async function deleteImage(url: string): Promise<UploadResult> {
  try {
    if (!url) {
      return {
        success: false,
        message: "URL no proporcionada",
      }
    }

    // Extraer el nombre del archivo de la URL
    const urlParts = url.split("/")
    const fileName = urlParts[urlParts.length - 1]

    if (!fileName.includes("projects/")) {
      // Si no es una imagen de proyecto, no intentar eliminarla
      return {
        success: true,
        message: "Imagen externa, no eliminada del storage",
      }
    }

    await del(url)

    return {
      success: true,
      message: "Imagen eliminada exitosamente",
    }
  } catch (error) {
    console.error("Error deleting image:", error)
    return {
      success: false,
      message: "Error al eliminar la imagen",
    }
  }
}

// Función para subir múltiples imágenes
export async function uploadMultipleImages(formData: FormData): Promise<{
  success: boolean
  message: string
  urls: string[]
  errors: string[]
}> {
  const files = formData.getAll("files") as File[]
  const urls: string[] = []
  const errors: string[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (!file || file.size === 0) continue

    const fileFormData = new FormData()
    fileFormData.append("file", file)

    const result = await uploadImage(fileFormData)
    if (result.success && result.url) {
      urls.push(result.url)
    } else {
      errors.push(`${file.name}: ${result.message}`)
    }
  }

  return {
    success: urls.length > 0,
    message: `${urls.length} imágenes subidas exitosamente${errors.length > 0 ? `, ${errors.length} errores` : ""}`,
    urls,
    errors,
  }
}
