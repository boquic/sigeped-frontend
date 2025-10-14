import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IPedido {
  _id?: string;
  cliente: string;
  servicio: string;
  material: string;
  cantidad: number;
  estado?: string;
  fecha?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'http://localhost:3000/api/pedidos';

  constructor(private http: HttpClient) { }

  crearPedido(pedido: Omit<IPedido, '_id' | 'estado' | 'fecha'>): Observable<IPedido> {
    return this.http.post<IPedido>(this.apiUrl, pedido);
  }

  obtenerPedidos(): Observable<IPedido[]> {
    return this.http.get<IPedido[]>(this.apiUrl);
  }
}