import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, from } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { IncidentActions } from './incident.actions';

import { IINCIDENT_REPOSITORY } from '../../incidents.providers';

@Injectable()
export class IncidentEffects {
    private actions$ = inject(Actions);
    private readonly incidentRepo = inject(IINCIDENT_REPOSITORY);

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
}
