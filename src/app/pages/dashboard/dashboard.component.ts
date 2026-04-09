import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Make sure this line is here
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule], // <-- And make sure CommonModule is listed here
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit { 

  // ... (rest of your component code remains the same) ...

  private allPedidos = [
    { id: '#12345', client: 'Sarah Johnson', date: '2024-09-15', status: 'Completado', total: 74000, imageUrl: 'assets/plano_casa.jpg' },
    { id: '#12346', client: 'John Doe', date: '2024-09-14', status: 'En Progreso', total: 52500, imageUrl: 'assets/plano_casa.jpg' },
    { id: '#12347', client: 'Jane Smith', date: '2024-09-13', status: 'Pendiente', total: 110000, imageUrl: 'assets/plano_casa.jpg' },
    { id: '#12348', client: 'Peter Jones', date: '2024-09-12', status: 'Cancelado', total: 15000, imageUrl: 'assets/plano_casa.jpg' },
    { id: '#12349', client: 'Emily Carter', date: '2024-09-11', status: 'Completado', total: 89000, imageUrl: 'assets/plano_casa.jpg' },
    { id: '#12350', client: 'David Lane', date: '2024-09-10', status: 'Completado', total: 45000, imageUrl: 'assets/plano_casa.jpg' },
    { id: '#12351', client: 'Olivia Green', date: '2024-09-09', status: 'En Progreso', total: 23000, imageUrl: 'assets/plano_casa.jpg' },
    { id: '#12352', client: 'Ethan Clark', date: '2024-09-08', status: 'Completado', total: 67000, imageUrl: 'assets/plano_casa.jpg' },
    { id: '#12353', client: 'Sophia Lewis', date: '2024-09-07', status: 'Cancelado', total: 31000, imageUrl: 'assets/plano_casa.jpg' },
    { id: '#12354', client: 'Michael Brown', date: '2024-09-06', status: 'En Progreso', total: 92000, imageUrl: 'assets/plano_casa.jpg' },
  ];

  pedidosRecientes: any[] = [];
  notificaciones: any[] = [];
  stats = { total: 0, enProgreso: 0, pendientes: 0 };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.stats.total = this.allPedidos.length;
    this.stats.enProgreso = this.allPedidos.filter(p => p.status === 'En Progreso').length;
    this.stats.pendientes = this.allPedidos.filter(p => p.status === 'Pendiente').length;

    this.pedidosRecientes = [...this.allPedidos]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4);

    this.notificaciones = [
      { from: 'Olivia Green', message: 'Thanks for the updated quote...', time: '1h ago' },
      { from: 'Ethan Clark', message: 'Can we schedule a call...', time: '3h ago' },
      { from: 'Sophia Lewis', message: 'Please find the attached files', time: 'Yesterday' }
    ];
  }

  verDetallePedido(pedidoId: string): void {
    console.log('Navegar al detalle del pedido:', pedidoId);
    this.router.navigate(['/pedidos']);
  }

  verTodosPedidos(): void {
    this.router.navigate(['/pedidos']);
  }
}