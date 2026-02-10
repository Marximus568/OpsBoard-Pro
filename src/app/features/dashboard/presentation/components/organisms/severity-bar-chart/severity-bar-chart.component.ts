import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeverityDistribution } from '../../../../domain/dashboard-metrics.model';

@Component({
    selector: 'app-severity-bar-chart',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './severity-bar-chart.component.html',
    styleUrls: ['./severity-bar-chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeverityBarChartComponent {
    readonly data = input.required<SeverityDistribution[]>();

    getColor(priority: string): string {
        switch (priority) {
            case 'CRITICAL': return 'var(--status-error)';
            case 'HIGH': return 'var(--status-warning)';
            case 'MEDIUM': return 'var(--status-progress)';
            case 'LOW': return 'var(--status-open)';
            default: return 'var(--primary-color)';
        }
    }
}
