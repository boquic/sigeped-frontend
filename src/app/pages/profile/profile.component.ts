import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStore } from '../../auth/auth.store';
import { UserService } from '../../services/user.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  user$: any;
  userPing: string | null = null;
  adminPing: string | null = null;
  error: string | null = null;

  constructor(private store: AuthStore, private userSvc: UserService, private adminSvc: AdminService) {
    this.user$ = this.store.user$;
  }

  pingUser() {
    this.error = null; this.userPing = null;
    this.userSvc.ping().subscribe({
      next: (res: any) => this.userPing = JSON.stringify(res),
      error: (err) => this.error = err?.error?.message || 'Error en users/ping'
    });
  }

  pingAdmin() {
    this.error = null; this.adminPing = null;
    this.adminSvc.ping().subscribe({
      next: (res: any) => this.adminPing = JSON.stringify(res),
      error: (err) => this.error = err?.error?.message || 'Error en admin/ping'
    });
  }
}
