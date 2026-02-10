import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { auditFeatureKey, auditReducer } from './application/state/audit.reducer';
import { AuditEffects } from './application/state/audit.effects';

export const AUDIT_ROUTES: Routes = [
    {
        path: '',
        providers: [
            provideState(auditFeatureKey, auditReducer),
            provideEffects(AuditEffects)
        ],
        children: [
            {
                path: '',
                loadComponent: () => import('./presentation/pages/audit-log/audit-log.page').then(m => m.AuditLogPage)
            }
        ]
    }
];
