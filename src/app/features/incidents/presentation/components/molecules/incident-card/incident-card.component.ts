import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BadgeComponent, BadgeType } from '../../../../../../shared/ui/atoms/badge/badge.component';
import { Incident } from '../../../../domain/models/incident.entity';

@Component({
  selector: 'app-incident-card',
  standalone: true,
  imports: [CommonModule, BadgeComponent, RouterModule],
  templateUrl: './incident-card.component.html',
  styleUrls: ['./incident-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncidentCardComponent {
  @Input({ required: true }) incident!: Incident;

  getPriorityType(): BadgeType {
    const map: Record<string, BadgeType> = {
      'LOW': 'primary',
      'MEDIUM': 'warning',
      'HIGH': 'error',
      'CRITICAL': 'critical'
    };
    return map[this.incident.priority.value] || 'default';
  }

  getStatusType(): BadgeType {
    const map: Record<string, BadgeType> = {
      'OPEN': 'default',
      'IN_PROGRESS': 'primary',
      'RESOLVED': 'success',
      'CLOSED': 'default'
    };
    return map[this.incident.status.value] || 'default';
  }

  getSeverityType(): BadgeType {
    if (this.incident.severity.value === 'SEV1') return 'critical';
    if (this.incident.severity.value === 'SEV2') return 'error';
    return 'default';
  }
}
