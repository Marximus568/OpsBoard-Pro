import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeverityDistribution } from '../../../../domain/dashboard-metrics.model';

@Component({
    selector: 'app-distribution-pie-chart',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './distribution-pie-chart.component.html',
    styleUrls: ['./distribution-pie-chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DistributionPieChartComponent {
    readonly data = input.required<SeverityDistribution[]>();

    slices = computed(() => {
        let cumulativePercent = 0;
        return this.data().filter(d => d.count > 0).map(d => {
            const startX = Math.cos(2 * Math.PI * cumulativePercent);
            const startY = Math.sin(2 * Math.PI * cumulativePercent);

            cumulativePercent += d.percentage / 100;

            const endX = Math.cos(2 * Math.PI * cumulativePercent);
            const endY = Math.sin(2 * Math.PI * cumulativePercent);

            const largeArcFlag = d.percentage > 50 ? 1 : 0;

            const path = [
                `M ${startX} ${startY}`,
                `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                `L 0 0`
            ].join(' ');

            return {
                path,
                color: this.getColor(d.priority),
                label: d.priority,
                value: d.percentage
            };
        });
    });

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
