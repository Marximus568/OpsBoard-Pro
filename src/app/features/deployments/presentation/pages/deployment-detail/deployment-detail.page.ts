import { Component, OnInit, inject, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DeploymentsFacade } from '../../../application/deployments.facade';
import { DeploymentDetailComponent } from '../../components/organisms/deployment-detail/deployment-detail.component';
import { Deployment } from '../../../domain/models/deployment.entity';
import { first } from 'rxjs';

@Component({
    selector: 'app-deployment-detail-page',
    standalone: true,
    imports: [CommonModule, DeploymentDetailComponent],
    template: `
        <div class="deployments-page">
            <header class="page-header">
                <div class="title-wrap">
                    <button class="back-btn" (click)="goBack()">
                        <span class="material-icons">arrow_back</span>
                    </button>
                    <div>
                        <h1>Detalle de Despliegue</h1>
                        <p class="subtitle">Estado y flujo de aprobación de la versión</p>
                    </div>
                </div>
            </header>

            <section class="content">
                @if (facade.selectedDeployment(); as selected) {
                    <app-deployment-detail 
                        [deployment]="selected"
                        (approve)="facade.approveDeployment($event, 'Aprobación manual')"
                        (reject)="facade.rejectDeployment($event, 'Rechazo manual')"
                        (execute)="facade.executeDeployment($event)">
                    </app-deployment-detail>
                } @else if (facade.loading$ | async) {
                   <div class="loading">Cargando detalles...</div>
                } @else {
                    <div class="error-state">
                        <p>No se encontró el despliegue solicitado.</p>
                        <button (click)="goBack()">Volver al listado</button>
                    </div>
                }
            </section>
        </div>
    `,
    styles: [`
        .deployments-page {
            padding: 2.5rem;
            display: flex;
            flex-direction: column;
            gap: 2.5rem;
        }
        .title-wrap {
            display: flex;
            align-items: center;
            gap: 1.5rem;
        }
        .back-btn {
            background: var(--surface-card);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            width: 42px;
            height: 42px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
            &:hover { background: var(--bg-icon-wrapper); }
        }
        .page-header h1 {
            font-size: 1.875rem;
            font-weight: 800;
            color: var(--text-primary);
            margin: 0;
            letter-spacing: -0.5px;
        }
        .subtitle {
            color: var(--text-secondary);
            margin-top: 0.25rem;
        }
        .content { min-height: 600px; }
        .loading, .error-state {
            padding: 4rem;
            text-align: center;
            color: var(--text-secondary);
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeploymentDetailPage implements OnInit, OnDestroy {
    protected readonly facade = inject(DeploymentsFacade);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.facade.selectDeployment(id);
            // Ensure deployments are loaded if arriving directly to detail
            this.facade.deployments$.pipe(first()).subscribe((deps: Deployment[]) => {
                if (deps.length === 0) {
                    this.facade.loadAll();
                }
            });
        }
    }

    ngOnDestroy(): void {
        this.facade.selectDeployment(null);
    }

    goBack(): void {
        this.router.navigate(['/deployments']);
    }
}
