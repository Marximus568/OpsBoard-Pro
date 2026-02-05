import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidentsFacade } from '../../../application/incidents.facade';
import { IncidentListViewComponent } from '../../components/organisms/incident-list-view/incident-list-view.component';

@Component({
  selector: 'app-incidents-list',
  standalone: true,
  imports: [CommonModule, IncidentListViewComponent],
  templateUrl: './incidents-list.page.html',
  styleUrls: ['./incidents-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncidentsListPage implements OnInit {
  private readonly incidentsFacade = inject(IncidentsFacade);

  readonly incidents$ = this.incidentsFacade.incidents$;
  readonly isLoading$ = this.incidentsFacade.isLoading$;
  readonly error$ = this.incidentsFacade.error$;

  ngOnInit(): void {
    this.incidentsFacade.loadIncidents();
  }
}
