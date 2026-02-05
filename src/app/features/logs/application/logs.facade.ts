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
    private readonly _maxBufferSize = 500;

    // Derived State
    readonly filteredLogs = computed(() =>
        LogFilteringRules.apply(this._logs(), this._filters())
    );

    readonly isStreaming = this._isStreaming.asReadonly();
    readonly filters = this._filters.asReadonly();

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

    exportLogs(): string {
        return this.filteredLogs()
            .map(log => log.toFormattedString())
            .join('\n');
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
