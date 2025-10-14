import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AuthTokens {
  accessToken: string | null;
  refreshToken: string | null;
}

export interface AuthUser {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private tokensSubject = new BehaviorSubject<AuthTokens>({ accessToken: null, refreshToken: null });
  tokens$ = this.tokensSubject.asObservable();

  private userSubject = new BehaviorSubject<AuthUser | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  get accessToken(): string | null { return this.tokensSubject.value.accessToken; }
  get refreshToken(): string | null { return this.tokensSubject.value.refreshToken; }
  get user(): AuthUser | null { return this.userSubject.value; }

  setTokens(tokens: Partial<AuthTokens>) {
    const next: AuthTokens = {
      accessToken: tokens.accessToken ?? this.tokensSubject.value.accessToken,
      refreshToken: tokens.refreshToken ?? this.tokensSubject.value.refreshToken,
    };
    this.tokensSubject.next(next);
    this.saveToStorage();
  }

  setUser(user: AuthUser | null) {
    this.userSubject.next(user);
    this.saveToStorage();
  }

  clear() {
    this.tokensSubject.next({ accessToken: null, refreshToken: null });
    this.userSubject.next(null);
    localStorage.removeItem('auth_tokens');
    localStorage.removeItem('auth_user');
  }

  private loadFromStorage() {
    try {
      const t = localStorage.getItem('auth_tokens');
      if (t) this.tokensSubject.next(JSON.parse(t));
      const u = localStorage.getItem('auth_user');
      if (u) this.userSubject.next(JSON.parse(u));
    } catch {}
  }

  private saveToStorage() {
    try {
      localStorage.setItem('auth_tokens', JSON.stringify(this.tokensSubject.value));
      localStorage.setItem('auth_user', JSON.stringify(this.userSubject.value));
    } catch {}
  }
}
