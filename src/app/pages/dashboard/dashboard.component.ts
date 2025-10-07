import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  // Datos de ejemplo para los pedidos
  pedidosRecientes = [
    {
      id: '#12345',
      client: 'Sarah Johnson',
      date: '2024-09-15',
      imageUrl: 'assets/plano_casa.jpg' // <-- Asegúrate de tener esta imagen en assets
    },
    {
      id: '#12346',
      client: 'John Doe',
      date: '2024-09-14',
      imageUrl: 'assets/plano_casa.jpg'
    },
    {
      id: '#12347',
      client: 'Jane Smith',
      date: '2024-09-13',
      imageUrl: 'assets/plano_casa.jpg'
    },
    {
      id: '#12348',
      client: 'Peter Jones',
      date: '2024-09-12',
      imageUrl: 'assets/plano_casa.jpg'
    },
    {
      id: '#12349',
      client: 'Alice Brown',
      date: '2024-09-11',
      imageUrl: 'assets/plano_casa.jpg'
    },
    {
      id: '#12350',
      client: 'David Green',
      date: '2024-09-10',
      imageUrl: 'assets/plano_casa.jpg'
    }
  ];

  // Datos de ejemplo para las notificaciones
  notificaciones = [
    {
      from: 'Olivia Green',
      message: 'Thanks for the updated quote. Let\'s proceed.',
      time: '1h ago'
    },
    {
      from: 'Ethan Clark',
      message: 'Can we schedule a call to discuss the project?',
      time: '3h ago'
    },
    {
      from: 'Sophia Lewis',
      message: 'Please find the attached files',
      time: 'Yesterday'
    }
  ];
}
