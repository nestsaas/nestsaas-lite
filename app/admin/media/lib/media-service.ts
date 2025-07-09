// import { Media } from "@/types"
import { Media } from "@prisma/client"

import { prisma } from "@/lib/prisma"

import { getMediaConfig } from "../config"
import {
  StorageProviderFactory,
  StorageProviderInterface,
  UploadedFile,
  UploadOptions,
} from "./providers"
import { MediaListQuery } from "./schema"

/**
 * Media service for handling media operations
 */
export class MediaService {
  private provider: StorageProviderInterface

  constructor() {
    const config = getMediaConfig()
    this.provider = StorageProviderFactory.createProvider(config.storage)
  }

  /**
   * Validate a file before upload
   */
  private validateFile(file: File): void {
    const config = getMediaConfig()

    if (file.size > config.maxFileSize) {
      throw new Error(
        `File size exceeds the maximum allowed size of ${config.maxFileSize / (1024 * 1024)}MB`
      )
    }

    if (!config.allowedFileTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed`)
    }
  }

  /**
   * Process image with Sharp to optimize size and format
   * @param file Original image file
   */
  private async processImage(file: File): Promise<File> {
    // Only process image files
    if (!file.type.startsWith("image/")) {
      return file
    }

    // Skip processing for icon type images
    if (
      file.type === "image/vnd.microsoft.icon" ||
      file.type === "image/x-icon" ||
      file.name.endsWith(".ico")
    ) {
      return file
    }

    try {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Import sharp (using dynamic import to avoid SSR issues)
      const sharp = (await import("sharp")).default

      // Process image: resize (maintaining aspect ratio) and convert to webp
      const MAX_DIMENSION = 1200
      const processedImageBuffer = await sharp(buffer)
        .resize({
          width: MAX_DIMENSION,
          height: MAX_DIMENSION,
          fit: "inside", // Maintain aspect ratio
          withoutEnlargement: true, // Don't enlarge images smaller than the specified dimensions
        })
        .webp({ quality: 85 }) // Convert to webp with good quality
        .toBuffer()

      // Create new filename with webp extension
      const originalName = file.name
      const nameWithoutExt =
        originalName.substring(0, originalName.lastIndexOf(".")) || originalName
      const newFileName = `${nameWithoutExt}.webp`

      // Create a new File object with the processed image
      const processedFile = new File([processedImageBuffer], newFileName, {
        type: "image/webp",
      })

      return processedFile
    } catch (error) {
      console.error("Error processing image:", error)
      // If processing fails, return the original file
      return file
    }
  }

  /**
   * Upload a file and save its metadata to the database
   */
  async uploadFile(
    file: File,
    options?: UploadOptions & { userId?: number },
    metadata?: {
      title?: string
    }
  ): Promise<any> {
    try {
      this.validateFile(file)

      // Process image if it's an image file
      const processedFile = await this.processImage(file)

      // Upload the processed file to storage
      const uploadedFile = await this.provider.uploadFile(
        processedFile,
        options
      )

      // Save file metadata to database
      const media = await prisma.media.create({
        data: {
          fileName: uploadedFile.fileName,
          mimeType: uploadedFile.mimeType,
          fileSize: uploadedFile.fileSize,
          width: uploadedFile.width,
          height: uploadedFile.height,
          url: uploadedFile.url,
          storageProvider: uploadedFile.storageProvider,
          storageKey: uploadedFile.storageKey,
          blurhash: uploadedFile.blurhash,
          // Only include userId if it's provided and not undefined/null
          ...(options?.userId ? { userId: options.userId } : {}),
          // Add metadata if provided
          ...(metadata?.title && { title: metadata.title }),
        },
      })

      return media
    } catch (error) {
      console.error("Error uploading file:", error)
      throw error
    }
  }

  /**
   * Delete a file and its metadata from the database
   */
  async deleteFile(mediaId: number): Promise<boolean> {
    try {
      const media = await prisma.media.findUnique({
        where: { id: mediaId },
      })

      if (!media) {
        throw new Error(`Media with ID ${mediaId} not found`)
      }

      await this.provider.deleteFile(media.storageKey)

      await prisma.media.delete({
        where: { id: mediaId },
      })

      return true
    } catch (error) {
      console.error("Error deleting file:", error)
      throw error
    }
  }

  /**
   * Get a list of media files with pagination
   */
  async getMediaList(options?: MediaListQuery): Promise<{
    items: Media[]
    total: number
    page: number
    pageSize: number
  }> {
    const { page = 1, pageSize = 20, search, filter, userId } = options || {}

    const where: any = {}

    if (search) {
      where.OR = [
        { fileName: { contains: search, mode: "insensitive" } },
        { title: { contains: search, mode: "insensitive" } },
      ]
    }

    // Handle type filter (image, document, video, audio)
    if (filter?.type) {
      switch (filter.type) {
        case "image":
          where.mimeType = { startsWith: "image/" }
          break
        case "document":
          where.OR = [
            { mimeType: { startsWith: "application/pdf" } },
            { mimeType: { startsWith: "application/msword" } },
            {
              mimeType: {
                startsWith:
                  "application/vnd.openxmlformats-officedocument.wordprocessingml",
              },
            },
            { mimeType: { startsWith: "application/vnd.ms-excel" } },
            {
              mimeType: {
                startsWith:
                  "application/vnd.openxmlformats-officedocument.spreadsheetml",
              },
            },
            { mimeType: { startsWith: "text/" } },
          ]
          break
        case "video":
          where.mimeType = { startsWith: "video/" }
          break
        case "audio":
          where.mimeType = { startsWith: "audio/" }
          break
        default:
          // If it's not one of the predefined types, treat it as a direct mimeType filter
          where.mimeType = { startsWith: filter.type }
      }
    }

    // Handle size filter (small, medium, large)
    if (filter?.size) {
      switch (filter.size) {
        case "small":
          // Small: < 1MB (1048576 bytes)
          where.fileSize = { lt: 1048576 }
          break
        case "medium":
          // Medium: 1MB - 10MB
          where.fileSize = {
            gte: 1048576,
            lt: 10485760, // 10MB
          }
          break
        case "large":
          // Large: > 10MB
          where.fileSize = { gte: 10485760 }
          break
        default:
          // If it's not one of the predefined sizes, treat it as a direct size value
          where.fileSize = { gte: parseInt(filter.size, 10) }
      }
    }

    // Handle date filters
    if (filter?.from || filter?.to) {
      where.createdAt = {}

      if (filter.from) {
        where.createdAt.gte = new Date(filter.from)
      }

      if (filter.to) {
        // Add one day to include the end date fully (up to 23:59:59)
        const toDate = new Date(filter.to)
        toDate.setDate(toDate.getDate() + 1)
        where.createdAt.lt = toDate
      }
    }

    if (userId) {
      where.userId = userId
    }

    const total = await prisma.media.count({ where })

    const items = await prisma.media.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    return {
      items,
      total,
      page,
      pageSize,
    }
  }

  /**
   * Get a single media file by ID
   */
  async getMediaById(mediaId: number): Promise<any> {
    return prisma.media.findUnique({
      where: { id: mediaId },
    })
  }

  /**
   * Update media metadata
   */
  async updateMedia(
    mediaId: number,
    data: {
      title?: string
    }
  ): Promise<any> {
    return prisma.media.update({
      where: { id: mediaId },
      data,
    })
  }
}
