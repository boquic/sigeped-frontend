import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiUrlService } from './api-url.service';
import { OrderSummary, RawOrder } from '../models/order.model';
import { mapRawOrderToSummary } from '../../features/orders/orders.mapper';

interface AdminOrdersResponse {
  success?: boolean;
  orders?: RawOrder[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiUrl: ApiUrlService
  ) {}

  getAdminOrders(): Observable<OrderSummary[]> {
    return this.http.get<AdminOrdersResponse>(this.apiUrl.build('/api/admin/orders')).pipe(
      map((response) => (Array.isArray(response.orders) ? response.orders.map(mapRawOrderToSummary) : []))
    );
  }
}
