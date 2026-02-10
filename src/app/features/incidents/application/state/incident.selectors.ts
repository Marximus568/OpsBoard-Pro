import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IncidentState, adapter } from './incident.reducer';
import { Incident } from '../../domain/models/incident.entity';

export const selectIncidentState = createFeatureSelector<IncidentState>('incidents');

export const selectAllIncidents = createSelector(
    selectIncidentState,
    (state: IncidentState) => state ? adapter.getSelectors().selectAll(state) : []
);

export const selectIncidentsIsLoading = createSelector(
    selectIncidentState,
    (state) => state?.isLoading ?? false
);

export const selectIncidentsError = createSelector(
    selectIncidentState,
    (state) => state?.error ?? null
);

export const selectIncidentFilters = createSelector(
    selectIncidentState,
    (state) => state?.filters ?? { search: '', status: 'ALL', priority: 'ALL', severity: 'ALL' }
);

export const selectFilteredIncidents = createSelector(
    selectAllIncidents,
    selectIncidentFilters,
    (incidents: Incident[], filters) => {
        return incidents.filter(incident => {
            const matchesSearch = !filters.search ||
                incident.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                incident.id.toLowerCase().includes(filters.search.toLowerCase());

            const matchesStatus = filters.status === 'ALL' || incident.status.value === filters.status;
            const matchesPriority = filters.priority === 'ALL' || incident.priority.value === filters.priority;
            const matchesSeverity = filters.severity === 'ALL' || incident.severity.value === filters.severity;

            return matchesSearch && matchesStatus && matchesPriority && matchesSeverity;
        });
    }
);
