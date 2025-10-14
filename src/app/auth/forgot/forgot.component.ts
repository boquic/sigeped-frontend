import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot.component.html'
})
export class ForgotComponent {
  email = '';
  loading = false;
  message: string | null = null;
  error: string | null = null;

  constructor(private auth: AuthService) {}

  submit() {
    this.loading = true;
    this.message = null;
    this.error = null;
    this.auth.forgotPassword({ email: this.email }).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'Si el correo existe, se enviarán instrucciones.';
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Error enviando solicitud';
      }
    });
  }
}
