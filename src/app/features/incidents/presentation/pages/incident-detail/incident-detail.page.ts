import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { IncidentsFacade } from '../../../application/incidents.facade';
import { IncidentDetailComponent } from '../../components/organisms/incident-detail/incident-detail.component';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Incident } from '../../../domain/models/incident.entity';

@Component({
    selector: 'app-incident-detail-page',
    standalone: true,
    imports: [CommonModule, IncidentDetailComponent],
    template: `
    <div class="page-container" *ngIf="incident$ | async as incident; else loading">
        <app-incident-detail [incident]="incident"></app-incident-detail>
    </div>
    <ng-template #loading>
        <div class="loading-state">Syncing incident details...</div>
    </ng-template>
  `,
    styles: [`
    .page-container { padding: 32px; max-width: 1400px; margin: 0 auto; }
    .loading-state { padding: 64px; text-align: center; color: #8b949e; }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncidentDetailPageComponent implements OnInit {
    protected readonly route = inject(ActivatedRoute);
    private readonly facade = inject(IncidentsFacade);

    incident$: Observable<Incident | undefined> = this.route.params.pipe(
        map((params: Params) => params['id'] as string),
        switchMap((id: string) => this.facade.incidents$.pipe(
            map((incidents: Incident[]) => incidents.find(i => i.id === id))
        ))
    );

    ngOnInit(): void {
        this.facade.loadIncidents();
    }
}
