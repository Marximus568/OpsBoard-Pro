import { Injectable } from '@angular/core';

export enum LogLevel {
    DEBUG,
    INFO,
    WARN,
    ERROR
}

@Injectable({
    providedIn: 'root'
})
export class LoggingService {
    debug(message: string, ...args: any[]): void {
        this.log(LogLevel.DEBUG, message, ...args);
    }

    info(message: string, ...args: any[]): void {
        this.log(LogLevel.INFO, message, ...args);
    }

    warn(message: string, ...args: any[]): void {
        this.log(LogLevel.WARN, message, ...args);
    }

    error(message: string, ...args: any[]): void {
        this.log(LogLevel.ERROR, message, ...args);
    }

    private log(level: LogLevel, message: string, ...args: any[]): void {
        // Current simple implementation, no UI dependency
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${LogLevel[level]}]`;

        switch (level) {
            case LogLevel.DEBUG:
                console.debug(prefix, message, ...args);
                break;
            case LogLevel.INFO:
                console.info(prefix, message, ...args);
                break;
            case LogLevel.WARN:
                console.warn(prefix, message, ...args);
                break;
            case LogLevel.ERROR:
                console.error(prefix, message, ...args);
                break;
        }
    }
}
