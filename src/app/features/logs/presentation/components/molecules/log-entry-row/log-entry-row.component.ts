import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogEntry } from '../../../../domain/models/log-entry.entity';
import { LogStatusBadgeComponent } from '../../atoms/log-status-badge/log-status-badge.component';

@Component({
    selector: 'app-log-entry-row',
    standalone: true,
    imports: [CommonModule, LogStatusBadgeComponent],
    templateUrl: './log-entry-row.component.html',
    styleUrls: ['./log-entry-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogEntryRowComponent {
    @Input({ required: true }) log!: LogEntry;
    showDetail = false;

    toggleDetail(): void {
        this.showDetail = !this.showDetail;
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.code === 'Space') {
            event.preventDefault();
            this.toggleDetail();
        }
    }
}
