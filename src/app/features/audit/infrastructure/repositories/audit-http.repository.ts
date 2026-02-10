import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuditLog } from '../../domain/models/audit-log.entity';
import { AuditMapper, AuditLogDto } from '../mappers/audit.mapper';

export interface IAuditRepository {
    getLogs(): Observable<AuditLog[]>;
}

@Injectable({
    providedIn: 'root'
})
export class AuditHttpRepository implements IAuditRepository {
    private readonly http = inject(HttpClient);
    // Using localhost for now
    private readonly apiUrl = 'http://localhost:3000/auditLogs';

    getLogs(): Observable<AuditLog[]> {
        return this.http.get<AuditLogDto[]>(this.apiUrl).pipe(
            map(dtos => dtos.map(dto => AuditMapper.toDomain(dto)))
        );
    }
}
