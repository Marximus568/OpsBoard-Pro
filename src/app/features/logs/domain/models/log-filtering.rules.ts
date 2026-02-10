import { LogEntry } from './log-entry.entity';
import { LogLevel } from './log-level.enum';

export interface LogFilters {
    query?: string;
    levels?: LogLevel[];
    services?: string[];
    dateFrom?: Date;
    dateTo?: Date;
}

/**
 * Pure domain logic for log filtering.
 */
export class LogFilteringRules {
    static apply(logs: LogEntry[], filters: LogFilters): LogEntry[] {
        return logs.filter(log => {
            // Level filter
            if (filters.levels?.length && !filters.levels.includes(log.level)) {
                return false;
            }

            // Service filter
            if (filters.services?.length && !filters.services.includes(log.service)) {
                return false;
            }

            // Query filter (full-text on message, id and service)
            if (filters.query) {
                const q = filters.query.toLowerCase();
                const match =
                    log.message.toLowerCase().includes(q) ||
                    log.service.toLowerCase().includes(q) ||
                    log.id.toLowerCase().includes(q);

                if (!match) return false;
            }

            // Date range
            if (filters.dateFrom && log.timestamp < filters.dateFrom) return false;
            if (filters.dateTo && log.timestamp > filters.dateTo) return false;

            return true;
        });
    }
}
