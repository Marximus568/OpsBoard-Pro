import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { DeploymentActions } from './state/deployment.actions';
import { selectAllDeployments, selectDeploymentLoading, selectDeploymentError } from './state/deployment.selectors';
import { toSignal } from '@angular/core/rxjs-interop';

/**
 * Facade for the Deployments feature.
 * Encapsulates NgRx complexity and provides a clean API for the UI.
 */
@Injectable({
    providedIn: 'root'
})
export class DeploymentsFacade {
    private readonly store = inject(Store);

    // Reactive State
    readonly deployments$ = this.store.select(selectAllDeployments);
    readonly loading$ = this.store.select(selectDeploymentLoading);
    readonly error$ = this.store.select(selectDeploymentError);

    // Signals (Optional optimization for template use)
    readonly deployments = toSignal(this.deployments$, { initialValue: [] });

    /**
     * Triggers the loading of all deployments.
     */
    loadAll(): void {
        this.store.dispatch(DeploymentActions.loadDeployments());
    }

    /**
     * Requests a new deployment for a specific version and environment.
     */
    requestDeployment(version: string, environment: string): void {
        this.store.dispatch(DeploymentActions.requestDeployment({ version, environment }));
    }
}
