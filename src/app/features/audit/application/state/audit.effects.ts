import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuditHttpRepository } from '../../infrastructure/repositories/audit-http.repository';
import { AuditActions } from './audit.actions';
import { catchError, map, switchMap, of } from 'rxjs';

@Injectable()
export class AuditEffects {
    private readonly actions$ = inject(Actions);
    private readonly auditRepository = inject(AuditHttpRepository);

    loadLogs$ = createEffect(() => this.actions$.pipe(
        ofType(AuditActions.loadLogs),
        switchMap(() =>
            this.auditRepository.getLogs().pipe(
                map(logs => AuditActions.loadLogsSuccess({ logs })),
                catchError(error => of(AuditActions.loadLogsFailure({ error: error.message })))
            )
        )
    ));
}
