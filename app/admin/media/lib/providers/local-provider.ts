import fs from "fs"
import path from "path"

import { BaseStorageProvider } from "./base-provider"
import {
  StorageProvider,
  StorageProviderConfig,
  UploadedFile,
  UploadOptions,
} from "./types"

/**
 * Local filesystem storage provider
 */
export class LocalStorageProvider extends BaseStorageProvider {
  private uploadDir: string
  private baseUrl: string

  constructor(config: StorageProviderConfig) {
    super(config)

    // Set up local storage directory
    this.uploadDir =
      config.basePath || path.join(process.cwd(), "public", "uploads")
    this.baseUrl = config.baseUrl || "/uploads"

    // Ensure upload directory exists
    this.ensureUploadDirExists()
  }

  private ensureUploadDirExists(): void {
    try {
      if (!fs.existsSync(this.uploadDir)) {
        fs.mkdirSync(this.uploadDir, { recursive: true })
      }
    } catch (error) {
      console.error("Failed to create upload directory:", error)
      throw new Error("Failed to initialize local storage provider")
    }
  }

  /**
   * Convert a File object to a Buffer
   */
  private async fileToBuffer(file: File): Promise<Buffer> {
    const arrayBuffer = await file.arrayBuffer()
    return Buffer.from(arrayBuffer)
  }

  /**
   * Upload a file to the local filesystem
   */
  async uploadFile(file: File, options?: UploadOptions): Promise<UploadedFile> {
    const { path: subPath, fileName, generateMetadata = true } = options || {}

    // Generate a unique storage key
    const storageKey = this.generateStorageKey(fileName || file.name, subPath)

    // Determine the full path where the file will be stored
    const fullPath = path.join(this.uploadDir, storageKey)

    // Ensure the directory exists
    const dirPath = path.dirname(fullPath)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }

    const buffer = await this.fileToBuffer(file)
    fs.writeFileSync(fullPath, buffer)

    // Extract metadata if needed
    let metadata = {}
    if (generateMetadata && file.type.startsWith("image/")) {
      metadata = await this.extractImageMetadata(file)
    }

    // Generate the public URL
    const url = `${this.baseUrl}/${storageKey}`

    return {
      fileName: file.name,
      mimeType: file.type,
      fileSize: file.size,
      url,
      storageKey,
      storageProvider: StorageProvider.LOCAL,
      ...metadata,
    }
  }

  /**
   * Delete a file from the local filesystem
   */
  async deleteFile(storageKey: string): Promise<boolean> {
    const fullPath = path.join(this.uploadDir, storageKey)

    try {
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath)
        return true
      }
      return false // File doesn't exist
    } catch (error) {
      console.error("Failed to delete file:", error)
      return false
    }
  }

  /**
   * Get a URL for a file
   */
  async getFileUrl(storageKey: string): Promise<string> {
    // For local storage, we simply return the public URL
    return `${this.baseUrl}/${storageKey}`
  }
}
