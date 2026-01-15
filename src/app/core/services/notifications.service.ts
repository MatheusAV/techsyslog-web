import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from '../http/api-client';
import { NotificationResponse } from '../models/notification.models';

@Injectable({ providedIn: 'root' })
export class NotificationsService extends ApiClient {
    listMy(): Observable<NotificationResponse[]> {
        return this.http.get<NotificationResponse[]>(this.url('/api/v1/notifications/me'));
    }

    markAsRead(id: string): Observable<void> {
        return this.http.put<void>(this.url(`/api/v1/notifications/${id}/read`), null);
    }
}
