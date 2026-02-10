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
                (submitForm)="onSubmit($event)" 
                (cancel)="onCancel()">
            </app-incident-create-form>
        </div>
    </div>
  `,
    styles: [`
    .page-container { padding: 32px; max-width: 800px; margin: 0 auto; }
    .page-header { margin-bottom: 32px; h1 { margin: 0; color: white; } p { color: #8b949e; } }
    .form-wrapper { box-shadow: 0 8px 24px rgba(0,0,0,0.4); border-radius: 12px; }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncidentCreatePageComponent {
    private readonly facade = inject(IncidentsFacade);
    private readonly router = inject(Router);

    onSubmit(formData: any): void {
        const incidentData = {
            title: formData.title,
            description: formData.description,
            priority: formData.priority,
            severity: formData.severity,
            service: formData.service,
            tags: formData.tags || [],
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
