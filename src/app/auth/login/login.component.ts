import { Component } from '@angular/core';
import { Router } from '@angular/router';
// Asegúrate de que tu componente sea Standalone si así lo creaste
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-login',
  standalone: true, // Si tu proyecto es standalone
  imports: [CommonModule], // Si tu proyecto es standalone
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  // Inyecta el Router de Angular
  constructor(private router: Router) {}

  /**
   * Esta función se ejecuta cuando se presiona el botón "SIGUIENTE".
   */
  goToDashboard(event: Event) {
    event.preventDefault(); // Previene que la página se recargue
    console.log('Navegando al dashboard...');
    this.router.navigate(['/dashboard']); // ¡Aquí ocurre la magia!
  }
}