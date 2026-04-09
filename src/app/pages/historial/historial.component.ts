import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- 1. Importa FormsModule
import { OrdersService } from '../../core/services/orders.service';
import { OrderSummary } from '../../core/models/order.model';
import { normalizeApiError } from '../../core/utils/api-error.util';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- 2. Añádelo a los imports
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {
  @Output() pedidoSelected = new EventEmitter<OrderSummary>();

  private allPedidos: OrderSummary[] = [];
  
  // --- Propiedades para los Filtros ---
  searchTerm: string = '';
  statusFilter: string = 'Todos';
  filteredPedidos: OrderSummary[] = [];

  // Propiedades de paginación
  historialDePedidos: OrderSummary[] = [];
  isLoading = false;
  errorMessage = '';
  currentPage = 1;
  itemsPerPage = 7; // Aumentamos para mostrar más por página
  totalPages = 0;

  constructor(private readonly ordersService: OrdersService) {}

  ngOnInit(): void {
    this.loadPendingOrders();
  }

  private loadPendingOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.ordersService.getPendingOrders().subscribe({
      next: (orders) => {
        this.isLoading = false;
        this.allPedidos = orders;
        this.applyFilters();
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

  // --- Lógica de Filtrado ---

  applyFilters(): void {
    let pedidos = this.allPedidos;

    // 1. Filtrar por término de búsqueda
    if (this.searchTerm) {
      const lowerCaseSearch = this.searchTerm.toLowerCase();
      pedidos = pedidos.filter(p => 
        p.id.toLowerCase().includes(lowerCaseSearch) || 
        p.client.toLowerCase().includes(lowerCaseSearch)
      );
    }

    // 2. Filtrar por estado
    if (this.statusFilter !== 'Todos') {
      pedidos = pedidos.filter(p => p.status === this.statusFilter);
    }

    this.filteredPedidos = pedidos;
    this.totalPages = Math.ceil(this.filteredPedidos.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePage();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(status: string): void {
    this.statusFilter = status;
    this.applyFilters();
  }
  
  // --- Lógica de Paginación ---
  
  updatePage(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.historialDePedidos = this.filteredPedidos.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePage();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePage();
    }
  }

  // --- Evento de Selección ---
  seleccionarPedido(pedido: OrderSummary): void {
    this.pedidoSelected.emit(pedido);
  }
}

