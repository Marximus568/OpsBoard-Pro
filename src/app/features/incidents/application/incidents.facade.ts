import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { IncidentActions, CreateIncidentInput } from './state/incident.actions';
import { selectFilteredIncidents, selectIncidentsIsLoading, selectIncidentsError } from './state/incident.selectors';
import { Incident } from '../domain/models/incident.entity';
import { IncidentState } from './state/incident.reducer';

@Injectable({
    providedIn: 'root'
})
export class IncidentsFacade {
    private readonly store = inject(Store);

    readonly incidents$ = this.store.select(selectFilteredIncidents);
    readonly isLoading$ = this.store.select(selectIncidentsIsLoading);
    readonly error$ = this.store.select(selectIncidentsError);

    loadIncidents(): void {
        this.store.dispatch(IncidentActions.loadIncidents());
    }

    updateFilters(filters: Partial<IncidentState['filters']>): void {
        this.store.dispatch(IncidentActions.updateFilters({ filters }));
    }

    createIncident(incident: CreateIncidentInput): void {
        this.store.dispatch(IncidentActions.createIncident({ incident }));
    }

    updateIncident(incident: Incident): void {
        this.store.dispatch(IncidentActions.updateIncident({ incident }));
    }

    assignIncident(incidentId: string, assigneeId: string, userId: string): void {
        this.store.dispatch(IncidentActions.assignIncident({ incidentId, assigneeId, userId }));
    }

    resolveIncident(incidentId: string, userId: string, comment: string): void {
        this.store.dispatch(IncidentActions.resolveIncident({ incidentId, userId, comment }));
    }

    deleteIncident(id: string): void {
        this.store.dispatch(IncidentActions.deleteIncident({ id }));
    }
}
