import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidentsFacade } from '../../../application/incidents.facade';
import { IncidentListViewComponent } from '../../components/organisms/incident-list-view/incident-list-view.component';
import { FilterFormComponent, IncidentFilters } from '../../components/molecules/filter-form/filter-form.component';
import { ButtonComponent } from '../../../../../shared/ui/atoms/button/button.component';

import { Router } from '@angular/router';

@Component({
  selector: 'app-incidents-list',
  standalone: true,
  imports: [CommonModule, IncidentListViewComponent, FilterFormComponent, ButtonComponent],
  templateUrl: './incidents-list.page.html',
  styleUrls: ['./incidents-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncidentsListPage implements OnInit {
  private readonly incidentsFacade = inject(IncidentsFacade);
  private readonly router = inject(Router);

  readonly incidents$ = this.incidentsFacade.incidents$;
  readonly isLoading$ = this.incidentsFacade.isLoading$;
  readonly error$ = this.incidentsFacade.error$;

  ngOnInit(): void {
    this.incidentsFacade.loadIncidents();
  }

  onFilterChange(filters: IncidentFilters): void {
    this.incidentsFacade.updateFilters(filters);
  }

  onCreateIncident(): void {
    this.router.navigate(['/incidents/create']);
  }
}
