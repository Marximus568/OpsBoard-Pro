import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuditActions } from './state/audit.actions';
import { selectLogs, selectIsLoading, selectError } from './state/audit.selectors';

@Injectable({
    providedIn: 'root'
})
export class AuditFacade {
    private readonly store = inject(Store);

    readonly logs = this.store.selectSignal(selectLogs);
    readonly isLoading = this.store.selectSignal(selectIsLoading);
    readonly error = this.store.selectSignal(selectError);

    loadLogs(): void {
        this.store.dispatch(AuditActions.loadLogs());
    }
}
