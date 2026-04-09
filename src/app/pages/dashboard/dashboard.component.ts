import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Make sure this line is here
import { Router } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { OrderSummary } from '../../core/models/order.model';
import { normalizeApiError } from '../../core/utils/api-error.util';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule], // <-- And make sure CommonModule is listed here
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit { 
  pedidosRecientes: OrderSummary[] = [];
  notificaciones: any[] = [];
  isLoading = false;
  errorMessage = '';
  stats = { total: 0, enProgreso: 0, pendientes: 0 };

  constructor(
    private readonly router: Router,
    private readonly adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.loadAdminOrders();
    this.notificaciones = [
      { from: 'Olivia Green', message: 'Thanks for the updated quote...', time: '1h ago' },
      { from: 'Ethan Clark', message: 'Can we schedule a call...', time: '3h ago' },
      { from: 'Sophia Lewis', message: 'Please find the attached files', time: 'Yesterday' }
    ];
  }

  private loadAdminOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.adminService.getAdminOrders().subscribe({
      next: (orders) => {
        this.isLoading = false;
        this.stats.total = orders.length;
        this.stats.enProgreso = orders.filter((order) => order.status === 'En Progreso').length;
        this.stats.pendientes = orders.filter((order) => order.status === 'Pendiente').length;
        this.pedidosRecientes = [...orders]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 4);
      },
      error: (error: unknown) => {
        this.isLoading = false;
        const normalized = normalizeApiError(error);
        this.errorMessage = normalized.message;
        if (normalized.requestId) {
          console.error(`[requestId:${normalized.requestId}] ${normalized.message}`);
        }
      }
    });
  }

  verDetallePedido(pedidoId: string): void {
    console.log('Navegar al detalle del pedido:', pedidoId);
    this.router.navigate(['/pedidos']);
  }

  verTodosPedidos(): void {
    this.router.navigate(['/pedidos']);
  }
}