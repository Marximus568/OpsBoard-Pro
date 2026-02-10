import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { DeploymentActions } from './state/deployment.actions';
import {
    selectAllDeployments,
    selectDeploymentLoading,
    selectDeploymentError,
    selectActiveDeployment
} from './state/deployment.selectors';
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
    readonly selectedDeployment$ = this.store.select(selectActiveDeployment);

    // Signals
    readonly deployments = toSignal(this.deployments$, { initialValue: [] });
    readonly selectedDeployment = toSignal(this.selectedDeployment$, { initialValue: null });

    /**
     * Triggers the loading of all deployments.
     */
    loadAll(): void {
        this.store.dispatch(DeploymentActions.loadDeployments());
    }

    /**
     * Selects a deployment for detailed view.
     */
    selectDeployment(id: string | null): void {
        this.store.dispatch(DeploymentActions.selectDeployment({ id }));
    }

    /**
     * Approves a deployment with a comment.
     */
    approveDeployment(id: string, comment: string): void {
        this.store.dispatch(DeploymentActions.approveDeployment({ id, comment }));
    }

    /**
     * Rejects a deployment with a comment.
     */
    rejectDeployment(id: string, comment: string): void {
        this.store.dispatch(DeploymentActions.rejectDeployment({ id, comment }));
    }

    /**
     * Executes an approved deployment.
     */
    executeDeployment(id: string): void {
        this.store.dispatch(DeploymentActions.executeDeployment({ id }));
    }

    /**
     * Requests a new deployment for a specific version and environment.
     */
    requestDeployment(version: string, environment: string): void {
        this.store.dispatch(DeploymentActions.requestDeployment({ version, environment }));
    }
}
