import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Deployment } from '../../../../domain/models/deployment.entity';
import { DeploymentStatus } from '../../../../domain/models/deployment-status.model';
import { BadgeComponent, BadgeType } from '../../../../../../shared/ui/atoms/badge/badge.component';
import { AuthFacade } from '../../../../../auth/application/auth.facade';
import { DeploymentsFacade } from '../../../../application/deployments.facade';

@Component({
    selector: 'app-deployment-detail',
    standalone: true,
    imports: [CommonModule, BadgeComponent],
    template: `
        @if (deployment) {
        <div class="deployment-detail">
            <div class="detail-header">
                <div class="title-section">
                    <h2>{{ deployment.service }} <span class="version">{{ deployment.version }}</span></h2>
                    <app-badge [type]="getEnvBadgeType(deployment.environment)">
                        {{ deployment.environment }}
                    </app-badge>
                </div>
                <div class="actions">
                    @if (canApprove() && auth.user()?.hasRole('role-admin')) {
                        <button class="btn-approve" (click)="approve.emit(deployment.id)">
                            <span class="material-icons">check_circle</span> Aprobar
                        </button>
                        <button class="btn-reject" (click)="reject.emit(deployment.id)">
                            <span class="material-icons">cancel</span> Rechazar
                        </button>
                    }
                    @if (deployment.status === 'APPROVED') {
                        <button class="btn-execute" (click)="execute.emit(deployment.id)">
                            <span class="material-icons">play_circle</span> Ejecutar Despliegue
                        </button>
                    }
                </div>
            </div>

            <div class="detail-grid">
                <!-- Workflow Timeline -->
                <div class="workflow-card">
                    <h3>Estado del Workflow</h3>
                    <div class="timeline">
                        @for (step of workflowSteps; track step.status) {
                            <div class="step" [class.active]="deployment.status === step.status"
                                 [class.completed]="isStepCompleted(step.status)">
                                <div class="node">
                                    <span class="material-icons">{{ getStepIcon(step.status) }}</span>
                                </div>
                                <div class="info">
                                    <span class="label">{{ step.label }}</span>
                                    @if (getHistoryEntry(step.status); as entry) {
                                        <span class="time">
                                            {{ entry.timestamp | date:'short' }} por {{ entry.userId }}
                                        </span>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>

                <!-- Logs Simulator -->
                <div class="logs-card">
                    <div class="card-header">
                        <h3>Logs de Ejecución</h3>
                        @if (deployment.status === 'RUNNING') {
                            <span class="pulse"></span>
                        }
                    </div>
                    <div class="terminal">
                        @for (log of deployment.logs; track log) {
                            <div class="log-line">
                                <span class="prefix">[{{ deployment.service }}]</span> {{ log }}
                            </div>
                        }
                        @if (deployment.status === 'RUNNING') {
                            <div class="log-line pulse-text">
                                > Aguardando salida del proceso...
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
        }
    `,
    styles: [`
        .deployment-detail {
            background: var(--surface-secondary);
            border-radius: 20px;
            padding: 2rem;
            border: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }

        .detail-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;

            h2 {
                margin: 0;
                font-size: 1.75rem;
                font-weight: 800;
                color: var(--text-primary);
                .version {
                    font-size: 1rem;
                    color: var(--color-primary-400);
                    background: rgba(79, 70, 229, 0.1);
                    padding: 4px 12px;
                    border-radius: 8px;
                    margin-left: 0.5rem;
                }
            }

            .env-tag {
                margin-top: 0.5rem;
                color: var(--text-secondary);
                font-weight: 600;
                letter-spacing: 1px;
                font-size: 0.75rem;
            }
        }

        .actions {
            display: flex;
            gap: 1rem;
            
            button {
                padding: 0.625rem 1.25rem;
                border-radius: 10px;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                cursor: pointer;
                transition: all 0.2s;
            }

            .btn-approve {
                background: var(--color-primary-600);
                color: var(--text-on-primary);
                border: none;
                &:hover { background: var(--color-primary-500); transform: translateY(-2px); }
            }

            .btn-reject {
                background: transparent;
                color: #ef4444;
                border: 1px solid #ef4444;
                &:hover { background: rgba(239, 68, 68, 0.1); }
            }

            .btn-execute {
                background: #10b981;
                color: var(--text-on-primary);
                border: none;
                &:hover { background: #059669; transform: translateY(-2px); }
            }
        }

        .detail-grid {
            display: grid;
            grid-template-columns: 350px 1fr;
            gap: 2rem;
        }

        .workflow-card, .logs-card {
            background: var(--bg-secondary);
            border-radius: 12px;
            padding: 1.5rem;
            border: 1px solid var(--border-color);

            h3 {
                margin: 0 0 1.5rem 0;
                font-size: 1rem;
                font-weight: 700;
                color: var(--text-secondary);
                text-transform: uppercase;
                letter-spacing: 1px;
            }
        }

        .timeline {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            
            .step {
                display: flex;
                gap: 1rem;
                opacity: 0.4;
                transition: opacity 0.3s;

                &.active { opacity: 1; .node { background: var(--color-primary-600); box-shadow: 0 0 15px var(--color-primary-600); } }
                &.completed { opacity: 1; .node { background: #10b981; } }

                .node {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: #334155;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    span { font-size: 18px; color: var(--text-on-primary); }
                }

                .info {
                    display: flex;
                    flex-direction: column;
                    .label { font-weight: 600; color: var(--text-primary); }
                    .time { font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px; }
                }
            }
        }

        .terminal {
            background: var(--surface-card);
            border-radius: 12px;
            padding: 1.5rem;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.875rem;
            min-height: 300px;
            color: var(--text-secondary);

            .log-line {
                margin-bottom: 0.5rem;
                .prefix { color: #6366f1; font-weight: 700; margin-right: 0.5rem; }
            }

            .pulse-text {
                color: var(--color-primary-400);
                animation: blink 1s infinite;
            }
        }

        @keyframes blink { 50% { opacity: 0.5; } }
        @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(2); opacity: 0; } }
        .pulse { width: 8px; height: 8px; background: #10b981; border-radius: 50%; display: inline-block; position: relative; }
        .pulse::after { content: ''; position: absolute; width: 100%; height: 100%; background: inherit; border-radius: inherit; animation: pulse 1.5s infinite; }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeploymentDetailComponent {
    @Input({ required: true }) deployment!: Deployment;
    @Output() approve = new EventEmitter<string>();
    @Output() reject = new EventEmitter<string>();
    @Output() execute = new EventEmitter<string>();

    protected readonly facade = inject(DeploymentsFacade);
    protected readonly auth = inject(AuthFacade);

    readonly workflowSteps = [
        { status: DeploymentStatus.REQUESTED, label: 'Solicitado' },
        { status: DeploymentStatus.REVIEW, label: 'En Revisión' },
        { status: DeploymentStatus.APPROVED, label: 'Aprobado' },
        { status: DeploymentStatus.RUNNING, label: 'Ejecutando' },
        { status: DeploymentStatus.SUCCESS, label: 'Completado' }
    ];

    getStepIcon(status: DeploymentStatus): string {
        switch (status) {
            case DeploymentStatus.REQUESTED: return 'send';
            case DeploymentStatus.REVIEW: return 'rate_review';
            case DeploymentStatus.APPROVED: return 'verified';
            case DeploymentStatus.RUNNING: return 'sync';
            case DeploymentStatus.SUCCESS: return 'task_alt';
            default: return 'help';
        }
    }

    isStepCompleted(status: DeploymentStatus): boolean {
        const order = this.workflowSteps.map(s => s.status);
        const currentIndex = order.indexOf(this.deployment.status);
        const stepIndex = order.indexOf(status);
        return stepIndex < currentIndex;
    }

    getHistoryEntry(status: DeploymentStatus) {
        return this.deployment.history.find(h => h.status === status);
    }

    canApprove(): boolean {
        return this.deployment.status === DeploymentStatus.REQUESTED ||
            this.deployment.status === DeploymentStatus.REVIEW;
    }

    getEnvBadgeType(env: string): BadgeType {
        switch (env) {
            case 'PRODUCTION': return 'error';
            case 'STAGING': return 'warning';
            default: return 'primary';
        }
    }
}
