import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DeploymentState, adapter } from './deployment.reducer';

export const selectDeploymentState = createFeatureSelector<DeploymentState>('deployments');

const {
    selectAll
} = adapter.getSelectors();

export const selectAllDeployments = createSelector(
    selectDeploymentState,
    selectAll
);

export const selectDeploymentLoading = createSelector(
    selectDeploymentState,
    (state) => state.loading
);

export const selectDeploymentError = createSelector(
    selectDeploymentState,
    (state) => state.error
);
