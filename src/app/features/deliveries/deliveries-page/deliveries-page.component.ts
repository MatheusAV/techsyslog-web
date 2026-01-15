import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DeliveriesService } from '../../../core/services/deliveries.service';

@Component({
  standalone: true,
  selector: 'app-deliveries-page',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="d-flex align-items-center justify-content-between mb-3">
    <div>
      <h4 class="mb-0">Entregas</h4>
      <small class="text-muted">Registre a entrega de um pedido</small>
    </div>
  </div>

  <div class="row g-3">
    <div class="col-12 col-lg-6">
      <div class="card">
        <div class="card-body">
          <h6 class="card-title mb-3">Registrar entrega</h6>

          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="mb-2">
              <label class="form-label">Número do Pedido</label>
              <input class="form-control" formControlName="orderNumber" placeholder="P001" />
              <small class="text-danger" *ngIf="invalid('orderNumber')">Obrigatório</small>
            </div>

            <div class="mb-3">
              <label class="form-label">Data/Hora da Entrega (opcional)</label>
              <input class="form-control" type="datetime-local" formControlName="deliveredAt" />
              <small class="text-muted">
                Se vazio, o backend usa a data atual (UTC).
              </small>
            </div>

            <button class="btn btn-primary w-100" [disabled]="form.invalid || submitting">
              {{ submitting ? 'Registrando...' : 'Registrar entrega' }}
            </button>

            <div *ngIf="error" class="alert alert-danger mt-3 mb-0">
              {{ error }}
            </div>

            <div *ngIf="success" class="alert alert-success mt-3 mb-0">
              {{ success }}
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="col-12 col-lg-6">
      <div class="card">
        <div class="card-body">
          <h6 class="card-title mb-2">Observação</h6>
          <p class="text-muted mb-0">
            Após registrar a entrega, vá em <strong>Pedidos</strong> e atualize a lista.
            O status do pedido deve aparecer como <span class="badge bg-success">Delivered</span>.
          </p>
        </div>
      </div>
    </div>
  </div>
  `
})
export class DeliveriesPageComponent {
  submitting = false;
  error: string | null = null;
  success: string | null = null;
  form!: ReturnType<FormBuilder['group']>;


  constructor(private fb: FormBuilder, private deliveries: DeliveriesService) {
    this.form = this.fb.group({
      orderNumber: ['', [Validators.required]],
      deliveredAt: [null as string | null] // datetime-local
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
    this.error = null;
    this.success = null;

    const { orderNumber, deliveredAt } = this.form.getRawValue();

    // datetime-local vem sem timezone; vamos mandar ISO se preenchido
    const payload = {
      orderNumber: orderNumber!,
      deliveredAt: deliveredAt ? new Date(deliveredAt).toISOString() : null
    };

    this.deliveries.register(payload).subscribe({
      next: () => {
        this.success = 'Entrega registrada com sucesso.';
        this.form.reset();
      },
      error: (e) => {
        this.error = e?.message ?? 'Falha ao registrar entrega.';
      },
      complete: () => (this.submitting = false)
    });
  }
}
