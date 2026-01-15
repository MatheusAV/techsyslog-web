import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiClient } from '../http/api-client';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.models';
import { TokenStorageService } from './token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService extends ApiClient {
  constructor(private tokenStorage: TokenStorageService) { super(); }

  register(req: RegisterRequest): Observable<{ userId: string }> {
    return this.http.post<{ userId: string }>(this.url('/api/v1/auth/register'), req);
  }

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.url('/api/v1/auth/login'), req).pipe(
      tap(res => this.tokenStorage.setToken(res.accessToken))
    );
  }

  logout(): void {
    this.tokenStorage.clear();
  }
}
