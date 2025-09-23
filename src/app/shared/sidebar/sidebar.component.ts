import { Component } from '@angular/core';
import { NgClass } from '@angular/common'; // ← ¡IMPORTA NgClass!

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass], // ← ¡AÑÁDELO AQUÍ!
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  onNewOrder() {
    alert('¡Función de Nuevo Pedido aún no implementada!');
  }
}