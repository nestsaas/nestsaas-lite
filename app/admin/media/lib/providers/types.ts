/**
 * Storage provider types and interfaces
 */

export enum StorageProvider {
  LOCAL = "LOCAL",
  S3 = "S3",
  R2 = "R2",
}

export interface UploadedFile {
  fileName: string
  mimeType: string
  fileSize: number
  width?: number
  height?: number
  url: string
  storageKey: string
  storageProvider: StorageProvider
  blurhash?: string
}

export interface StorageProviderConfig {
  provider: StorageProvider
  // Base configuration options
  basePath?: string
  baseUrl?: string
  // S3/R2 specific options
  region?: string
  bucket?: string
  accessKeyId?: string
  secretAccessKey?: string
  endpoint?: string // For R2
  customDomain?: string // For R2
  // CloudFront specific options
  cloudFrontDomain?: string
  cloudFrontKeyPairId?: string
  cloudFrontPrivateKey?: string
}

export interface StorageProviderInterface {
  /**
   * Upload a file to storage
   * @param file The file to upload
   * @param options Additional upload options
   */
  uploadFile(file: File, options?: UploadOptions): Promise<UploadedFile>

  /**
   * Delete a file from storage
   * @param storageKey The storage key of the file to delete
   */
  deleteFile(storageKey: string): Promise<boolean>

  /**
   * Get a URL for a file
   * @param storageKey The storage key of the file
   * @param options URL options (e.g. expiration for signed URLs)
   */
  getFileUrl(storageKey: string, options?: GetUrlOptions): Promise<string>
}

export interface UploadOptions {
  /**
   * Path within the storage where the file should be stored
   */
  path?: string

  /**
   * Custom filename to use instead of the original
   */
  fileName?: string

  /**
   * Whether to generate and include image metadata (width, height, blurhash, etc.)
   */
  generateMetadata?: boolean

  /**
   * Content type override
   */
  contentType?: string
}

export interface GetUrlOptions {
  /**
   * For signed URLs, how long the URL should be valid (in seconds)
   */
  expiresIn?: number

  /**
   * Whether to use a signed URL even if a direct URL is available
   */
  useSignedUrl?: boolean
}
