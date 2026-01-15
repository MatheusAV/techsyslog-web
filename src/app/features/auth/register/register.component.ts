import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="container py-5" style="max-width: 460px;">
    <h3 class="mb-3">Criar conta</h3>
    <p class="text-muted">Cadastre um novo usuário para acessar o sistema</p>

    <form [formGroup]="form" (ngSubmit)="submit()">

      <div class="mb-3">
        <label class="form-label">Nome</label>
        <input class="form-control" formControlName="name" />
        <small class="text-danger" *ngIf="invalid('name')">Nome obrigatório</small>
      </div>

      <div class="mb-3">
        <label class="form-label">E-mail</label>
        <input class="form-control" type="email" formControlName="email" />
        <small class="text-danger" *ngIf="invalid('email')">E-mail inválido</small>
      </div>

      <div class="mb-3">
        <label class="form-label">Senha</label>
        <input class="form-control" type="password" formControlName="password" />
        <small class="text-danger" *ngIf="invalid('password')">
          Senha mínima de 3 caracteres
        </small>
      </div>

      <button class="btn btn-primary w-100" [disabled]="form.invalid || loading">
        {{ loading ? 'Registrando...' : 'Registrar' }}
      </button>

      <div *ngIf="error" class="alert alert-danger mt-3 mb-0">
        {{ error }}
      </div>

      <div *ngIf="success" class="alert alert-success mt-3 mb-0">
        {{ success }}
      </div>

      <div class="text-center mt-3">
        <a routerLink="/login">Já tenho conta</a>
      </div>

    </form>
  </div>
  `
})
export class RegisterComponent {
  loading = false;
  error: string | null = null;
  success: string | null = null;
  form!: ReturnType<FormBuilder['group']>;


  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {

    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  invalid(field: string): boolean {
    const c = this.form.get(field);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    const payload = this.form.getRawValue();

    this.auth.register({
      name: payload.name!,
      email: payload.email!,
      password: payload.password!
    }).subscribe({
      next: () => {
        this.success = 'Usuário registrado com sucesso.';
        setTimeout(() => this.router.navigateByUrl('/login'), 1200);
      },
      error: (e) => {
        this.error = e?.message ?? 'Erro ao registrar usuário.';
        this.loading = false;
      },
      complete: () => (this.loading = false)
    });
  }
}