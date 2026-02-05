import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IncidentDto } from '../../application/mappers/incident.mapper';

/**
 * Service dedicated exclusively to data transport for Incidents.
 * No domain logic or complex state management.
 */
@Injectable({
    providedIn: 'root'
})
export class IncidentApiService {
    private readonly http = inject(HttpClient);
    private readonly API_URL = 'http://localhost:3000/incidents';

    /**
     * Fetches all incidents from the backend.
     */
    getAll(): Observable<IncidentDto[]> {
        return this.http.get<IncidentDto[]>(this.API_URL);
    }

    /**
     * Fetches a single incident by ID.
     */
    getById(id: string): Observable<IncidentDto> {
        return this.http.get<IncidentDto>(`${this.API_URL}/${id}`);
    }

    /**
     * Creates a new incident.
     */
    create(data: unknown): Observable<unknown> {
        return this.http.post(this.API_URL, data);
    }

    /**
     * Updates an existing incident.
     */
    update(id: string, data: unknown): Observable<unknown> {
        return this.http.put(`${this.API_URL}/${id}`, data);
    }

    /**
     * Deletes an incident.
     */
    delete(id: string): Observable<unknown> {
        return this.http.delete(`${this.API_URL}/${id}`);
    }
}
