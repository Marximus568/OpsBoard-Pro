import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Incident } from '../../../../../incidents/domain/models/incident.entity';
import { BadgeComponent, BadgeType } from '../../../../../../shared/ui/atoms/badge/badge.component';

@Component({
    selector: 'app-recent-incidents-list',
    standalone: true,
    imports: [CommonModule, BadgeComponent],
    template: `
        <div class="recent-incidents">
            <div class="header">
                <h3>Incidentes Recientes</h3>
                <span class="count">{{ incidents.length }} registrados</span>
            </div>
            
            <div class="table-container">
                <table class="modern-table">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Servicio</th>
                            <th>Prioridad</th>
                            <th>Estado</th>
                            <th>Creado</th>
                        </tr>
                    </thead>
                    <tbody>
                        @for (incident of incidents; track incident.id) {
                            <tr>
                                <td class="title-cell">
                                    <span class="title-text">{{ incident.title }}</span>
                                    <span class="id-tag">#{{ incident.id.slice(-4) }}</span>
                                </td>
                                <td>{{ incident.service }}</td>
                                <td>
                                    <span class="priority-indicator" [class]="incident.priority.value.toLowerCase()">
                                        {{ incident.priority.value }}
                                    </span>
                                </td>
                                <td>
                                    <app-badge [type]="getStatusType(incident.status.value)">
                                        {{ incident.status.value }}
                                    </app-badge>
                                </td>
                                <td class="date-cell">{{ incident.createdAt | date:'shortTime' }}</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    `,
    styles: [`
        .recent-incidents {
            background: var(--surface-secondary);
            border-radius: 16px;
            padding: 1.5rem;
            border: 1px solid var(--border-color);
            height: 100%;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;

            h3 {
                margin: 0;
                font-size: 1.125rem;
                font-weight: 700;
                color: var(--text-primary);
            }

            .count {
                font-size: 0.75rem;
                color: var(--text-secondary);
                background: rgba(255, 255, 255, 0.05);
                padding: 4px 10px;
                border-radius: 20px;
            }
        }

        .table-container {
            overflow-x: auto;
        }

        .modern-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.875rem;

            th {
                text-align: left;
                padding: 0.75rem 1rem;
                color: var(--text-secondary);
                font-weight: 600;
                border-bottom: 1px solid var(--border-color);
            }

            td {
                padding: 1rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.03);
            }

            tr:last-child td {
                border-bottom: none;
            }

            .title-cell {
                display: flex;
                flex-direction: column;
                gap: 2px;
                
                .title-text {
                    font-weight: 600;
                    color: var(--text-primary);
                }
                .id-tag {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    font-family: monospace;
                }
            }

            .priority-indicator {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-weight: 700;
                font-size: 0.75rem;

                &.critical { color: var(--status-error); }
                &.high { color: var(--status-warning); }
                &.medium { color: var(--status-progress); }
                &.low { color: var(--status-open); }
            }

            .date-cell {
                color: var(--text-secondary);
                white-space: nowrap;
            }
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentIncidentsListComponent {
    @Input({ required: true }) incidents: Incident[] = [];

    getStatusType(status: string): BadgeType {
        switch (status) {
            case 'OPEN': return 'default';
            case 'IN_PROGRESS': return 'primary';
            case 'RESOLVED': return 'success';
            case 'CLOSED': return 'info';
            default: return 'default';
        }
    }
}
