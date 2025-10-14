import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorialComponent } from '../historial/historial.component';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, HistorialComponent],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent {
  activeTab: 'historial' | 'detalle' = 'historial';
  selectedPedido: any = null;

  pedidoDetallado = {
    id: '#12345-#2024',
    client: 'Sarah Miller',
    progreso: 60,
    detalles: {
      nombre: 'Residencia moderna',
      tipo: 'Maqueta',
      tamano: '8,000 sq ft'
    },
    materiales: [
      { nombre: 'Concreto', cantidad: '50 cu yd', precioUnit: 120, total: 6000 },
      { nombre: 'Acero', cantidad: '10 tons', precioUnit: 800, total: 8000 },
      { nombre: 'Vidrio', cantidad: '2000 sq ft', precioUnit: 15, total: 30000 },
      { nombre: 'Madera', cantidad: '1500 sq ft', precioUnit: 20, total: 30000 },
    ],
    clienteInfo: {
      nombre: 'Cuentas Thomson',
      tipo: 'Usuario Activo',
      email: 'angle@uxstudiotrade.com',
      telefono: '(629) 555-0129',
      direccion: '123 Main Street, Anytown, USA 12345'
    }
    // La sección de notas ha sido eliminada
  };

  onPedidoSelected(pedido: any): void {
    this.selectedPedido = pedido;
    this.activeTab = 'detalle';
  }
}

