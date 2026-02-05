import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class TelemetryService {
    private readonly SESSION_KEY = 'opsboard_correlation_id';

    constructor() {
        this.initializeCorrelationId();
    }

    getCorrelationId(): string {
        return sessionStorage.getItem(this.SESSION_KEY) || '';
    }

    private initializeCorrelationId(): void {
        if (!sessionStorage.getItem(this.SESSION_KEY)) {
            // Note: uuid package needs to be installed, or use a simple generator for now
            sessionStorage.setItem(this.SESSION_KEY, this.generateId());
        }
    }

    private generateId(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
