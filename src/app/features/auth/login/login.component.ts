import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
  <div class="container py-5" style="max-width: 420px;">
    <h3 class="mb-3">Login</h3>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="mb-3">
        <label class="form-label">E-mail</label>
        <input class="form-control" formControlName="email" type="email" />
      </div>

      <div class="mb-3">
        <label class="form-label">Senha</label>
        <input class="form-control" formControlName="password" type="password" />
      </div>

      <button class="btn btn-primary w-100" [disabled]="form.invalid || loading">
        {{ loading ? 'Entrando...' : 'Entrar' }}
      </button>

      <div *ngIf="error" class="alert alert-danger mt-3 mb-0">
        {{ error }}
      </div>

      <div class="text-center mt-3">
  <span class="text-muted">Não tem conta?</span>
 <a class="ms-1" routerLink="/register">Criar conta</a>
</div>
    </form>
  </div>
  `
})
export class LoginComponent {
  loading = false;
  error: string | null = null;
  form!: ReturnType<FormBuilder['group']>;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    // ✅ inicialização correta
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = null;

    const { email, password } = this.form.getRawValue();

    this.auth.login({ email: email!, password: password! }).subscribe({
      next: () => this.router.navigateByUrl('/orders'),
      error: (e) => {
        this.error = e?.message ?? 'Falha no login.';
        this.loading = false;
      },
      complete: () => (this.loading = false)
    });
  }
}
