import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncidentStatusEnum } from '../../../../domain/value-objects/incident-status.vo';
import { PriorityLevel } from '../../../../domain/value-objects/priority.vo';
import { SeverityLevel } from '../../../../domain/value-objects/severity.vo';

export interface IncidentFilters {
    status: IncidentStatusEnum | 'ALL';
    priority: PriorityLevel | 'ALL';
    severity: SeverityLevel | 'ALL';
    search: string;
}

@Component({
    selector: 'app-filter-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './filter-form.component.html',
    styleUrls: ['./filter-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterFormComponent {
    @Output() filterChange = new EventEmitter<IncidentFilters>();

    filters: IncidentFilters = {
        status: 'ALL',
        priority: 'ALL',
        severity: 'ALL',
        search: ''
    };

    statuses = [
        { value: 'ALL', label: 'All Statuses' },
        { value: IncidentStatusEnum.OPEN, label: 'Open' },
        { value: IncidentStatusEnum.IN_PROGRESS, label: 'In Progress' },
        { value: IncidentStatusEnum.RESOLVED, label: 'Resolved' },
        { value: IncidentStatusEnum.CLOSED, label: 'Closed' }
    ];

    priorities = [
        { value: 'ALL', label: 'All Priorities' },
        { value: PriorityLevel.LOW, label: 'Low' },
        { value: PriorityLevel.MEDIUM, label: 'Medium' },
        { value: PriorityLevel.HIGH, label: 'High' },
        { value: PriorityLevel.CRITICAL, label: 'Critical' }
    ];

    severities = [
        { value: 'ALL', label: 'All Severities' },
        { value: SeverityLevel.SEV1, label: 'SEV-1' },
        { value: SeverityLevel.SEV2, label: 'SEV-2' },
        { value: SeverityLevel.SEV3, label: 'SEV-3' },
        { value: SeverityLevel.SEV4, label: 'SEV-4' }
    ];

    onFilterChange(): void {
        this.filterChange.emit({ ...this.filters });
    }

    reset(): void {
        this.filters = {
            status: 'ALL',
            priority: 'ALL',
            severity: 'ALL',
            search: ''
        };
        this.onFilterChange();
    }
}
