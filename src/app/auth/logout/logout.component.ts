import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  template: ''
})
export class LogoutComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.authService.logout(false);
    this.router.navigate(['/login']);
  }
}