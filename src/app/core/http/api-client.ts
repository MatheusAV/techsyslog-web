import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../config/app-config';

export abstract class ApiClient {
  protected http = inject(HttpClient);
  private config = inject<AppConfig>(APP_CONFIG);

  protected url(path: string): string {
    return `${this.config.apiBaseUrl}${path}`;
  }
}
