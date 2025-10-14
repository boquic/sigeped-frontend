import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- 1. Importa FormsModule

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- 2. Añádelo a los imports
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {
  @Output() pedidoSelected = new EventEmitter<any>();

  // Lista completa de todos los pedidos
  private allPedidos = [
    { id: '#12345', client: 'Sarah Johnson', date: '2024-09-15', status: 'Completado', total: 74000 },
    { id: '#12346', client: 'John Doe', date: '2024-09-14', status: 'En Progreso', total: 52500 },
    { id: '#12347', client: 'Jane Smith', date: '2024-09-13', status: 'Pendiente', total: 110000 },
    { id: '#12348', client: 'Peter Jones', date: '2024-09-12', status: 'Cancelado', total: 15000 },
    { id: '#12349', client: 'Emily Carter', date: '2024-09-11', status: 'Completado', total: 89000 },
    { id: '#12350', client: 'David Lane', date: '2024-09-10', status: 'Completado', total: 45000 },
    { id: '#12351', client: 'Olivia Green', date: '2024-09-09', status: 'En Progreso', total: 23000 },
    { id: '#12352', client: 'Ethan Clark', date: '2024-09-08', status: 'Completado', total: 67000 },
    { id: '#12353', client: 'Sophia Lewis', date: '2024-09-07', status: 'Cancelado', total: 31000 },
    { id: '#12354', client: 'Michael Brown', date: '2024-09-06', status: 'En Progreso', total: 92000 },
  ];
  
  // --- Propiedades para los Filtros ---
  searchTerm: string = '';
  statusFilter: string = 'Todos';
  filteredPedidos: any[] = [];

  // Propiedades de paginación
  historialDePedidos: any[] = [];
  currentPage = 1;
  itemsPerPage = 7; // Aumentamos para mostrar más por página
  totalPages = 0;

  ngOnInit(): void {
    this.applyFilters();
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
  seleccionarPedido(pedido: any): void {
    this.pedidoSelected.emit(pedido);
  }
}

