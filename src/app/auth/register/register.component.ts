import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  model: any = { username: '', email: '', password: '', telefono: '' };
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.loading = true;
    this.error = null;
    this.success = null;
    const payload = {
      username: this.model.username?.trim(),
      email: this.model.email?.trim().toLowerCase(),
      password: this.model.password,
      telefono: this.model.telefono?.toString().trim(),
      name: this.model.username?.trim(),
      phone: this.model.telefono?.toString().trim()
    };
    this.auth.register(payload).subscribe({
      next: () => {
        this.success = 'Registro exitoso. Ahora puedes iniciar sesión.';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/login']), 800);
      },
      error: (err) => {
        this.loading = false;
        const apiErr = err?.error;
        const firstValidation = Array.isArray(apiErr?.errors) ? (apiErr.errors[0]?.msg || apiErr.errors[0]?.message) : undefined;
        this.error = apiErr?.message || firstValidation || 'Error en registro';
      }
    });
  }
}
