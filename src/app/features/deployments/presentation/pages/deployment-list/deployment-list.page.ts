import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeploymentListComponent } from '../../components/organisms/deployment-list/deployment-list.component';
import { DeploymentsFacade } from '../../../application/deployments.facade';


@Component({
    selector: 'app-deployment-list-page',
    standalone: true,
    imports: [CommonModule, DeploymentListComponent],
    template: `
        <div class="deployments-page">
            <header class="page-header">
                <div class="title-wrap">
                    <h1>Despliegues</h1>
                    <p class="subtitle">Historial y estado de las versiones en ejecución</p>
                </div>
            </header>

            <section class="content">
                <app-deployment-list></app-deployment-list>
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
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeploymentListPage {
    protected readonly facade = inject(DeploymentsFacade);
}
