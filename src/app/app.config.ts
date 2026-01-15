import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { APP_CONFIG, AppConfig } from './core/config/app-config';

import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

const config: AppConfig = {
  apiBaseUrl: 'https://localhost:7246',
  signalRHubUrl: 'https://localhost:7246/hubs/notifications'
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor, errorInterceptor])),
    { provide: APP_CONFIG, useValue: config }
  ]
};
