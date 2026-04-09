import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

const BYPASS_AUTH_ERROR_ENDPOINTS = ['/api/auth/login', '/api/web/form-context', '/api/upload-files'];

function shouldBypassAuthErrorHandling(url: string): boolean {
  return BYPASS_AUTH_ERROR_ENDPOINTS.some((path) => url.includes(path));
}

export const authErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
        if (!shouldBypassAuthErrorHandling(request.url)) {
          authService.logout(false);
          router.navigate(['/login']);
        }
      }

      return throwError(() => error);
    })
  );
};
