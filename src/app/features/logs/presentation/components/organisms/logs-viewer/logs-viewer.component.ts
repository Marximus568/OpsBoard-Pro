import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogsFacade } from '../../../../application/logs.facade';
import { LogEntryRowComponent } from '../../molecules/log-entry-row/log-entry-row.component';

@Component({
    selector: 'app-logs-viewer',
    standalone: true,
    imports: [CommonModule, LogEntryRowComponent],
    templateUrl: './logs-viewer.component.html',
    styleUrls: ['./logs-viewer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogsViewerComponent {
    protected readonly facade = inject(LogsFacade);
}
