export interface ApiErrorPayload {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  requestId?: string;
  timestamp?: string;
}

export interface ApiErrorView {
  message: string;
  code?: string;
  requestId?: string;
}
