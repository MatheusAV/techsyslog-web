import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { OrdersService } from '../../../core/services/orders.service';
import { OrderResponse } from '../../../core/models/order.models';

@Component({
  standalone: true,
  selector: 'app-orders-page',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="d-flex align-items-center justify-content-between mb-3">
    <div>
      <h4 class="mb-0">Pedidos</h4>
      <small class="text-muted">Crie e liste pedidos</small>
    </div>

    <button class="btn btn-outline-secondary" (click)="reload()" [disabled]="loading">
      {{ loading ? 'Carregando...' : 'Atualizar' }}
    </button>
  </div>

  <div class="row g-3">
    <!-- Form -->
    <div class="col-12 col-lg-4">
      <div class="card">
        <div class="card-body">
          <h6 class="card-title mb-3">Novo pedido</h6>

          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="mb-2">
              <label class="form-label">Número do Pedido</label>
              <input class="form-control" formControlName="orderNumber" placeholder="P001" />
              <small class="text-danger" *ngIf="invalid('orderNumber')">Obrigatório</small>
            </div>

            <div class="mb-2">
              <label class="form-label">Descrição</label>
              <input class="form-control" formControlName="description" placeholder="Notebook" />
              <small class="text-danger" *ngIf="invalid('description')">Obrigatório</small>
            </div>

            <div class="mb-2">
              <label class="form-label">Valor</label>
              <input class="form-control" type="number" formControlName="value" placeholder="3500" />
              <small class="text-danger" *ngIf="invalid('value')">Valor deve ser maior que zero</small>
            </div>

            <div class="mb-2">
              <label class="form-label">CEP</label>
              <input class="form-control" formControlName="cep" placeholder="01001000" />
              <small class="text-danger" *ngIf="invalid('cep')">Obrigatório</small>
            </div>

            <div class="mb-3">
              <label class="form-label">Número</label>
              <input class="form-control" formControlName="number" placeholder="100" />
              <small class="text-danger" *ngIf="invalid('number')">Obrigatório</small>
            </div>

            <button class="btn btn-primary w-100" [disabled]="form.invalid || submitting">
              {{ submitting ? 'Salvando...' : 'Criar pedido' }}
            </button>

            <div *ngIf="formError" class="alert alert-danger mt-3 mb-0">
              {{ formError }}
            </div>

            <div *ngIf="formSuccess" class="alert alert-success mt-3 mb-0">
              {{ formSuccess }}
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- List -->
    <div class="col-12 col-lg-8">
      <div class="card">
        <div class="card-body">
          <h6 class="card-title mb-3">Lista de pedidos</h6>

          <div *ngIf="error" class="alert alert-danger">
            {{ error }}
          </div>

          <div *ngIf="loading" class="text-muted">
            Carregando pedidos...
          </div>

          <div *ngIf="!loading && orders.length === 0" class="text-muted">
            Nenhum pedido encontrado.
          </div>

          <div class="table-responsive" *ngIf="!loading && orders.length > 0">
            <table class="table table-sm align-middle">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Endereço</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let o of orders">
                  <td><strong>{{ o.orderNumber }}</strong></td>
                  <td>{{ o.description }}</td>
                  <td>R$ {{ o.value | number:'1.2-2' }}</td>
                  <td>
                    <span class="badge"
                      [class.bg-secondary]="o.status !== 'Delivered'"
                      [class.bg-success]="o.status === 'Delivered'">
                      {{ o.status }}
                    </span>
                  </td>
                  <td class="text-muted">
                    {{ o.street }}, {{ o.number }} - {{ o.district }} / {{ o.city }} - {{ o.state }} ({{ o.cep }})
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  </div>
  `
})
export class OrdersPageComponent implements OnInit {
  orders: OrderResponse[] = [];
  loading = false;
  error: string | null = null;

  submitting = false;
  formError: string | null = null;
  formSuccess: string | null = null;
  form!: ReturnType<FormBuilder['group']>;
  

  constructor( private fb: FormBuilder, private ordersService: OrdersService) {

      this.form = this.fb.group({
    orderNumber: ['', [Validators.required]],
    description: ['', [Validators.required]],
    value: [null as number | null, [Validators.required, Validators.min(0.01)]],
    cep: ['', [Validators.required]],
    number: ['', [Validators.required]]
  });
  }

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.loading = true;
    this.error = null;

    this.ordersService.list().subscribe({
      next: (list) => (this.orders = list ?? []),
      error: (e) => (this.error = e?.message ?? 'Erro ao carregar pedidos.'),
      complete: () => (this.loading = false)
    });
  }

  invalid(field: string): boolean {
    const c = this.form.get(field);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.formError = null;
    this.formSuccess = null;

    const payload = this.form.getRawValue();

    this.ordersService.create({
      orderNumber: payload.orderNumber!,
      description: payload.description!,
      value: payload.value!,
      cep: payload.cep!,
      number: payload.number!
    }).subscribe({
      next: () => {
        this.form.reset();
        this.formSuccess = 'Pedido criado com sucesso.';
        this.reload();
      },
      error: (e) => {
        // Aqui o ErrorInterceptor já normaliza code/message
        this.formError = e?.message ?? 'Falha ao criar pedido.';
      },
      complete: () => (this.submitting = false)
    });
  }
}
