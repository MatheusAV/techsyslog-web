import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const TOKEN_KEY = 'techsyslog.token';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private platformId = inject(PLATFORM_ID);

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  setToken(token: string): void {
    if (!this.isBrowser) return;
    localStorage.setItem(TOKEN_KEY, token);
  }

  clear(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
