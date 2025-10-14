import { Component } from '@angular/core';
import { Router } from '@angular/router';
// Asegúrate de que tu componente sea Standalone si así lo creaste
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true, // Si tu proyecto es standalone
  imports: [CommonModule, FormsModule, RouterModule], // Si tu proyecto es standalone
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  model = { email: '', password: '' } as any;
  loading = false;
  error: string | null = null;
  cooldownUntil: number | null = null;

  get isCoolingDown(): boolean {
    return this.cooldownUntil !== null && Date.now() < this.cooldownUntil;
  }

  constructor(private router: Router, private auth: AuthService) {}

  submit() {
    if (this.loading || this.isCoolingDown) return;
    this.loading = true;
    this.error = null;
    const body = {
      identifier: this.model.email?.trim().toLowerCase(),
      password: this.model.password
    };
    this.auth.login(body).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        if (err?.status === 429) {
          const header = err?.headers?.get?.('Retry-After');
          let seconds = 30;
          if (header) {
            const num = Number(header);
            if (!Number.isNaN(num)) {
              seconds = Math.max(1, Math.floor(num));
            } else {
              const dateMs = Date.parse(header);
              if (!Number.isNaN(dateMs)) {
                seconds = Math.max(1, Math.ceil((dateMs - Date.now()) / 1000));
              }
            }
          }
          this.cooldownUntil = Date.now() + seconds * 1000;
          this.error = `Demasiados intentos. Intenta de nuevo en ${seconds}s`;
        } else {
          this.error = err?.error?.message || 'Credenciales inválidas';
        }
      }
    });
  }
}