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
    styleUrls: ['./recent-incidents-list.component.scss'],
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
