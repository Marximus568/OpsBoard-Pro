import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeploymentsFacade } from '../../../../application/deployments.facade';
import { DeploymentCardComponent } from '../../molecules/deployment-card/deployment-card.component';

@Component({
    selector: 'app-deployment-list',
    standalone: true,
    imports: [CommonModule, DeploymentCardComponent],
    template: `
        @if (facade.deployments().length > 0) {
            <div class="deployment-list">
                @for (dep of facade.deployments(); track dep.id) {
                    <app-deployment-card [deployment]="dep"></app-deployment-card>
                }
            </div>
        } @else {
            <div class="empty-state">
                <p>No hay despliegues registrados.</p>
            </div>
        }
    `,
    styles: [`
        .deployment-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 1.5rem;
        }
        .empty-state {
            padding: 3rem;
            text-align: center;
            background: var(--surface-card);
            border-radius: 12px;
            border: 1px dashed var(--border-color);
            color: var(--text-secondary);
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeploymentListComponent implements OnInit {
    protected readonly facade = inject(DeploymentsFacade);

    ngOnInit(): void {
        this.facade.loadAll();
    }
}
