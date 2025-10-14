import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from './auth.store';

export const AuthGuard: CanActivateFn = () => {
  const store = inject(AuthStore);
  const router = inject(Router);
  if (store.accessToken) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};

export const AdminGuard: CanActivateFn = () => {
  const store = inject(AuthStore);
  const router = inject(Router);
  const user = store.user;
  if (store.accessToken && user && user.role === 'admin') {
    return true;
  }
  router.navigate(['/dashboard']);
  return false;
};
