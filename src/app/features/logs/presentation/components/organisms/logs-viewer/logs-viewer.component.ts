import { Component, inject, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewChecked, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogsFacade } from '../../../../application/logs.facade';
import { LogEntryRowComponent } from '../../molecules/log-entry-row/log-entry-row.component';

@Component({
    selector: 'app-logs-viewer',
    standalone: true,
    imports: [CommonModule, LogEntryRowComponent],
    template: `
        <div class="viewer-card glass-card">
            <header class="viewer-header">
                <div class="status">
                    <span class="pulse" [class.paused]="!facade.isStreaming()"></span>
                    <span class="status-text">{{ facade.isStreaming() ? 'Streaming logs...' : 'Streaming paused' }}</span>
                </div>
                <div class="controls">
                    <button (click)="facade.toggleStreaming()" class="control-btn" [title]="facade.isStreaming() ? 'Pause' : 'Resume'">
                        <span class="material-icons">{{ facade.isStreaming() ? 'pause' : 'play_arrow' }}</span>
                    </button>
                    <button (click)="facade.clearLogs()" class="control-btn" title="Clear Logs">
                        <span class="material-icons">delete_sweep</span>
                    </button>
                    <button (click)="toggleAutoScroll()" class="control-btn" [class.active]="autoScroll()" title="Auto-scroll">
                        <span class="material-icons">vertical_align_bottom</span>
                    </button>
                    <div class="divider"></div>
                    <button (click)="facade.exportLogs()" class="control-btn accent" title="Export .log">
                        <span class="material-icons">file_download</span> Export
                    </button>
                </div>
            </header>

            <div class="logs-container" #scrollContainer>
                @if (facade.filteredLogs().length === 0) {
                    <div class="empty-state">
                        <span class="material-icons">search_off</span>
                        <p>No logs found matching your filters.</p>
                    </div>
                } @else {
                    @for (log of facade.filteredLogs(); track log.id) {
                        <app-log-entry-row [log]="log"></app-log-entry-row>
                    }
                }
            </div>

            <footer class="viewer-footer">
                <span class="count">Showing {{ facade.filteredLogs().length }} log entries</span>
            </footer>
        </div>
    `,
    styles: [`
        .viewer-card {
            background: rgba(13, 17, 23, 0.6);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            height: 600px;
        }
        .viewer-header {
            padding: 0.75rem 1.5rem;
            background: rgba(255, 255, 255, 0.02);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .status {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            
            .status-text {
                font-size: 0.75rem;
                font-weight: 600;
                color: var(--text-secondary);
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
        }
        .pulse {
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
            animation: pulse 2s infinite;
            &.paused { background: #f59e0b; animation: none; box-shadow: none; }
        }
        @keyframes pulse {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .controls {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            
            .divider { width: 1px; height: 20px; background: var(--border-color); margin: 0 0.5rem; }
        }
        .control-btn {
            background: none;
            border: 1px solid transparent;
            color: var(--text-secondary);
            width: 32px;
            height: 32px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
            
            .material-icons { font-size: 20px; }
            &:hover { background: rgba(255, 255, 255, 0.05); color: var(--text-primary); }
            &.active { color: var(--primary-color); background: rgba(99, 102, 241, 0.1); border-color: rgba(99, 102, 241, 0.2); }
            &.accent {
                width: auto;
                padding: 0 1rem;
                gap: 0.5rem;
                font-size: 0.813rem;
                font-weight: 500;
                color: var(--primary-color);
                &:hover { background: rgba(99, 102, 241, 0.1); }
            }
        }
        .logs-container {
            flex: 1;
            overflow-y: auto;
            scroll-behavior: smooth;
            background: #0d1117;
            
            &::-webkit-scrollbar { width: 8px; }
            &::-webkit-scrollbar-track { background: transparent; }
            &::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 4px; }
            &::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
        }
        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: var(--text-secondary);
            gap: 1rem;
            .material-icons { font-size: 48px; opacity: 0.3; }
            p { font-size: 0.875rem; }
        }
        .viewer-footer {
            padding: 0.5rem 1.5rem;
            background: rgba(255, 255, 255, 0.01);
            border-top: 1px solid var(--border-color);
            .count { font-size: 0.75rem; color: var(--text-secondary); }
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogsViewerComponent implements AfterViewChecked {
    @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
    protected readonly facade = inject(LogsFacade);

    autoScroll = signal(true);

    constructor() {
        // Effect to handle auto-scroll when new logs arrive
        effect(() => {
            if (this.facade.filteredLogs() && this.autoScroll()) {
                // We need to trigger scroll, but AfterViewChecked is safer for DOM updates
            }
        });
    }

    ngAfterViewChecked(): void {
        this.scrollToBottom();
    }

    toggleAutoScroll(): void {
        this.autoScroll.update(v => !v);
    }

    private scrollToBottom(): void {
        if (this.autoScroll() && this.scrollContainer) {
            try {
                const el = this.scrollContainer.nativeElement;
                el.scrollTop = el.scrollHeight;
            } catch {
                // Ignore scroll errors
            }
        }
    }
}
