import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IncidentState, adapter } from './incident.reducer';

export const selectIncidentState = createFeatureSelector<IncidentState>('incidents');

const {
    selectAll,
} = adapter.getSelectors();

export const selectAllIncidents = createSelector(
    selectIncidentState,
    selectAll
);

export const selectIncidentsIsLoading = createSelector(
    selectIncidentState,
    (state) => state.isLoading
);

export const selectIncidentsError = createSelector(
    selectIncidentState,
    (state) => state.error
);
