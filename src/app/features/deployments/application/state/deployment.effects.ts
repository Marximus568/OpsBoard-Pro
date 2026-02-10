import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of, timer } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
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
                        userId: 'admin',
                        comment
                    });

                return from(this.repository.save(approvedDep)).pipe(
                    tap(() => {
                        this.auditService.log('APPROVE_DEPLOYMENT', 'DEPLOYMENT', 'admin', { deploymentId: id, comment });
                    }),
                    map(() => DeploymentActions.loadDeployments()),
                    catchError(error => of(DeploymentActions.loadDeploymentsFailure({ error: error.message })))
                );
            })
        ))
    ));

    rejectDeployment$ = createEffect(() => this.actions$.pipe(
        ofType(DeploymentActions.rejectDeployment),
        switchMap(({ id, comment }) => from(this.repository.getById(id)).pipe(
            switchMap(deployment => {
                if (!deployment) return of(DeploymentActions.loadDeploymentsFailure({ error: 'Deployment not found' }));

                const rejectedDep = deployment
                    .transitionTo(DeploymentStatus.FAILED)
                    .addHistory({
                        status: DeploymentStatus.FAILED,
                        timestamp: new Date(),
                        userId: 'admin',
                        comment
                    })
                    .addLog(`Deployment rejected: ${comment}`);

                return from(this.repository.save(rejectedDep)).pipe(
                    tap(() => {
                        this.auditService.log('REJECT_DEPLOYMENT', 'DEPLOYMENT', 'admin', { deploymentId: id, comment });
                    }),
                    map(() => DeploymentActions.loadDeployments()),
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

                // Phase 1: Start running
                const runningDep = deployment
                    .transitionTo(DeploymentStatus.RUNNING)
                    .addHistory({
                        status: DeploymentStatus.RUNNING,
                        timestamp: new Date(),
                        userId: 'system',
                        comment: 'Deployment execution started'
                    })
                    .addLog('Initializing deployment engine...')
                    .addLog('Downloading artifacts...')
                    .addLog('Preparing environment...');

                this.auditService.log('EXECUTE_DEPLOYMENT_START', 'DEPLOYMENT', 'system', { deploymentId: id });

                return from(this.repository.save(runningDep)).pipe(
                    switchMap(() => {
                        // Refresh list to show RUNNING state
                        return timer(2000).pipe(
                            switchMap(() => from(this.repository.getById(id)).pipe(
                                switchMap(latest => {
                                    if (!latest) return of(DeploymentActions.loadDeployments());

                                    // Phase 2: Add more logs
                                    const phase2 = latest
                                        .addLog('Executing database migrations...')
                                        .addLog('Applying security patches...')
                                        .addLog('Configuring horizontal scaling...');

                                    return from(this.repository.save(phase2)).pipe(
                                        switchMap(() => timer(3000).pipe(
                                            switchMap(() => from(this.repository.getById(id)).pipe(
                                                switchMap(final => {
                                                    if (!final) return of(DeploymentActions.loadDeployments());

                                                    // Phase 3: Complete successfully
                                                    const successDep = final
                                                        .transitionTo(DeploymentStatus.SUCCESS)
                                                        .addHistory({
                                                            status: DeploymentStatus.SUCCESS,
                                                            timestamp: new Date(),
                                                            userId: 'system',
                                                            comment: 'All checks passed'
                                                        })
                                                        .addLog('Health checks passed.')
                                                        .addLog(`Endpoint active: https://${final.service}.opsboard-pro.io`)
                                                        .addLog('Deployment completed successfully.');

                                                    this.auditService.log('EXECUTE_DEPLOYMENT_SUCCESS', 'DEPLOYMENT', 'system', { deploymentId: id });

                                                    return from(this.repository.save(successDep)).pipe(
                                                        map(() => DeploymentActions.loadDeployments())
                                                    );
                                                })
                                            ))
                                        ))
                                    );
                                })
                            ))
                        );
                    }),
                    catchError(error => of(DeploymentActions.executeDeploymentFailure({ error: error.message })))
                );
            })
        ))
    ));
}

