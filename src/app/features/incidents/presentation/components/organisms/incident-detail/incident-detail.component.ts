import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Incident } from '../../../../domain/models/incident.entity';
import { BadgeComponent } from '../../../../../../shared/ui/atoms/badge/badge.component';
import { IconComponent } from '../../../../../../shared/ui/atoms/icon/icon.component';
import { IncidentsFacade } from '../../../../application/incidents.facade';
import { AuthFacade } from '../../../../../auth/application/auth.facade';
import { ButtonComponent } from '../../../../../../shared/ui/atoms/button/button.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-incident-detail',
    standalone: true,
    imports: [CommonModule, BadgeComponent, IconComponent, ButtonComponent, FormsModule],
    templateUrl: './incident-detail.component.html',
    styleUrls: ['./incident-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncidentDetailComponent {
    @Input({ required: true }) incident!: Incident;

    private readonly incidentsFacade = inject(IncidentsFacade);
    private readonly authFacade = inject(AuthFacade);

    protected resolutionComment = '';
    protected showResolveForm = false;

    onAssignToMe(): void {
        const currentUser = this.authFacade.user();
        if (currentUser) {
            this.incidentsFacade.assignIncident(this.incident.id, currentUser.id, currentUser.id);
        }
    }

    onResolve(): void {
        const currentUser = this.authFacade.user();
        if (currentUser && this.resolutionComment.trim()) {
            this.incidentsFacade.resolveIncident(this.incident.id, currentUser.id, this.resolutionComment);
            this.showResolveForm = false;
            this.resolutionComment = '';
        }
    }

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
