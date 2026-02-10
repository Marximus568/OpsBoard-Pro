import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuditState, auditFeatureKey } from './audit.reducer';

export const selectAuditState = createFeatureSelector<AuditState>(auditFeatureKey);

export const selectLogs = createSelector(selectAuditState, (state) => state.logs);
export const selectIsLoading = createSelector(selectAuditState, (state) => state.isLoading);
export const selectError = createSelector(selectAuditState, (state) => state.error);
