import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { from, of } from 'rxjs';
import { catchError, map, switchMap, tap, delay } from 'rxjs/operators';
import { DeploymentActions } from './deployment.actions';
import { IDEPLOYMENT_REPOSITORY } from '../../deployments.providers';
import { DeploymentStatus } from '../../domain/models/deployment-status.model';
import { AuditService } from '../../../../core/services/audit.service';

@Injectable()
export class DeploymentEffects {
    private readonly actions$ = inject(Actions);
    private readonly repository = inject(IDEPLOYMENT_REPOSITORY);
    private readonly auditService = inject(AuditService);

    loadDeployments$ = createEffect(() => this.actions$.pipe(
        ofType(DeploymentActions.loadDeployments),
        switchMap(() => from(this.repository.getAll()).pipe(
            map(deployments => DeploymentActions.loadDeploymentsSuccess({ deployments })),
            catchError((error: { message?: string }) => of(DeploymentActions.loadDeploymentsFailure({
                error: (error as Error).message || 'Unknown error'
            })))
        ))
    ));

    approveDeployment$ = createEffect(() => this.actions$.pipe(
        ofType(DeploymentActions.approveDeployment),
        switchMap(({ id, comment }) => from(this.repository.getById(id)).pipe(
            switchMap(deployment => {
                if (!deployment) return of(DeploymentActions.loadDeploymentsFailure({ error: 'Deployment not found' }));

                const approvedDep = deployment
                    .transitionTo(DeploymentStatus.APPROVED)
                    .addHistory({
                        status: DeploymentStatus.APPROVED,
                        timestamp: new Date(),
                        userId: 'admin-sim', // Simulations usually from admin
                        comment
                    });

                return from(this.repository.save(approvedDep)).pipe(
                    tap(() => {
                        this.auditService.log('APPROVE_DEPLOYMENT', 'DEPLOYMENT', 'admin-sim', { deploymentId: id, comment });
                    }),
                    map(() => DeploymentActions.loadDeployments()), // Refresh list
                    catchError(error => of(DeploymentActions.loadDeploymentsFailure({ error: error.message })))
                );
            })
        ))
    ));

    executeDeployment$ = createEffect(() => this.actions$.pipe(
        ofType(DeploymentActions.executeDeployment),
        switchMap(({ id }) => from(this.repository.getById(id)).pipe(
            switchMap(deployment => {
                if (!deployment) return of(DeploymentActions.executeDeploymentFailure({ error: 'Deployment not found' }));

                const runningDep = deployment
                    .transitionTo(DeploymentStatus.RUNNING)
                    .addLog('Initializing deployment engine...')
                    .addLog('Downloading artifacts...')
                    .addLog('Preparing environment...');

                // Log execution start
                this.auditService.log('EXECUTE_DEPLOYMENT_START', 'DEPLOYMENT', 'system', { deploymentId: id });

                return from(this.repository.save(runningDep)).pipe(
                    map(() => DeploymentActions.loadDeployments()),
                    delay(4000), // Simulate work
                    switchMap(() => from(this.repository.getById(id)).pipe(
                        switchMap(latest => {
                            if (!latest) return of(DeploymentActions.loadDeployments());

                            const secondPhaseDep = latest
                                .addLog('Executing database migrations...')
                                .addLog('Applying security patches...')
                                .addLog('Configuring horizontal scaling...');

                            return from(this.repository.save(secondPhaseDep)).pipe(
                                map(() => DeploymentActions.loadDeployments()),
                                delay(4000),
                                switchMap(() => from(this.repository.getById(id)).pipe(
                                    map(final => {
                                        if (!final) return DeploymentActions.loadDeployments();

                                        const successDep = final
                                            .transitionTo(DeploymentStatus.SUCCESS)
                                            .addLog('Deployment completed successfully.')
                                            .addLog(`Endpoint active: https://${final.service}.opsboard-pro.io`);

                                        this.auditService.log('EXECUTE_DEPLOYMENT_SUCCESS', 'DEPLOYMENT', 'system', { deploymentId: id });
                                        this.repository.save(successDep); // Keep silent save or chain
                                        return DeploymentActions.loadDeployments();
                                    })
                                ))
                            );
                        })
                    ))
                );
            })
        ))
    ));
}
