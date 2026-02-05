import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { Provider, InjectionToken, EnvironmentProviders } from '@angular/core';
import { incidentReducer } from './application/state/incident.reducer';
import { IncidentEffects } from './application/state/incident.effects';
import { IIncidentRepository } from './domain/contracts/incident.repository';
import { IncidentHttpRepository } from './infrastructure/repositories/incident-http.repository';

export const IINCIDENT_REPOSITORY = new InjectionToken<IIncidentRepository>('IINCIDENT_REPOSITORY');

export const INCIDENTS_PROVIDERS: (Provider | EnvironmentProviders)[] = [
    {
        provide: IINCIDENT_REPOSITORY,
        useClass: IncidentHttpRepository
    },
    provideState('incidents', incidentReducer),
    provideEffects(IncidentEffects)
];
