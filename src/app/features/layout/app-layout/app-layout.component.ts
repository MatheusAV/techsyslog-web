import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [CommonModule, RouterModule],
  template: `
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <a class="navbar-brand" routerLink="/orders">TechsysLog</a>

      <div class="navbar-nav">
        <a class="nav-link" routerLink="/orders" routerLinkActive="active">Pedidos</a>
        <a class="nav-link" routerLink="/deliveries" routerLinkActive="active">Entregas</a>
        <a class="nav-link" routerLink="/notifications" routerLinkActive="active">Notificações</a>
      </div>

      <button class="btn btn-outline-light ms-auto" (click)="logout()">Sair</button>
    </div>
  </nav>

  <div class="container py-4">
    <router-outlet />
  </div>
  `
})
export class AppLayoutComponent {
  constructor(private auth: AuthService) {}

  logout(): void {
    this.auth.logout();
    location.href = '/login';
  }
}
