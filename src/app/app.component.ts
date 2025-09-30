import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sigeped-frontend';
  showSidebar = true;
  isSidebarCollapsed = false; // Esta variable controlará el margen del contenido

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Simplificado para que sea más robusto
      this.showSidebar = !event.urlAfterRedirects.includes('/login');
    });
  }

  /**
   * ESTA ES LA FUNCIÓN QUE FALTABA
   * Se ejecuta cuando el sidebar emite el evento (toggleEvent).
   * @param isCollapsed El estado que envía el sidebar (true = colapsado)
   */
  onSidebarToggle(isCollapsed: boolean): void {
    this.isSidebarCollapsed = isCollapsed;
  }
}