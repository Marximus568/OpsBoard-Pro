import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IncidentsFacade } from '../../../application/incidents.facade';
import { IncidentCreateFormComponent } from '../../components/organisms/incident-create-form/incident-create-form.component';

@Component({
    selector: 'app-incident-create-page',
    standalone: true,
    imports: [CommonModule, IncidentCreateFormComponent],
    template: `
    <div class="page-container">
        <header class="page-header">
            <h1>Report New Incident</h1>
            <p>Follow the steps to notify the operations center</p>
        </header>

        <div class="form-wrapper">
            <app-incident-create-form 
                (create)="onSubmit($event)" 
                (canceled)="onCancel()">
            </app-incident-create-form>
        </div>
    </div>
  `,
    styles: [`
    .page-container { padding: 32px; max-width: 800px; margin: 0 auto; }
    .page-header { margin-bottom: 32px; h1 { margin: 0; color: var(--text-primary); } p { color: var(--text-secondary); } }
    .form-wrapper { box-shadow: var(--shadow-lg); border-radius: 12px; background: var(--surface-card); }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncidentCreatePageComponent {
    private readonly facade = inject(IncidentsFacade);
    private readonly router = inject(Router);

    onSubmit(data: unknown): void {
        const formData = data as Record<string, unknown>;
        const incidentData = {
            title: formData['title'] as string,
            description: formData['description'] as string,
            priority: formData['priority'] as string,
            severity: formData['severity'] as string,
            service: formData['service'] as string,
            tags: (formData['tags'] as string[]) || [],
            reporterId: 'system-user', // Mock user
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        this.facade.createIncident(incidentData);
        this.router.navigate(['/incidents']);
    }

    onCancel(): void {
        this.router.navigate(['/incidents']);
    }
}
