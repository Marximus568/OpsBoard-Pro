import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiCardComponent } from '../../../../../../shared/ui/atoms/kpi-card/kpi-card.component';
import { KpiMetric } from '../../../../domain/dashboard-metrics.model';

@Component({
    selector: 'app-kpi-grid',
    standalone: true,
    imports: [CommonModule, KpiCardComponent],
    templateUrl: './kpi-grid.component.html',
    styleUrls: ['./kpi-grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KpiGridComponent {
    readonly metrics = input.required<KpiMetric[]>();
}
