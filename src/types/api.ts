/** Shared API response shapes */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginationMeta {
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data:    T[];
  meta:    PaginationMeta;
}

export interface QueryParams {
  page?:  number;
  limit?: number;
  sort?:  string;
  order?: "asc" | "desc";
  q?:     string;
}

/** Generic async-state wrapper (for local component state) */
export interface AsyncState<T> {
  data:    T | null;
  loading: boolean;
  error:   string | null;
}
