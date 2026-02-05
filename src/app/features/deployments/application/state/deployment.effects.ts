import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { DeploymentActions } from './deployment.actions';
import { IDEPLOYMENT_REPOSITORY } from '../../deployments.providers';

@Injectable()
export class DeploymentEffects {
    private readonly actions$ = inject(Actions);
    private readonly repository = inject(IDEPLOYMENT_REPOSITORY);

    loadDeployments$ = createEffect(() => this.actions$.pipe(
        ofType(DeploymentActions.loadDeployments),
        switchMap(() => from(this.repository.getAll()).pipe(
            map(deployments => DeploymentActions.loadDeploymentsSuccess({ deployments })),
            catchError((error: { message?: string }) => of(DeploymentActions.loadDeploymentsFailure({
                error: (error as Error).message || 'Unknown error'
            })))
        ))
    ));
}
