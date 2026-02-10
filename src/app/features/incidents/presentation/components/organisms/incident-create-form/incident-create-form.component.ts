import { Component, Output, EventEmitter, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PriorityLevel } from '../../../../domain/value-objects/priority.vo';
import { SeverityLevel } from '../../../../domain/value-objects/severity.vo';
import { ButtonComponent } from '../../../../../../shared/ui/atoms/button/button.component';

export type FormStep = 1 | 2 | 3;

@Component({
    selector: 'app-incident-create-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
    templateUrl: './incident-create-form.component.html',
    styleUrls: ['./incident-create-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncidentCreateFormComponent {
    private readonly fb = inject(FormBuilder);

    @Output() create = new EventEmitter<unknown>();
    @Output() canceled = new EventEmitter<void>();

    currentStep: FormStep = 1;
    incidentForm = this.fb.group({
        // Step 1
        title: ['', [Validators.required, Validators.minLength(5)]],
        description: ['', [Validators.required, Validators.minLength(10)]],
        // Step 2
        priority: [PriorityLevel.MEDIUM, Validators.required],
        severity: [SeverityLevel.SEV3, Validators.required],
        service: ['', Validators.required],
        // Step 3
        tags: ['']
    });

    priorities = [
        { value: PriorityLevel.LOW, label: 'Low' },
        { value: PriorityLevel.MEDIUM, label: 'Medium' },
        { value: PriorityLevel.HIGH, label: 'High' },
        { value: PriorityLevel.CRITICAL, label: 'Critical' }
    ];

    severities = [
        { value: SeverityLevel.SEV1, label: 'SEV-1 (Critical)' },
        { value: SeverityLevel.SEV2, label: 'SEV-2 (High)' },
        { value: SeverityLevel.SEV3, label: 'SEV-3 (Medium)' },
        { value: SeverityLevel.SEV4, label: 'SEV-4 (Low)' }
    ];



    nextStep(): void {
        if (this.currentStep < 3) {
            if (this.isStepValid(this.currentStep)) {
                this.currentStep++;
            }
        }
    }

    prevStep(): void {
        if (this.currentStep > 1) {
            this.currentStep--;
        }
    }

    isStepValid(step: FormStep): boolean {
        if (step === 1) {
            return this.incidentForm.get('title')!.valid && this.incidentForm.get('description')!.valid;
        }
        if (step === 2) {
            return this.incidentForm.get('priority')!.valid &&
                this.incidentForm.get('severity')!.valid &&
                this.incidentForm.get('service')!.valid;
        }
        return true;
    }

    onSubmit(): void {
        if (this.incidentForm.valid) {
            const rawValue = this.incidentForm.value;
            const tags = rawValue.tags ? rawValue.tags.split(',').map((t: string) => t.trim()) : [];
            this.create.emit({ ...rawValue, tags });
        }
    }
}
