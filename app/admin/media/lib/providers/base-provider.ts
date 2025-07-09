import {
  GetUrlOptions,
  StorageProvider,
  StorageProviderConfig,
  StorageProviderInterface,
  UploadedFile,
  UploadOptions,
} from "./types"

/**
 * Abstract base class for storage providers
 */
export abstract class BaseStorageProvider implements StorageProviderInterface {
  protected config: StorageProviderConfig

  constructor(config: StorageProviderConfig) {
    this.config = config
  }

  /**
   * Generate a unique storage key for a file
   * @param fileName Original file name
   * @param path Optional path within storage
   */
  protected generateStorageKey(fileName: string, path?: string): string {
    // Generate a timestamp-based unique identifier
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 10)

    // Sanitize the filename to remove problematic characters
    const sanitizedName = fileName
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, "-")
      .replace(/-+/g, "-")

    // Extract file extension
    const extension = sanitizedName.split(".").pop() || ""
    const baseName = sanitizedName.substring(0, sanitizedName.lastIndexOf("."))

    // Create a unique filename with timestamp and random string
    const uniqueName = `${baseName}-${timestamp}-${randomString}.${extension}`

    // Combine with path if provided
    return path ? `${path.replace(/\/$/, "")}/${uniqueName}` : uniqueName
  }

  /**
   * Extract image metadata from a file (width, height, etc.)
   * @param file The image file
   */
  protected async extractImageMetadata(file: File): Promise<{
    width?: number
    height?: number
    blurhash?: string
  }> {
    // Only process image files (skip icons)
    if (!file.type.startsWith("image/") || 
        file.type === "image/vnd.microsoft.icon" || 
        file.type === "image/x-icon" || 
        file.name.endsWith(".ico")) {
      return {}
    }

    try {
      // Get image dimensions using a server-compatible approach
      const dimensions = await this.getImageDimensions(file)

      // Generate blurhash
      const blurhash = await this.generateBlurhash(file)

      return {
        ...dimensions,
        blurhash,
      }
    } catch (error) {
      console.error("Error extracting image metadata:", error)
      return {}
    }
  }

  /**
   * Get image dimensions using a server-compatible approach
   * @param file The image file
   */
  private async getImageDimensions(
    file: File
  ): Promise<{ width?: number; height?: number }> {
    try {
      // We're in a Node.js environment
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Import sharp (using dynamic import to avoid SSR issues)
      const sharp = (await import("sharp")).default
      const metadata = await sharp(buffer).metadata()

      return {
        width: metadata.width,
        height: metadata.height,
      }
    } catch (error) {
      console.error("Error getting image dimensions:", error)
      return {}
    }
  }

  /**
   * Generate a blurhash for an image file
   * @param file The image file
   */
  private async generateBlurhash(file: File): Promise<string | undefined> {
    try {
      // Convert File to buffer
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Import sharp dynamically
      const sharp = (await import("sharp")).default

      // Generate blur image using sharp
      const { info, data } = await sharp(buffer)
        .resize(32, 32)
        .blur()
        .toBuffer({ resolveWithObject: true })

      return `data:image/${info.format};base64,${data.toString("base64")}`
    } catch (error) {
      console.error("Error generating blurhash:", error)
      return undefined
    }
  }

  /**
   * Upload a file to storage
   * @param file The file to upload
   * @param options Additional upload options
   */
  abstract uploadFile(
    file: File,
    options?: UploadOptions
  ): Promise<UploadedFile>

  /**
   * Delete a file from storage
   * @param storageKey The storage key of the file to delete
   */
  abstract deleteFile(storageKey: string): Promise<boolean>

  /**
   * Get a URL for a file
   * @param storageKey The storage key of the file
   * @param options URL options (e.g. expiration for signed URLs)
   */
  abstract getFileUrl(
    storageKey: string,
    options?: GetUrlOptions
  ): Promise<string>
}
