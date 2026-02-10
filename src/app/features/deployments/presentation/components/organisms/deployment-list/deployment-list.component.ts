import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
                    <app-deployment-card 
                        [deployment]="dep" 
                        (click)="selectDeployment(dep.id)"
                        class="clickable-card">
                    </app-deployment-card>
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
        .clickable-card {
            cursor: pointer;
            transition: transform 0.2s ease;
            &:hover { transform: translateY(-4px); }
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
    private readonly router = inject(Router);

    ngOnInit(): void {
        this.facade.loadAll();
    }

    selectDeployment(id: string): void {
        this.router.navigate(['/deployments', id]);
    }
}
