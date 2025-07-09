import { LocalStorageProvider } from './local-provider';
import { S3StorageProvider } from './s3-provider';
import { StorageProvider, StorageProviderConfig, StorageProviderInterface } from './types';

/**
 * Factory for creating storage provider instances
 */
export class StorageProviderFactory {
  /**
   * Create a storage provider instance based on configuration
   */
  static createProvider(config: StorageProviderConfig): StorageProviderInterface {
    switch (config.provider) {
      case StorageProvider.LOCAL:
        return new LocalStorageProvider(config);
      case StorageProvider.S3:
      case StorageProvider.R2:
        return new S3StorageProvider(config);
      default:
        throw new Error(`Unsupported storage provider: ${config.provider}`);
    }
  }
}
