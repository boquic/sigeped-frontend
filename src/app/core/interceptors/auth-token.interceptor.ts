import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

const PUBLIC_ENDPOINTS = [
  '/api/auth/login',
  '/api/openapi.json',
  '/api/web/customer-context',
  '/api/web/customer-register',
  '/api/web/customer-authenticate',
  '/api/web/form-context',
  '/api/upload-files'
];

function isPublicRequest(url: string): boolean {
  return PUBLIC_ENDPOINTS.some((publicPath) => url.includes(publicPath));
}

export const authTokenInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (!token || isPublicRequest(request.url)) {
    return next(request);
  }

  const authRequest = request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authRequest);
};
