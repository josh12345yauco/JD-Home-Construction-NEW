/**
 * Paginated result shape matching the previous Wix CMS service
 */
export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  hasNext: boolean;
  currentPage: number;
  pageSize: number;
  nextSkip: number | null;
}

export interface PaginationOptions {
  limit?: number;
  skip?: number;
}

const API_BASE = '';

function getApiUrl(collectionId: string, id?: string): string {
  const base = `${API_BASE}/api/cms/${collectionId}`;
  return id ? `${base}/${id}` : base;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

/**
 * CMS client that reads from local API (JSON-backed). Use in place of BaseCrudService.
 */
export const CmsClient = {
  async getAll<T>(
    collectionId: string,
    _includeRefs?: unknown,
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<T>> {
    const limit = Math.min(pagination?.limit ?? 50, 1000);
    const skip = pagination?.skip ?? 0;
    const url = `${getApiUrl(collectionId)}?skip=${skip}&limit=${limit}`;
    return fetchJson<PaginatedResult<T>>(url);
  },

  async getById<T>(collectionId: string, itemId: string): Promise<T | null> {
    try {
      const url = getApiUrl(collectionId, itemId);
      const item = await fetchJson<T>(url);
      return item;
    } catch {
      return null;
    }
  },
};
