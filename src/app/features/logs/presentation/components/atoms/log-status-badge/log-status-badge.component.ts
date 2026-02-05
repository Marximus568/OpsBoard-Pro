import { Component, Input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogLevel } from '../../../../domain/models/log-level.enum';
import { BadgeComponent, BadgeType } from '../../../../../../shared/components/atoms/badge/badge.component';

@Component({
    selector: 'app-log-status-badge',
    standalone: true,
    imports: [CommonModule, BadgeComponent],
    templateUrl: './log-status-badge.component.html',
    styleUrls: ['./log-status-badge.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogStatusBadgeComponent {
    @Input({ required: true }) level!: LogLevel;

    readonly badgeType = computed<BadgeType>(() => {
        switch (this.level) {
            case LogLevel.DEBUG: return 'default';
            case LogLevel.INFO: return 'primary';
            case LogLevel.WARN: return 'warning';
            case LogLevel.ERROR: return 'error';
            case LogLevel.CRITICAL: return 'critical';
            default: return 'default';
        }
    });
}
