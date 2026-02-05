import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Incident } from '../../../../domain/models/incident.entity';
import { IncidentCardComponent } from '../../molecules/incident-card/incident-card.component';

@Component({
  selector: 'app-incident-list-view',
  standalone: true,
  imports: [CommonModule, IncidentCardComponent],
  templateUrl: './incident-list-view.component.html',
  styleUrls: ['./incident-list-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncidentListViewComponent {
  @Input({ required: true }) incidents: Incident[] = [];
}
