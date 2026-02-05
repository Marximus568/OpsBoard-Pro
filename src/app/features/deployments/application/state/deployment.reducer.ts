import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Deployment } from '../../domain/models/deployment.entity';
import { DeploymentActions } from './deployment.actions';

export interface DeploymentState extends EntityState<Deployment> {
    selectedId: string | null;
    loading: boolean;
    error: string | null;
}

export const adapter: EntityAdapter<Deployment> = createEntityAdapter<Deployment>();

export const initialDeploymentState: DeploymentState = adapter.getInitialState({
    selectedId: null,
    loading: false,
    error: null
});

export const deploymentReducer = createReducer(
    initialDeploymentState,
    on(DeploymentActions.loadDeployments, (state) => ({ ...state, loading: true, error: null })),
    on(DeploymentActions.loadDeploymentsSuccess, (state, { deployments }) =>
        adapter.setAll(deployments, { ...state, loading: false })),
    on(DeploymentActions.loadDeploymentsFailure, (state, { error }) =>
        ({ ...state, loading: false, error }))
);
