import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Incident } from '../../domain/models/incident.entity';
import { IncidentActions } from './incident.actions';

export interface IncidentState extends EntityState<Incident> {
    isLoading: boolean;
    error: string | null;
    filters: {
        search: string;
        status: string | 'ALL';
        priority: string | 'ALL';
        severity: string | 'ALL';
    };
}

export const adapter: EntityAdapter<Incident> = createEntityAdapter<Incident>();

export const initialState: IncidentState = adapter.getInitialState({
    isLoading: false,
    error: null,
    filters: {
        search: '',
        status: 'ALL',
        priority: 'ALL',
        severity: 'ALL'
    }
});

export const incidentReducer = createReducer(
    initialState,
    on(IncidentActions.loadIncidents, (state) => ({ ...state, isLoading: true, error: null })),
    on(IncidentActions.loadIncidentsSuccess, (state, { incidents }) =>
        adapter.setAll(incidents, { ...state, isLoading: false })),
    on(IncidentActions.loadIncidentsFailure, (state, { error }) =>
        ({ ...state, isLoading: false, error })),

    on(IncidentActions.createIncidentSuccess, (state, { incident }) =>
        adapter.addOne(incident, state)),

    on(IncidentActions.updateIncidentSuccess,
        IncidentActions.assignIncidentSuccess,
        IncidentActions.resolveIncidentSuccess, (state, { incident }) =>
        adapter.updateOne({ id: incident.id, changes: incident }, state)),

    on(IncidentActions.deleteIncidentSuccess, (state, { id }) =>
        adapter.removeOne(id, state)),

    on(IncidentActions.updateFilters, (state, { filters }) => ({
        ...state,
        filters: { ...state.filters, ...filters }
    }))
);
