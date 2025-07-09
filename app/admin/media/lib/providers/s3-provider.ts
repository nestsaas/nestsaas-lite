import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import { BaseStorageProvider } from "./base-provider"
import {
  GetUrlOptions,
  StorageProvider,
  StorageProviderConfig,
  UploadedFile,
  UploadOptions,
} from "./types"

/**
 * S3-compatible storage provider (works with AWS S3 and Cloudflare R2)
 */
export class S3StorageProvider extends BaseStorageProvider {
  private client: S3Client
  private bucket: string
  private region: string
  private baseUrl?: string
  private endpoint?: string
  private customDomain?: string
  private cloudFrontDomain?: string
  private provider: StorageProvider.S3 | StorageProvider.R2

  constructor(config: StorageProviderConfig) {
    super(config)

    if (
      !config.bucket ||
      !config.region ||
      !config.accessKeyId ||
      !config.secretAccessKey
    ) {
      throw new Error("Missing required S3 configuration")
    }

    this.bucket = config.bucket
    this.region = config.region
    this.baseUrl = config.baseUrl
    this.endpoint = config.endpoint
    this.customDomain = config.customDomain
    this.cloudFrontDomain = config.cloudFrontDomain
    this.provider = config.provider as StorageProvider.S3 | StorageProvider.R2

    // Create S3 client
    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      // For Cloudflare R2, use the custom endpoint
      ...(config.endpoint && {
        endpoint: config.endpoint,
      }),
    })
  }

  /**
   * Upload a file to S3/R2
   */
  async uploadFile(file: File, options?: UploadOptions): Promise<UploadedFile> {
    const {
      path: subPath,
      fileName,
      generateMetadata = true,
      contentType,
    } = options || {}

    // Generate a unique storage key
    const storageKey = this.generateStorageKey(fileName || file.name, subPath)
    console.log("== storageKey", storageKey)
    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer()

    // Upload to S3/R2
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: storageKey,
        Body: Buffer.from(arrayBuffer),
        ContentType: contentType || file.type,
      })
    )

    // Extract metadata if needed
    let metadata = {}
    if (generateMetadata && file.type.startsWith("image/")) {
      metadata = await this.extractImageMetadata(file)
    }

    // Generate URL
    const url = await this.getFileUrl(storageKey)
    console.log("url:", url)
    return {
      fileName: file.name,
      mimeType: file.type,
      fileSize: file.size,
      url,
      storageKey,
      storageProvider: this.provider,
      ...metadata,
    }
  }

  /**
   * Delete a file from S3/R2
   */
  async deleteFile(storageKey: string): Promise<boolean> {
    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: storageKey,
        })
      )
      return true
    } catch (error) {
      console.error("Failed to delete file from S3/R2:", error)
      return false
    }
  }

  /**
   * Get a URL for a file in S3/R2
   */
  async getFileUrl(
    storageKey: string,
    options?: GetUrlOptions
  ): Promise<string> {
    // If useSignedUrls option is explicitly set, return a signed URL (e.g. for temporary access)
    if (options?.useSignedUrl) {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: storageKey,
      })

      const expiresIn = options?.expiresIn || 3600 // Default to 1 hour
      return getSignedUrl(this.client, command, { expiresIn })
    }

    // If no base URL is provided, construct a direct S3/R2 URL
    // This assumes the bucket is configured for public access or has appropriate CORS settings
    const region = this.region
    const bucket = this.bucket

    // For R2, use the custom endpoint if provided
    if (this.provider === StorageProvider.R2) {
      // Remove protocol from endpoint if present
      if (this.customDomain) {
        const cleanDomain = this.customDomain.startsWith("https://")
          ? this.customDomain.substring(8)
          : this.customDomain
        // Use the endpoint directly without prepending the bucket name
        return `https://${cleanDomain}/${storageKey}`
      }
      console.warn("R2 Custom domain is not configured")
    }

    // For standard S3
    if (this.provider === StorageProvider.S3) {
      // If CloudFront domain is provided, use it (highest priority)
      if (this.cloudFrontDomain) {
        // Remove protocol from domain if present
        const cleanDomain = this.cloudFrontDomain.startsWith("https://")
          ? this.cloudFrontDomain.substring(8)
          : this.cloudFrontDomain

        return `https://${cleanDomain}/${storageKey}`
      }
      return `https://${bucket}.s3.${region}.amazonaws.com/${storageKey}`
    }

    // If we get here, we don't have enough information to construct a URL
    throw new Error(
      "Cannot generate URL: No baseUrl provided and signed URLs not requested"
    )
  }
}
