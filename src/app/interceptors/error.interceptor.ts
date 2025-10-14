import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AuthStore } from '../auth/auth.store';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const store = inject(AuthStore);

  const alreadyRetried = req.headers.get('x-retried') === 'true';
  const isAuthEndpoint = /\/auth\/(login|register|refresh|forgot-password|reset-password)(\b|\/|\?|$)/.test(req.url);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !alreadyRetried && store.refreshToken && !isAuthEndpoint) {
        return auth.refresh().pipe(
          switchMap(() => {
            const retriedReq = req.clone({ setHeaders: { 'x-retried': 'true' } });
            return next(retriedReq);
          })
        );
      }

      if (error.status === 429) {
        console.error('Too many requests. Please wait and try again.');
      }

      if (error.status === 403) {
        console.error('Forbidden. You do not have permission.');
      }

      return throwError(() => error);
    })
  );
};
