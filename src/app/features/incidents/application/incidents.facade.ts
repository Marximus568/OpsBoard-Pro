import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { IncidentActions } from './state/incident.actions';
import { selectAllIncidents, selectIncidentsIsLoading, selectIncidentsError } from './state/incident.selectors';
import { Incident } from '../domain/models/incident.entity';

@Injectable({
    providedIn: 'root'
})
export class IncidentsFacade {
    private readonly store = inject(Store);

    readonly incidents$ = this.store.select(selectAllIncidents);
    readonly isLoading$ = this.store.select(selectIncidentsIsLoading);
    readonly error$ = this.store.select(selectIncidentsError);

    loadIncidents(): void {
        this.store.dispatch(IncidentActions.loadIncidents());
    }

    createIncident(incident: Partial<Incident>): void {
        this.store.dispatch(IncidentActions.createIncident({ incident }));
    }

    updateIncident(incident: Incident): void {
        this.store.dispatch(IncidentActions.updateIncident({ incident }));
    }

    deleteIncident(id: string): void {
        this.store.dispatch(IncidentActions.deleteIncident({ id }));
    }
}
