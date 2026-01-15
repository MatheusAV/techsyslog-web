import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { TokenStorageService } from '../auth/token-storage.service';

export const authGuard = () => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  const tokenStorage = inject(TokenStorageService);

  // SSR: não existe localStorage → trate como não autenticado
  if (!isPlatformBrowser(platformId)) {
    return router.parseUrl('/login');
  }

  return tokenStorage.isAuthenticated()
    ? true
    : router.parseUrl('/login');
};
