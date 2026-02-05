import { LogLevel } from './log-level.enum';

export interface LogEntryProps {
    id: string;
    timestamp: Date;
    level: LogLevel;
    service: string;
    message: string;
    payload?: unknown;
}

/**
 * LogEntry Entity.
 * Represents a single log record in the system.
 */
export class LogEntry {
    constructor(private readonly props: LogEntryProps) { }

    get id(): string { return this.props.id; }
    get timestamp(): Date { return this.props.timestamp; }
    get level(): LogLevel { return this.props.level; }
    get service(): string { return this.props.service; }
    get message(): string { return this.props.message; }
    get payload(): unknown { return this.props.payload; }

    /**
     * Formats the log entry for plain text export.
     */
    toFormattedString(): string {
        const ts = this.props.timestamp.toISOString();
        const level = this.props.level.padEnd(8);
        const service = `[${this.props.service}]`.padEnd(20);
        return `${ts} ${level} ${service} ${this.props.message}`;
    }

    toJSON(): LogEntryProps {
        return { ...this.props };
    }
}
