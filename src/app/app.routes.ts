import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/layout/app-layout/app-layout.component').then(m => m.AppLayoutComponent),
    children: [
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/orders/orders-page/orders-page.component').then(m => m.OrdersPageComponent)
      },
      {
        path: 'deliveries',
        loadComponent: () =>
          import('./features/deliveries/deliveries-page/deliveries-page.component').then(m => m.DeliveriesPageComponent)
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./features/notifications/notifications-page/notifications-page.component').then(m => m.NotificationsPageComponent)
      },
      { path: '', pathMatch: 'full', redirectTo: 'orders' }
    ]
  },
  { path: '**', redirectTo: '' }
];
