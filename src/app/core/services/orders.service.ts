import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiUrlService } from './api-url.service';
import { OrderSummary, RawOrder, ReviewOrderPayload, UpdateOrderPayload } from '../models/order.model';
import { mapRawOrderToSummary } from '../../features/orders/orders.mapper';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiUrl: ApiUrlService
  ) {}

  getPendingOrders(): Observable<OrderSummary[]> {
    return this.http.get<RawOrder[]>(this.apiUrl.build('/api/orders/pending')).pipe(
      map((orders) => (Array.isArray(orders) ? orders.map(mapRawOrderToSummary) : []))
    );
  }

  reviewOrder(orderId: string, payload: ReviewOrderPayload): Observable<unknown> {
    return this.http.post(this.apiUrl.build(`/api/orders/${orderId}/review`), payload);
  }

  updateOrder(orderId: string, payload: UpdateOrderPayload): Observable<unknown> {
    return this.http.post(this.apiUrl.build(`/api/orders/${orderId}/update`), payload);
  }
}
