import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-kpi-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './kpi-card.component.html',
    styleUrls: ['./kpi-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KpiCardComponent {
    @Input({ required: true }) label!: string;
    @Input({ required: true }) value: number | string = 0;
    @Input() color = 'var(--primary-color)';
    @Input() icon?: string;
}
