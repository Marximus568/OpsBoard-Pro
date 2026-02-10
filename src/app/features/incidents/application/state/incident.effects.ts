import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, from } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { IncidentActions } from './incident.actions';
import { IINCIDENT_REPOSITORY } from '../../incidents.providers';
import { CreateIncidentUseCase } from '../../domain/use-cases/create-incident.use-case';
import { AssignIncidentUseCase } from '../../domain/use-cases/assign-incident.use-case';
import { ResolveIncidentUseCase } from '../../domain/use-cases/resolve-incident.use-case';

@Injectable()
export class IncidentEffects {
    private actions$ = inject(Actions);
    private readonly incidentRepo = inject(IINCIDENT_REPOSITORY);

    // Initializing use cases (could also be provided via DI)
    private readonly createUseCase = new CreateIncidentUseCase(this.incidentRepo);
    private readonly assignUseCase = new AssignIncidentUseCase(this.incidentRepo);
    private readonly resolveUseCase = new ResolveIncidentUseCase(this.incidentRepo);

    loadIncidents$ = createEffect(() =>
        this.actions$.pipe(
            ofType(IncidentActions.loadIncidents),
            switchMap(() =>
                from(this.incidentRepo.getAll()).pipe(
                    map((incidents) => IncidentActions.loadIncidentsSuccess({ incidents })),
                    catchError((error) => of(IncidentActions.loadIncidentsFailure({ error: error.message })))
                )
            )
        )
    );

    createIncident$ = createEffect(() =>
        this.actions$.pipe(
            ofType(IncidentActions.createIncident),
            switchMap(({ incident }) =>
                from(this.createUseCase.execute(incident as any)).pipe(
                    map((newIncident) => IncidentActions.createIncidentSuccess({ incident: newIncident })),
                    catchError((error) => of(IncidentActions.createIncidentFailure({ error: error.message })))
                )
            )
        )
    );

    assignIncident$ = createEffect(() =>
        this.actions$.pipe(
            ofType(IncidentActions.assignIncident),
            switchMap(({ incidentId, assigneeId, userId }) =>
                from(this.assignUseCase.execute({ incidentId, assigneeId, userId })).pipe(
                    map((updatedIncident) => IncidentActions.assignIncidentSuccess({ incident: updatedIncident })),
                    catchError((error) => of(IncidentActions.assignIncidentFailure({ error: error.message })))
                )
            )
        )
    );

    resolveIncident$ = createEffect(() =>
        this.actions$.pipe(
            ofType(IncidentActions.resolveIncident),
            switchMap(({ incidentId, userId, comment }) =>
                from(this.resolveUseCase.execute({ incidentId, userId, comment })).pipe(
                    map((updatedIncident) => IncidentActions.resolveIncidentSuccess({ incident: updatedIncident })),
                    catchError((error) => of(IncidentActions.resolveIncidentFailure({ error: error.message })))
                )
            )
        )
    );
}
