import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminState, adminFeatureKey } from './admin.reducer';

export const selectAdminState = createFeatureSelector<AdminState>(adminFeatureKey);

export const selectUsers = createSelector(selectAdminState, (state) => state.users);
export const selectRoles = createSelector(selectAdminState, (state) => state.roles);
export const selectFeatureFlags = createSelector(selectAdminState, (state) => state.featureFlags);
export const selectConfigurations = createSelector(selectAdminState, (state) => state.configurations);

export const selectIsLoading = createSelector(selectAdminState, (state) => state.isLoading);
export const selectError = createSelector(selectAdminState, (state) => state.error);
