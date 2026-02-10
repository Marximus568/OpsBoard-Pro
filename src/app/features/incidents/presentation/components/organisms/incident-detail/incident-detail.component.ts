import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Incident } from '../../../../domain/models/incident.entity';
import { BadgeComponent } from '../../../../../../shared/components/atoms/badge/badge.component';
import { IconComponent } from '../../../../../../shared/components/atoms/icon/icon.component';

@Component({
    selector: 'app-incident-detail',
    standalone: true,
    imports: [CommonModule, BadgeComponent, IconComponent],
    templateUrl: './incident-detail.component.html',
    styleUrls: ['./incident-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncidentDetailComponent {
    @Input({ required: true }) incident!: Incident;

    getSeverityType(): any {
        if (this.incident.severity.value === 'SEV1') return 'critical';
        if (this.incident.severity.value === 'SEV2') return 'error';
        return 'info';
    }

    getPriorityType(): any {
        const map: Record<string, string> = {
            'LOW': 'default',
            'MEDIUM': 'warning',
            'HIGH': 'error',
            'CRITICAL': 'critical'
        };
        return map[this.incident.priority.value] || 'default';
    }

    getStatusType(): any {
        const map: Record<string, string> = {
            'OPEN': 'default',
            'IN_PROGRESS': 'primary',
            'RESOLVED': 'success',
            'CLOSED': 'default'
        };
        return map[this.incident.status.value] || 'default';
    }

    getEventIcon(type: string): string {
        const map: Record<string, string> = {
            'CREATED': 'plus',
            'ASSIGNED': 'search',
            'RESOLVED': 'success',
            'STATUS_CHANGED': 'filter',
            'COMMENT_ADDED': 'alert'
        };
        return map[type] || 'alert';
    }
}
