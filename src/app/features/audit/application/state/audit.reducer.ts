import { createReducer, on } from '@ngrx/store';
import { AuditLog } from '../../domain/models/audit-log.entity';
import { AuditActions } from './audit.actions';

export const auditFeatureKey = 'audit';

export interface AuditState {
    logs: AuditLog[];
    isLoading: boolean;
    error: string | null;
}

export const initialState: AuditState = {
    logs: [],
    isLoading: false,
    error: null,
};

export const auditReducer = createReducer(
    initialState,
    on(AuditActions.loadLogs, (state) => ({ ...state, isLoading: true, error: null })),
    on(AuditActions.loadLogsSuccess, (state, { logs }) => ({
        ...state,
        logs,
        isLoading: false
    })),
    on(AuditActions.loadLogsFailure, (state, { error }) => ({ ...state, isLoading: false, error }))
);
