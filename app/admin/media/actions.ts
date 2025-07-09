"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/lib/auth"

import { MediaService } from "./lib/media-service"
import {
  mediaDeleteSchema,
  mediaListQuerySchema,
  mediaUpdateSchema,
  mediaUploadSchema,
} from "./lib/schema"

/**
 * Upload a media file
 */
export async function uploadMedia(formData: FormData) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: "Unauthorized" }
    }

    const file = formData.get("file") as File
    if (!file) {
      return { error: "No file provided" }
    }

    const validationResult = mediaUploadSchema.safeParse({
      file,
      title: formData.get("title"),
      path: formData.get("path"),
    })

    if (!validationResult.success) {
      return { error: validationResult.error.message }
    }

    const mediaService = new MediaService()

    const path = formData.get("path") as string | undefined

    const uploadOptions = {
      userId:
        typeof session.user.id === "string"
          ? parseInt(session.user.id, 10)
          : session.user.id,
      path,
      generateMetadata: true,
    }

    // Extract metadata for database
    const metadata = {
      title: formData.get("title") as string | undefined,
    }

    const media = await mediaService.uploadFile(file, uploadOptions, metadata)

    revalidatePath("/admin/media")

    return { success: true, media }
  } catch (error: any) {
    console.error("Error uploading media:", error)
    return { error: error.message || "Failed to upload media" }
  }
}

/**
 * Get a list of media files with pagination
 */
export async function getMediaList(query: {
  page?: number
  pageSize?: number
  search?: string
  filter?: {
    type?: string
    size?: string
    from?: string
    to?: string
  }
}) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: "Unauthorized" }
    }

    const validationResult = mediaListQuerySchema.safeParse(query)
    if (!validationResult.success) {
      return { error: validationResult.error.message }
    }

    const mediaService = new MediaService()
    const result = await mediaService.getMediaList({
      ...validationResult.data,
      userId:
        session.user.role === "ADMIN"
          ? undefined
          : typeof session.user.id === "string"
            ? parseInt(session.user.id, 10)
            : session.user.id,
    })

    return { success: true, ...result }
  } catch (error: any) {
    console.error("Error getting media list:", error)
    return { error: error.message || "Failed to get media list" }
  }
}

/**
 * Get a single media file by ID
 */
export async function getMediaById(id: number) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: "Unauthorized" }
    }

    const mediaService = new MediaService()
    const media = await mediaService.getMediaById(id)

    if (!media) {
      return { error: "Media not found" }
    }

    // Check if user has access to this media
    if (
      session.user.role !== "ADMIN" &&
      media.userId !==
        (typeof session.user.id === "string"
          ? parseInt(session.user.id, 10)
          : session.user.id)
    ) {
      return { error: "Unauthorized" }
    }

    return { success: true, media }
  } catch (error: any) {
    console.error("Error getting media:", error)
    return { error: error.message || "Failed to get media" }
  }
}

/**
 * Update media metadata
 */
export async function updateMedia(data: {
  id: number
  title?: string
}) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: "Unauthorized" }
    }

    const validationResult = mediaUpdateSchema.safeParse(data)
    if (!validationResult.success) {
      return { error: validationResult.error.message }
    }

    const mediaService = new MediaService()
    const media = await mediaService.getMediaById(data.id)
    if (!media) {
      return { error: "Media not found" }
    }

    if (
      session.user.role !== "ADMIN" &&
      media.userId !==
        (typeof session.user.id === "string"
          ? parseInt(session.user.id, 10)
          : session.user.id)
    ) {
      return { error: "Unauthorized" }
    }

    const updatedMedia = await mediaService.updateMedia(data.id, {
      title: data.title,
    })

    revalidatePath("/admin/media")
    revalidatePath(`/admin/media/${data.id}`)

    return { success: true, media: updatedMedia }
  } catch (error: any) {
    console.error("Error updating media:", error)
    return { error: error.message || "Failed to update media" }
  }
}

/**
 * Delete a media file
 */
export async function deleteMedia(data: { id: number }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: "Unauthorized" }
    }

    const validationResult = mediaDeleteSchema.safeParse(data)
    if (!validationResult.success) {
      return { error: validationResult.error.message }
    }

    const mediaService = new MediaService()
    const media = await mediaService.getMediaById(data.id)
    if (!media) {
      return { error: "Media not found" }
    }

    if (
      session.user.role !== "ADMIN" &&
      media.userId !==
        (typeof session.user.id === "string"
          ? parseInt(session.user.id, 10)
          : session.user.id)
    ) {
      return { error: "Unauthorized" }
    }

    await mediaService.deleteFile(data.id)

    revalidatePath("/admin/media")

    return { success: true }
  } catch (error: any) {
    console.error("Error deleting media:", error)
    return { error: error.message || "Failed to delete media" }
  }
}
