import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuditService {
    private readonly http = inject(HttpClient);
    // Using localhost for now as per previous patterns seen in admin repo
    private readonly apiUrl = 'http://localhost:3000/auditLogs';

    async log(action: string, resource: string, userId: string, metadata?: Record<string, unknown>): Promise<void> {
        const entry = {
            timestamp: new Date().toISOString(),
            userId,
            action,
            resource,
            metadata
        };

        // We fire and forget (or await if critical)
        try {
            await firstValueFrom(this.http.post(this.apiUrl, entry));
        } catch (error) {
            console.error('Failed to log audit entry', error);
            // Fallback or retry logic could go here
        }
    }
}
