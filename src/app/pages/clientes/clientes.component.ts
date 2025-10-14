import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  vistaActual: 'lista' | 'detalle' = 'lista';
  clienteSeleccionado: any = null;

  // --- DATOS PARA LA VISTA DE LISTA ---
  private allClientes = [
    { iniciales: 'EC', nombre: 'Emily Carter', email: 'emily.carter@example.com', telefono: '(555) 123-4567', proyectos: 9, estado: 'Activo' },
    { iniciales: 'DL', nombre: 'David Lee', email: 'david.lee@example.com', telefono: '(555) 234-5678', proyectos: 3, estado: 'Activo' },
    { iniciales: 'SL', nombre: 'Sophia Clark', email: 'sophia.clark@example.com', telefono: '(555) 345-6789', proyectos: 5, estado: 'Inactivo' },
    { iniciales: 'EW', nombre: 'Ethan Walker', email: 'ethan.walker@example.com', telefono: '(555) 456-7890', proyectos: 12, estado: 'Activo' },
    { iniciales: 'OR', nombre: 'Olivia Reed', email: 'olivia.reed@example.com', telefono: '(555) 567-8901', proyectos: 2, estado: 'Nuevo' },
  ];
  
  clientesFiltrados: any[] = [];
  searchTerm: string = '';

  // --- DATOS DE EJEMPLO PARA LA VISTA DE DETALLE ---
  clienteDetallado = {
    avatarUrl: 'https://placehold.co/150x150/28747B/FFFFFF?text=EC', // Placeholder
    info: {
      fechaRegistro: 'Enero 02, 2024',
      pedidosTotales: 9,
      metodoPago: 'Tarjeta de Crédito',
      tipoCliente: 'Particular',
      notas: 'Prefiere ser contactado por WhatsApp'
    },
    stats: {
      totalGastado: 485000,
      pedidosActivos: 2,
      ultimoPedido: 'Sep 30, 2025' // <-- ¡CAMBIO REALIZADO!
    },
    historialPedidos: [
      { fecha: 'Marzo 28, 2024', estado: 'Completado', descripcion: 'Cartón Pluma 5 mm' },
      { fecha: 'Junio 22, 2024', estado: 'Completado', descripcion: 'Poliestireno' },
      { fecha: 'Julio 22, 2024', estado: 'Completado', descripcion: 'Triplay Fino' },
      { fecha: 'Septiembre 30, 2025', estado: 'Pendiente', descripcion: 'Triplay Fino' },
    ],
    actividadReciente: [
      { fecha: 'Oct 10, 2025', desc: 'Llamada de seguimiento realizada.' },
      { fecha: 'Sep 30, 2025', desc: 'Nuevo pedido #12355 creado.' },
      { fecha: 'Sep 15, 2025', desc: 'Pago recibido por el pedido #12349.' },
    ]
  };

  ngOnInit(): void {
    this.clientesFiltrados = this.allClientes;
  }

  // --- Lógica de Navegación ---
  verDetalle(cliente: any): void {
    this.clienteSeleccionado = cliente;
    this.vistaActual = 'detalle';
  }

  volverALista(): void {
    this.vistaActual = 'lista';
    this.clienteSeleccionado = null;
  }

  // --- Lógica de Búsqueda ---
  filtrarClientes(): void {
    const busqueda = this.searchTerm.toLowerCase();
    if (!busqueda) {
      this.clientesFiltrados = this.allClientes;
    } else {
      this.clientesFiltrados = this.allClientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(busqueda) ||
        cliente.email.toLowerCase().includes(busqueda)
      );
    }
  }
}

