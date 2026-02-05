import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Incident } from '../../domain/models/incident.entity';
import { IncidentActions } from './incident.actions';

export interface IncidentState extends EntityState<Incident> {
    isLoading: boolean;
    error: string | null;
}

export const adapter: EntityAdapter<Incident> = createEntityAdapter<Incident>();

export const initialState: IncidentState = adapter.getInitialState({
    isLoading: false,
    error: null,
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

    on(IncidentActions.updateIncidentSuccess, (state, { incident }) =>
        adapter.updateOne({ id: incident.id, changes: incident }, state)),

    on(IncidentActions.deleteIncidentSuccess, (state, { id }) =>
        adapter.removeOne(id, state))
);
