import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../http/api-client';
import { CreateOrderRequest, OrderResponse } from '../models/order.models';

@Injectable({ providedIn: 'root' })
export class OrdersService extends ApiClient {
  list(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(this.url('/api/v1/orders'));
  }

  create(req: CreateOrderRequest): Observable<void> {
    return this.http.post<void>(this.url('/api/v1/orders'), req);
  }
}
