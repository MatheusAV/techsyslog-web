import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export interface ApiErrorPayload {
  error: {
    code: string;
    message: string;
  };
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // Backend padroniza: { error: { code, message } }
      const payload = err.error as ApiErrorPayload | undefined;

      const code =
        payload?.error?.code ??
        (err.status === 0 ? 'NETWORK' : `HTTP_${err.status}`);

      const message =
        payload?.error?.message ??
        (err.status === 0 ? 'Falha de rede / API indisponível.' : 'Erro inesperado.');

      // Devolve um erro normalizado para a UI
      return throwError(() => ({
        status: err.status,
        code,
        message,
        raw: err
      }));
    })
  );
};
