import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorPayload, ApiErrorView } from '../models/api-error.model';

function isApiErrorPayload(payload: unknown): payload is ApiErrorPayload {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const maybePayload = payload as Partial<ApiErrorPayload>;
  return maybePayload.success === false && !!maybePayload.error?.message;
}

export function normalizeApiError(error: unknown): ApiErrorView {
  if (error instanceof HttpErrorResponse) {
    if (isApiErrorPayload(error.error)) {
      return {
        message: error.error.error.message,
        code: error.error.error.code,
        requestId: error.error.requestId
      };
    }

    if (typeof error.error === 'string' && error.error.trim().length > 0) {
      return { message: error.error };
    }

    if (typeof error.message === 'string' && error.message.trim().length > 0) {
      return { message: error.message };
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return { message: error.message };
  }

  return { message: 'Ocurrio un error inesperado. Intentalo de nuevo.' };
}
