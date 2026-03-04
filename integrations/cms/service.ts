import { CmsClient } from '@/lib/cms-client';
import type { WixDataItem } from '.';

/**
 * Pagination options for querying collections
 */
export interface PaginationOptions {
  limit?: number;
  skip?: number;
}

/**
 * Paginated result with metadata for infinite scroll
 */
export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  hasNext: boolean;
  currentPage: number;
  pageSize: number;
  nextSkip: number | null;
}

/**
 * CMS service backed by local API (JSON). Replaces Wix Data for Vercel deployment.
 */
export class BaseCrudService {
  static async getAll<T extends WixDataItem>(
    collectionId: string,
    _includeRefs?: unknown,
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<T>> {
    return CmsClient.getAll<T>(collectionId, _includeRefs, pagination);
  }

  static async getById<T extends WixDataItem>(
    collectionId: string,
    itemId: string,
    _includeRefs?: unknown
  ): Promise<T | null> {
    return CmsClient.getById<T>(collectionId, itemId);
  }

  static async create<T extends WixDataItem>(
    _collectionId: string,
    _itemData: Partial<T> | Record<string, unknown>,
    _multiReferences?: Record<string, unknown>
  ): Promise<T> {
    throw new Error('create() not implemented for static CMS');
  }

  static async update<T extends WixDataItem>(_collectionId: string, _itemData: T): Promise<T> {
    throw new Error('update() not implemented for static CMS');
  }

  static async delete<T extends WixDataItem>(_collectionId: string, _itemId: string): Promise<T> {
    throw new Error('delete() not implemented for static CMS');
  }
}
