import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse } from '../models/auth.model';
import { AUTH_TOKEN_KEY } from '../constants/storage.constants';
import { ApiUrlService } from './api-url.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly apiUrl: ApiUrlService
  ) {}

  login(payload: LoginRequest): Observable<void> {
    return this.http.post<LoginResponse>(this.apiUrl.build('/api/auth/login'), payload).pipe(
      map((response) => {
        const token = this.extractToken(response);
        if (!token) {
          throw new Error('El backend no devolvio un token valido.');
        }
        sessionStorage.setItem(AUTH_TOKEN_KEY, token);
      })
    );
  }

  logout(redirectToLogin = true): void {
    this.clearToken();
    if (redirectToLogin) {
      this.router.navigate(['/login']);
    }
  }

  getToken(): string | null {
    return sessionStorage.getItem(AUTH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  clearToken(): void {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
  }

  private extractToken(response: LoginResponse): string | null {
    return response.token ?? response.accessToken ?? response.data?.token ?? response.data?.accessToken ?? null;
  }
}
