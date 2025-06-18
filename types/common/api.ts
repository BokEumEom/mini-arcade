// 에러 타입
export interface AppError {
  message: string;
  code?: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: AppError;
}

// 페이지네이션 타입
export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

// 날짜 범위 타입
export interface DateRange {
  startDate: Date;
  endDate: Date;
} 