import type { HttpClient } from './http.js';

export interface PaginationParams {
  page?: number;
  per_page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total?: number;
    page?: number;
    per_page?: number;
    has_more?: boolean;
  };
}

const MAX_PAGES = 1_000;

export async function* paginate<T>(
  client: HttpClient,
  path: string,
  params: Record<string, string | number | boolean | undefined | null> = {},
  pageSize = 50,
): AsyncGenerator<T> {
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    if (page > MAX_PAGES) {
      throw new Error(`paginate: exceeded maximum page limit (${MAX_PAGES}). The server may be returning incorrect pagination metadata.`);
    }

    const response = await client.get<PaginatedResponse<T>>(path, {
      ...params,
      page,
      per_page: pageSize,
    });

    const items = response.data ?? [];
    for (const item of items) {
      yield item;
    }

    hasMore = response.meta?.has_more === true || items.length === pageSize;
    page++;

    if (items.length === 0) break;
  }
}

export async function* paginateOffset<T>(
  client: HttpClient,
  path: string,
  params: Record<string, string | number | boolean | undefined | null> = {},
  pageSize = 50,
): AsyncGenerator<T> {
  let page = 0;
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    if (page > MAX_PAGES) {
      throw new Error(`paginateOffset: exceeded maximum page limit (${MAX_PAGES}). The server may be returning incorrect pagination metadata.`);
    }

    const response = await client.get<PaginatedResponse<T>>(path, {
      ...params,
      limit: pageSize,
      offset,
    });

    const items = response.data ?? [];
    for (const item of items) {
      yield item;
    }

    hasMore = items.length === pageSize;
    offset += items.length;
    page++;

    if (items.length === 0) break;
  }
}
