import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardFacade } from '../../../application/dashboard.facade';
import { KpiGridComponent } from '../../components/molecules/kpi-grid/kpi-grid.component';
import { SeverityBarChartComponent } from '../../components/organisms/severity-bar-chart/severity-bar-chart.component';
import { TrendLineChartComponent } from '../../components/organisms/trend-line-chart/trend-line-chart.component';
import { DistributionPieChartComponent } from '../../components/organisms/distribution-pie-chart/distribution-pie-chart.component';

@Component({
    selector: 'app-dashboard-page',
    standalone: true,
    imports: [
        CommonModule,
        KpiGridComponent,
        SeverityBarChartComponent,
        TrendLineChartComponent,
        DistributionPieChartComponent
    ],
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPage {
    protected readonly facade = inject(DashboardFacade);
}
