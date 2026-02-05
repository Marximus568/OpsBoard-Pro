import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeploymentListComponent } from '../../components/organisms/deployment-list/deployment-list.component';

@Component({
    selector: 'app-deployments-page',
    standalone: true,
    imports: [CommonModule, DeploymentListComponent],
    template: `
        <div class="deployments-page">
            <header class="page-header">
                <h1>Despliegues</h1>
                <p class="subtitle">Historial y estado de las versiones en ejecución</p>
            </header>

            <section class="content">
                <app-deployment-list></app-deployment-list>
            </section>
        </div>
    `,
    styles: [`
        .deployments-page {
            padding: 2rem;
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }
        .page-header h1 {
            font-size: 1.875rem;
            font-weight: 700;
            color: var(--text-primary);
            margin: 0;
        }
        .subtitle {
            color: var(--text-secondary);
            margin-top: 0.25rem;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeploymentsPage { }
