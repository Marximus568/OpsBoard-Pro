import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Incident } from '../../../../domain/models/incident.entity';
import { BadgeComponent, BadgeType } from '../../../../../../shared/components/atoms/badge/badge.component';

@Component({
  selector: 'app-incident-card',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
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
    return map[this.incident.priority] || 'default';
  }

  getStatusType(): BadgeType {
    const map: Record<string, BadgeType> = {
      'OPEN': 'default',
      'IN_PROGRESS': 'primary',
      'RESOLVED': 'success',
      'CLOSED': 'default'
    };
    return map[this.incident.status] || 'default';
  }
}
