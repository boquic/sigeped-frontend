import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { normalizeApiError } from '../../core/utils/api-error.util';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  onSubmit(event: Event): void {
    event.preventDefault();
    this.errorMessage = '';

    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Ingresa usuario y contrasena para continuar.';
      return;
    }

    this.isSubmitting = true;
    this.authService
      .login({
        username: this.username.trim(),
        password: this.password
      })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error: unknown) => {
          this.isSubmitting = false;
          const normalized = normalizeApiError(error);
          this.errorMessage = normalized.message;
          if (normalized.requestId) {
            console.error(`[requestId:${normalized.requestId}] ${normalized.message}`);
          }
        }
      });
  }
}