import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogEntry } from '../../../../domain/models/log-entry.entity';
import { LogStatusBadgeComponent } from '../../atoms/log-status-badge/log-status-badge.component';
import { LogsFacade } from '../../../../application/logs.facade';

@Component({
    selector: 'app-log-entry-row',
    standalone: true,
    imports: [CommonModule, LogStatusBadgeComponent],
    template: `
        <div class="log-row-container">
            <div class="log-row" [class.is-detailed]="showDetail" 
                (click)="toggleDetail()" 
                (keydown.enter)="toggleDetail()"
                (keydown.space)="toggleDetail()"
                tabindex="0"
                role="button"
                [attr.aria-expanded]="showDetail">
                <span class="timestamp">{{ log.timestamp | date: 'HH:mm:ss.SSS' }}</span>
                <app-log-status-badge [level]="log.level"></app-log-status-badge>
                <span class="service">{{ log.service }}</span>
                <span class="message">{{ log.message }}</span>
                <div class="actions">
                     <button (click)="$event.stopPropagation(); copyLog()" class="action-btn" title="Copy Log">
                        <span class="material-icons">content_copy</span>
                    </button>
                    <span class="material-icons expand-icon">{{ showDetail ? 'expand_less' : 'expand_more' }}</span>
                </div>
            </div>
            
            @if (showDetail && log.payload) {
                <div class="log-detail fade-in">
                    <header>
                        <span>PAYLOAD DETAILS</span>
                        <button (click)="copyPayload()" class="copy-payload-btn">Copy JSON</button>
                    </header>
                    <pre>{{ log.payload | json }}</pre>
                </div>
            }
        </div>
    `,
    styleUrls: ['./log-entry-row.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogEntryRowComponent {
    @Input({ required: true }) log!: LogEntry;
    protected readonly facade = inject(LogsFacade);
    showDetail = false;

    toggleDetail(): void {
        this.showDetail = !this.showDetail;
    }

    copyLog(): void {
        this.facade.copyToClipboard(this.log.toFormattedString());
    }

    copyPayload(): void {
        this.facade.copyToClipboard(JSON.stringify(this.log.payload, null, 2));
    }
}
