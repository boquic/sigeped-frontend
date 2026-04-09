import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorialComponent } from '../historial/historial.component';
import { OrdersService } from '../../core/services/orders.service';
import { OrderSummary } from '../../core/models/order.model';
import { normalizeApiError } from '../../core/utils/api-error.util';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, HistorialComponent],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent {
  activeTab: 'historial' | 'detalle' = 'historial';
  selectedPedido: OrderSummary | null = null;
  actionMessage = '';
  errorMessage = '';
  isSubmittingAction = false;

  private readonly fallbackMateriales = [
    { nombre: 'Concreto', cantidad: '50 cu yd', precioUnit: 120, total: 6000 },
    { nombre: 'Acero', cantidad: '10 tons', precioUnit: 800, total: 8000 },
    { nombre: 'Vidrio', cantidad: '2000 sq ft', precioUnit: 15, total: 30000 },
    { nombre: 'Madera', cantidad: '1500 sq ft', precioUnit: 20, total: 30000 }
  ];

  pedidoDetallado = {
    id: '#12345-#2024',
    client: 'Sarah Miller',
    progreso: 60,
    detalles: {
      nombre: 'Residencia moderna',
      tipo: 'Maqueta',
      tamano: '8,000 sq ft'
    },
    materiales: [...this.fallbackMateriales],
    clienteInfo: {
      nombre: 'Cuentas Thomson',
      tipo: 'Usuario Activo',
      email: 'angle@uxstudiotrade.com',
      telefono: '(629) 555-0129',
      direccion: '123 Main Street, Anytown, USA 12345'
    }
  };

  constructor(private readonly ordersService: OrdersService) {}

  onPedidoSelected(pedido: OrderSummary): void {
    this.selectedPedido = pedido;
    this.pedidoDetallado = {
      ...this.pedidoDetallado,
      id: pedido.id,
      client: pedido.client,
      progreso: pedido.progress,
      detalles: {
        nombre: pedido.projectName,
        tipo: pedido.projectType,
        tamano: pedido.projectSize
      },
      clienteInfo: {
        nombre: pedido.client,
        tipo: 'Cliente Activo',
        email: pedido.customerEmail,
        telefono: pedido.customerPhone,
        direccion: pedido.customerAddress
      }
    };
    this.actionMessage = '';
    this.errorMessage = '';
    this.activeTab = 'detalle';
  }

  reviewSelectedOrder(): void {
    if (!this.selectedPedido || this.isSubmittingAction) {
      return;
    }

    this.isSubmittingAction = true;
    this.actionMessage = '';
    this.errorMessage = '';

    this.ordersService
      .reviewOrder(this.selectedPedido.id, { decision: 'approved', comments: 'Revision aprobada desde SIGEPED frontend' })
      .subscribe({
        next: () => {
          this.isSubmittingAction = false;
          this.actionMessage = 'Revision registrada correctamente.';
        },
        error: (error: unknown) => {
          this.isSubmittingAction = false;
          const normalized = normalizeApiError(error);
          this.errorMessage = normalized.message;
          if (normalized.requestId) {
            console.error(`[requestId:${normalized.requestId}] ${normalized.message}`);
          }
        }
      });
  }

  updateSelectedOrderStatus(): void {
    if (!this.selectedPedido || this.isSubmittingAction) {
      return;
    }

    this.isSubmittingAction = true;
    this.actionMessage = '';
    this.errorMessage = '';

    this.ordersService
      .updateOrder(this.selectedPedido.id, { status: 'Completado' })
      .subscribe({
        next: () => {
          this.isSubmittingAction = false;
          this.actionMessage = 'Estado del pedido actualizado correctamente.';
          this.selectedPedido = { ...this.selectedPedido!, status: 'Completado', progress: 100 };
          this.pedidoDetallado = { ...this.pedidoDetallado, progreso: 100 };
        },
        error: (error: unknown) => {
          this.isSubmittingAction = false;
          const normalized = normalizeApiError(error);
          this.errorMessage = normalized.message;
          if (normalized.requestId) {
            console.error(`[requestId:${normalized.requestId}] ${normalized.message}`);
          }
        }
      });
  }
}

