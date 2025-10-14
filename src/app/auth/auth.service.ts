import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, switchMap, of } from 'rxjs';
import { API_BASE_URL } from '../config';
import { AuthStore, AuthUser } from './auth.store';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = API_BASE_URL;

  constructor(private http: HttpClient, private store: AuthStore) {}

  register(body: any) {
    return this.http.post(`${this.base}/auth/register`, body);
  }

  login(body: any) {
    return this.http.post<LoginResponse>(`${this.base}/auth/login`, body).pipe(
      tap(res => {
        this.store.setTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken });
      }),
      switchMap(() => this.me())
    );
  }

  me() {
    return this.http.get<AuthUser>(`${this.base}/auth/me`).pipe(
      tap(user => this.store.setUser(user))
    );
  }

  refresh() {
    const refreshToken = this.store.refreshToken;
    return this.http.post<LoginResponse>(`${this.base}/auth/refresh`, { refreshToken }).pipe(
      tap(res => this.store.setTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken }))
    );
  }

  logout() {
    const refreshToken = this.store.refreshToken;
    return this.http.post(`${this.base}/auth/logout`, { refreshToken }).pipe(
      tap(() => this.store.clear())
    );
  }

  forgotPassword(body: any) {
    return this.http.post(`${this.base}/auth/forgot-password`, body);
  }

  resetPassword(body: any) {
    return this.http.post(`${this.base}/auth/reset-password`, body);
  }
}
