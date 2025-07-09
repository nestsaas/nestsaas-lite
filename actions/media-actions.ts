"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { auth } from "@/lib/auth"
import { MediaService } from "@/app/admin/media/lib/media-service"

// Schema for media upload validation
const mediaUploadSchema = z.object({
  file: z.instanceof(File).refine((file) => file.size > 0, {
    message: "File is required",
  }),
  title: z.string().optional(),
  path: z.string().optional(),
})

/**
 * Upload an image file and return the media object
 */
export async function uploadImage(formData: FormData) {
  try {
    const session = await auth()
    if (!session?.user) {
      return { error: "Unauthorized" }
    }

    const file = formData.get("file") as File
    if (!file) {
      return { error: "No file provided" }
    }

    // Validate file is an image
    if (!file.type.startsWith("image/")) {
      return { error: "Only image files are allowed" }
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

    const uploadOptions = {
      userId:
        typeof session.user.id === "string"
          ? parseInt(session.user.id, 10)
          : session.user.id,
      path: formData.get("path") as string | undefined,
      generateMetadata: true,
    }

    // Extract metadata for database
    const metadata = {
      title: formData.get("title") as string | undefined,
    }

    const media = await mediaService.uploadFile(file, uploadOptions, metadata)

    return { success: true, media }
  } catch (error: any) {
    console.error("Error uploading image:", error)
    return { error: error.message || "Failed to upload image" }
  }
}
