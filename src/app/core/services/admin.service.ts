import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiUrlService } from './api-url.service';
import { OrderSummary, RawOrder } from '../models/order.model';
import { mapRawOrderToSummary } from '../../features/orders/orders.mapper';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiUrl: ApiUrlService
  ) {}

  getAdminOrders(): Observable<OrderSummary[]> {
    return this.http.get<RawOrder[]>(this.apiUrl.build('/api/admin/orders')).pipe(
      map((orders) => (Array.isArray(orders) ? orders.map(mapRawOrderToSummary) : []))
    );
  }
}
