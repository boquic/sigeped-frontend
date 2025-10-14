import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset.component.html'
})
export class ResetComponent {
  token = '';
  password = '';
  loading = false;
  message: string | null = null;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private auth: AuthService, private router: Router) {
    const t = this.route.snapshot.queryParamMap.get('token');
    if (t) this.token = t;
  }

  submit() {
    this.loading = true;
    this.message = null;
    this.error = null;
    this.auth.resetPassword({ token: this.token, password: this.password }).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'Contraseña actualizada. Puedes iniciar sesión.';
        setTimeout(() => this.router.navigate(['/login']), 800);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Error al restablecer contraseña';
      }
    });
  }
}
