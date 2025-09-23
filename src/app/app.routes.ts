import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PedidosComponent } from './pages/pedidos/pedidos.component';
import { HistorialComponent } from './pages/historial/historial.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'pedidos', component: PedidosComponent },
  { path: 'historial', component: HistorialComponent },
  { path: '**', redirectTo: '/dashboard' }
];