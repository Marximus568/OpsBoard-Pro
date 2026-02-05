import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Incident } from '../../../../domain/models/incident.entity';
import { IncidentCardComponent } from '../../molecules/incident-card/incident-card.component';

@Component({
    selector: 'app-incident-list-view',
    standalone: true,
    imports: [CommonModule, IncidentCardComponent],
    template: `
    <div class="grid">
      @for (incident of incidents; track incident.id) {
        <app-incident-card [incident]="incident"></app-incident-card>
      } @empty {
        <div class="empty-state">
          No incidents found.
        </div>
      }
    </div>
  `,
    styles: [`
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--spacing-lg);
    }
    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: var(--spacing-xxl);
      color: var(--text-secondary);
      background: var(--bg-primary);
      border: 1px dashed var(--border-color);
      border-radius: var(--border-radius-lg);
    }
  `]
})
export class IncidentListViewComponent {
    @Input({ required: true }) incidents: Incident[] = [];
}
