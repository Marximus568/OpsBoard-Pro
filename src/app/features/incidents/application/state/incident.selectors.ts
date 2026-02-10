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
            const matchesService = filters.service === 'ALL' || incident.service.toLowerCase().includes(filters.service.toLowerCase());

            let matchesDate = true;
            if (filters.dateRange.start || filters.dateRange.end) {
                const incTime = incident.createdAt.getTime();
                if (filters.dateRange.start) {
                    matchesDate = matchesDate && incTime >= new Date(filters.dateRange.start).getTime();
                }
                if (filters.dateRange.end) {
                    const endDate = new Date(filters.dateRange.end);
                    endDate.setHours(23, 59, 59, 999);
                    matchesDate = matchesDate && incTime <= endDate.getTime();
                }
            }

            return matchesSearch && matchesStatus && matchesPriority && matchesSeverity && matchesService && matchesDate;
        });
    }
);
