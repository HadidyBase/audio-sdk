export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total?: number;
    page?: number;
    per_page?: number;
    has_next?: boolean;
    next_cursor?: string | null;
  };
}

export interface RequestOptions {
  signal?: AbortSignal;
  timeout?: number;
}

export type SortOrder = 'asc' | 'desc';

export interface ListParams {
  page?: number;
  per_page?: number;
  limit?: number;
  offset?: number;
  sort?: SortOrder;
}
