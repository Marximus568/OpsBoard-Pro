import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidentsFacade } from '../../../application/incidents.facade';
import { IncidentListViewComponent } from '../../components/organisms/incident-list-view/incident-list-view.component';

@Component({
  selector: 'app-incidents-list',
  standalone: true,
  imports: [CommonModule, IncidentListViewComponent],
  template: `
    <div class="page-container">
      <header class="page-header">
        <h1>Incidents</h1>
        <button class="btn-primary">New Incident</button>
      </header>

      <div class="content">
        @if (isLoading$ | async) {
          <div class="loading-state">
            Loading incidents...
          </div>
        }
        
        @if (error$ | async; as error) {
          <div class="error-state">
            Error: {{ error }}
          </div>
        }

        @if ((isLoading$ | async) === false && (error$ | async) === null) {
          <app-incident-list-view 
            [incidents]="(incidents$ | async) || []">
          </app-incident-list-view>
        }
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      h1 { font-size: var(--font-size-xl); }
    }
  `]
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
