import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Incident } from '../../../../domain/models/incident.entity';
import { BadgeComponent, BadgeType } from '../../../../../../shared/components/atoms/badge/badge.component';

@Component({
  selector: 'app-incident-card',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <div class="card">
      <div class="card-header">
        <app-badge [type]="getPriorityType()">{{ incident.priority }}</app-badge>
        <span class="date">{{ incident.createdAt | date:'short' }}</span>
      </div>
      <h3 class="title">{{ incident.title }}</h3>
      <p class="description">{{ incident.description }}</p>
      <div class="card-footer">
        <span class="reporter">By: {{ incident.reportedBy }}</span>
        <app-badge [type]="getStatusType()">{{ incident.status }}</app-badge>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius-lg);
      padding: var(--spacing-md);
      box-shadow: var(--shadow-sm);
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;

      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
      }
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-sm);
    }
    .date {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }
    .title {
      font-size: var(--font-size-md);
      margin-bottom: var(--spacing-xs);
      color: var(--text-primary);
    }
    .description {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: var(--spacing-md);
    }
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid var(--border-color);
      padding-top: var(--spacing-sm);
    }
    .reporter {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }
  `]
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
