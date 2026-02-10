import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrendPoint } from '../../../../domain/dashboard-metrics.model';

@Component({
    selector: 'app-trend-line-chart',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './trend-line-chart.component.html',
    styleUrls: ['./trend-line-chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrendLineChartComponent {
    readonly data = input.required<TrendPoint[]>();

    points = computed(() => {
        const data = this.data();
        if (!data.length) return [];
        const max = Math.max(...data.map(d => d.count), 5);
        const width = 400;
        const height = 200;
        const margin = 20;

        return data.map((d, i) => ({
            x: (i * (width / (data.length - 1))),
            y: height - (d.count / max) * (height - margin * 2) - margin
        }));
    });

    linePath = computed(() => {
        const pts = this.points();
        if (!pts.length) return '';
        return `M ${pts.map(p => `${p.x},${p.y}`).join(' L ')}`;
    });

    areaPath = computed(() => {
        const pts = this.points();
        if (!pts.length) return '';
        const width = 400;
        const height = 200;
        return `M 0,${height} L ${pts.map(p => `${p.x},${p.y}`).join(' L ')} L ${width},${height} Z`;
    });
}
