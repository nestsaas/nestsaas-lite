import { StorageProvider, StorageProviderConfig } from "./lib/providers"

/**
 * Media configuration interface
 */
export interface MediaConfig {
  /**
   * Maximum file size in bytes
   */
  maxFileSize: number

  /**
   * Allowed file types (MIME types)
   */
  allowedFileTypes: string[]

  /**
   * Storage provider configuration
   */
  storage: StorageProviderConfig

  /**
   * Image processing options
   */
  imageProcessing: {
    /**
     * Whether to generate blurhash for images
     */
    generateBlurhash: boolean

    /**
     * Whether to resize images
     */
    resize: boolean

    /**
     * Maximum width for resized images
     */
    maxWidth?: number

    /**
     * Maximum height for resized images
     */
    maxHeight?: number

    /**
     * Image quality (1-100)
     */
    quality?: number
  }
}

/**
 * Default media configuration
 */
export const defaultMediaConfig: MediaConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "image/vnd.microsoft.icon",
    "image/x-icon",
    "image/avif",
    // TODO: add document support?
  ],
  storage: {
    provider: StorageProvider.LOCAL,
    basePath: "./public/uploads",
    baseUrl: "/uploads",
  },
  imageProcessing: {
    generateBlurhash: true,
    resize: true,
    maxWidth: 1080,
    maxHeight: 1080,
    quality: 90,
  },
}

/**
 * Get the current media configuration
 */
export function getMediaConfig(): MediaConfig {
  // For now, we'll use the default config with potential environment overrides
  const config = { ...defaultMediaConfig }

  // Override storage provider based on environment variables
  if (process.env.MEDIA_STORAGE_PROVIDER) {
    config.storage.provider = process.env
      .MEDIA_STORAGE_PROVIDER as StorageProvider
  }

  if (
    config.storage.provider === StorageProvider.S3 ||
    config.storage.provider === StorageProvider.R2
  ) {
    config.storage.region = process.env.AWS_REGION || "us-east-1"
    config.storage.bucket = process.env.AWS_S3_BUCKET || ""
    config.storage.accessKeyId = process.env.AWS_ACCESS_KEY_ID || ""
    config.storage.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || ""

    // For R2, add the custom endpoint
    if (
      config.storage.provider === StorageProvider.R2 &&
      process.env.R2_ENDPOINT
    ) {
      config.storage.endpoint = process.env.R2_ENDPOINT
      config.storage.customDomain = process.env.R2_CUSTOM_DOMAIN
    }

    // Configure CloudFront if available
    if (process.env.CLOUDFRONT_DOMAIN) {
      config.storage.cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN

      // Optional CloudFront signed URLs configuration
      if (
        process.env.CLOUDFRONT_KEY_PAIR_ID &&
        process.env.CLOUDFRONT_PRIVATE_KEY
      ) {
        config.storage.cloudFrontKeyPairId = process.env.CLOUDFRONT_KEY_PAIR_ID
        config.storage.cloudFrontPrivateKey = process.env.CLOUDFRONT_PRIVATE_KEY
      }
    }
  }

  return config
}
