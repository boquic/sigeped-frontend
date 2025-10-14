import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../auth/auth.store';
import { API_BASE_URL } from '../config';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(AuthStore);
  const token = store.accessToken;

  // Only attach for our API base URL
  const isApi = req.url.startsWith(API_BASE_URL);
  const isAuthUnauthed = isApi && /\/auth\/(login|register|refresh|forgot-password|reset-password)(\b|\/|\?|$)/.test(req.url);

  // Preserve FormData content type if used
  const isFormData = req.body instanceof FormData;
  if (token && isApi) {
    if (!isAuthUnauthed) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          ...(isFormData ? {} : { 'Content-Type': 'application/json' })
        }
      });
    } else if (!isFormData) {
      req = req.clone({ setHeaders: { 'Content-Type': 'application/json' } });
    }
  } else if (isApi) {
    if (!isFormData) {
      req = req.clone({ setHeaders: { 'Content-Type': 'application/json' } });
    }
  }

  return next(req);
};
