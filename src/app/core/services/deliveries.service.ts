import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../http/api-client';
import { RegisterDeliveryRequest } from '../models/delivery.models';

@Injectable({ providedIn: 'root' })
export class DeliveriesService extends ApiClient {
    register(req: RegisterDeliveryRequest): Observable<void> {
        return this.http.post<void>(this.url('/api/v1/deliveries'), req);
    }
}
