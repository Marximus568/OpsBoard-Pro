import { Injectable, signal, computed, OnDestroy } from '@angular/core';
import { LogEntry } from '../domain/models/log-entry.entity';
import { LogFilters, LogFilteringRules } from '../domain/models/log-filtering.rules';
import { LogLevel } from '../domain/models/log-level.enum';
import { Subject, interval, map, takeUntil, filter } from 'rxjs';

/**
 * Facade for Logs Explorer.
 * Orchestrates state using Signals and real-time streaming using RxJS.
 * Alignment: Clean Architecture (Application Layer), Facade Pattern.
 */
@Injectable({
    providedIn: 'root'
})
export class LogsFacade implements OnDestroy {
    // State
    private readonly _logs = signal<LogEntry[]>([]);
    private readonly _filters = signal<LogFilters>({});
    private readonly _isStreaming = signal<boolean>(true);
    private readonly _savedSearches = signal<string[]>(this.loadSavedSearches());
    private readonly _maxBufferSize = 500;

    // Derived State
    readonly filteredLogs = computed(() =>
        LogFilteringRules.apply(this._logs(), this._filters())
    );

    readonly isStreaming = this._isStreaming.asReadonly();
    readonly filters = this._filters.asReadonly();
    readonly savedSearches = this._savedSearches.asReadonly();

    // Stream control
    private destroy$ = new Subject<void>();

    constructor() {
        this.initializeStream();
    }

    private initializeStream(): void {
        interval(2000).pipe(
            filter(() => this._isStreaming()),
            map(() => this.generateMockLog()),
            takeUntil(this.destroy$)
        ).subscribe(newLog => {
            this.appendLog(newLog);
        });
    }

    updateFilters(filters: Partial<LogFilters>): void {
        this._filters.update(state => ({ ...state, ...filters }));
    }

    toggleStreaming(): void {
        this._isStreaming.update(s => !s);
    }

    clearLogs(): void {
        this._logs.set([]);
    }

    // Saved Searches logic
    saveSearch(query: string): void {
        if (!query || this._savedSearches().includes(query)) return;
        this._savedSearches.update(s => {
            const next = [query, ...s].slice(0, 10);
            localStorage.setItem('opsboard_saved_logs_searches', JSON.stringify(next));
            return next;
        });
    }

    removeSearch(query: string): void {
        this._savedSearches.update(s => {
            const next = s.filter(i => i !== query);
            localStorage.setItem('opsboard_saved_logs_searches', JSON.stringify(next));
            return next;
        });
    }

    private loadSavedSearches(): string[] {
        const saved = localStorage.getItem('opsboard_saved_logs_searches');
        return saved ? JSON.parse(saved) : [];
    }

    // Quick Filters
    applyQuickFilter(type: 'ERRORS' | 'LAST_HOUR' | 'ALL'): void {
        switch (type) {
            case 'ERRORS':
                this.updateFilters({ levels: [LogLevel.ERROR], query: undefined });
                break;
            case 'LAST_HOUR':
                const oneHourAgo = new Date();
                oneHourAgo.setHours(oneHourAgo.getHours() - 1);
                this.updateFilters({ dateFrom: oneHourAgo, levels: undefined });
                break;
            case 'ALL':
                this.updateFilters({ levels: undefined, query: undefined, dateFrom: undefined });
                break;
        }
    }

    async copyToClipboard(content: string): Promise<void> {
        await navigator.clipboard.writeText(content);
    }

    exportLogs(): void {
        const content = this.filteredLogs()
            .map(log => log.toFormattedString())
            .join('\n');

        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `logs-export-${new Date().getTime()}.log`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    private appendLog(log: LogEntry): void {
        this._logs.update(logs => {
            const next = [log, ...logs];
            return next.slice(0, this._maxBufferSize);
        });
    }

    private generateMockLog(): LogEntry {
        const services = ['auth-service', 'inventory-api', 'gateway', 'payment-worker'];
        const levels = [LogLevel.INFO, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR, LogLevel.DEBUG];
        const messages = [
            'User login successful',
            'Connection timeout in database',
            'Processing payment event',
            'Cache miss for key: user_profile',
            'Unauthorized access attempt'
        ];

        return new LogEntry({
            id: Math.random().toString(36).substring(7),
            timestamp: new Date(),
            level: levels[Math.floor(Math.random() * levels.length)],
            service: services[Math.floor(Math.random() * services.length)],
            message: messages[Math.floor(Math.random() * messages.length)],
            payload: { traceId: crypto.randomUUID(), detail: 'Mock log entry' }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
