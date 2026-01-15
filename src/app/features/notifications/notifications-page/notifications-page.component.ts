import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsService } from '../../../core/services/notifications.service';
import { NotificationResponse } from '../../../core/models/notification.models';
import { RealtimeService, RealtimeEvent } from '../../../core/services/realtime.service';

@Component({
  standalone: true,
  selector: 'app-notifications-page',
  imports: [CommonModule],
  template: `
  <div class="d-flex align-items-center justify-content-between mb-3">
    <div>
      <h4 class="mb-0">Notificações</h4>
      <small class="text-muted">Acompanhe eventos do sistema</small>
    </div>

    <div class="d-flex gap-2">
      <span class="badge"
        [class.bg-success]="realtimeConnected"
        [class.bg-secondary]="!realtimeConnected">
        Realtime: {{ realtimeConnected ? 'ON' : 'OFF' }}
      </span>

      <button class="btn btn-outline-secondary" (click)="reload()" [disabled]="loading">
        {{ loading ? 'Carregando...' : 'Atualizar' }}
      </button>
    </div>
  </div>

  <div *ngIf="realtimeMessage" class="alert alert-info">
    {{ realtimeMessage }}
  </div>

  <div *ngIf="error" class="alert alert-danger">
    {{ error }}
  </div>

  <div *ngIf="loading" class="text-muted">
    Carregando notificações...
  </div>

  <div *ngIf="!loading && notifications.length === 0" class="text-muted">
    Nenhuma notificação encontrada.
  </div>

  <div class="list-group" *ngIf="!loading && notifications.length > 0">
    <div class="list-group-item d-flex justify-content-between align-items-start"
         *ngFor="let n of notifications">
      <div class="me-3">
        <div class="d-flex align-items-center gap-2">
          <strong>{{ n.message }}</strong>
          <span class="badge"
                [class.bg-success]="n.isRead"
                [class.bg-warning]="!n.isRead">
            {{ n.isRead ? 'Lida' : 'Nova' }}
          </span>
        </div>
        <small class="text-muted">
          {{ n.createdAt | date:'dd/MM/yyyy HH:mm' }}
        </small>
      </div>

      <button class="btn btn-sm btn-outline-primary"
              *ngIf="!n.isRead"
              (click)="markAsRead(n.id)">
        Marcar como lida
      </button>
    </div>
  </div>
  `
})
export class NotificationsPageComponent implements OnInit, OnDestroy {
  notifications: NotificationResponse[] = [];
  loading = false;
  error: string | null = null;

  realtimeConnected = false;
  realtimeMessage: string | null = null;

  constructor(
    private notificationsService: NotificationsService,
    private realtime: RealtimeService
  ) { }

  ngOnInit(): void {
    this.reload();

    // Conecta realtime e recarrega quando chegar evento
    this.realtime.start((evt) => this.onRealtimeEvent(evt));

    // Mostra estado (sem polling pesado)
    setTimeout(() => this.realtimeConnected = this.realtime.isConnected(), 800);
  }

  ngOnDestroy(): void {
    // opcional: parar conexão ao sair da tela
    // se você preferir manter realtime no app todo, movemos isso para o layout depois
    this.realtime.stop();
  }

  reload(): void {
    this.loading = true;
    this.error = null;

    this.notificationsService.listMy().subscribe({
      next: (list) => (this.notifications = list ?? []),
      error: (e) => (this.error = e?.message ?? 'Erro ao carregar notificações.'),
      complete: () => (this.loading = false)
    });
  }

  markAsRead(id: string): void {
    this.notificationsService.markAsRead(id).subscribe({
      next: () => {
        // update local para UX rápida
        const item = this.notifications.find(x => x.id === id);
        if (item) item.isRead = true;
      },
      error: (e) => (this.error = e?.message ?? 'Erro ao marcar como lida.')
    });
  }

  private onRealtimeEvent(evt: RealtimeEvent): void {
    // feedback rápido pro usuário
    this.realtimeMessage = `Evento recebido em tempo real: ${evt.type}`;
    this.realtimeConnected = true;

    // recarrega para garantir consistência com backend
    this.reload();

    // some sozinho
    setTimeout(() => (this.realtimeMessage = null), 2500);
  }
}
