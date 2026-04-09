import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app/app.routes';
import { requestIdInterceptor } from './app/core/interceptors/request-id.interceptor';
import { authTokenInterceptor } from './app/core/interceptors/auth-token.interceptor';
import { authErrorInterceptor } from './app/core/interceptors/auth-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([requestIdInterceptor, authTokenInterceptor, authErrorInterceptor]))
  ]
};