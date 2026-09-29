export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Array<{
    message: string;
    path?: string[];
    code?: string;
    origin?: string;
  }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}
