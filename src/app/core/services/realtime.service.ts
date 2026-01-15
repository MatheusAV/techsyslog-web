import { Injectable, inject } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { APP_CONFIG } from '../config/app-config';
import { TokenStorageService } from '../auth/token-storage.service';

export interface RealtimeEvent {
    type: string;
    payload?: unknown;
}

@Injectable({ providedIn: 'root' })
export class RealtimeService {
    private cfg = inject(APP_CONFIG);
    private tokenStorage = inject(TokenStorageService);

    private connection: HubConnection | null = null;

    isConnected(): boolean {
        return !!this.connection && this.connection.state === 'Connected';
    }

    start(onEvent: (evt: RealtimeEvent) => void): void {
        const token = this.tokenStorage.getToken();
        if (!token) return; // sem token não conecta

        if (this.connection) return; // já inicializado

        this.connection = new HubConnectionBuilder()
            .withUrl(this.cfg.signalRHubUrl, {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Warning)
            .build();

        this.connection.on('event', (evt: RealtimeEvent) => {
            onEvent(evt);
        });

        this.connection.start().catch(() => {
            // evita quebrar a UI se o hub estiver indisponível
            // (o sistema continua funcionando sem realtime)
        });
    }

    stop(): void {
        if (!this.connection) return;
        this.connection.stop().catch(() => { });
        this.connection = null;
    }
}
