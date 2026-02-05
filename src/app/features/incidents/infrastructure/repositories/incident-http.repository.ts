import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { IIncidentRepository } from '../../domain/contracts/incident.repository';
import { Incident } from '../../domain/models/incident.entity';
import { IncidentApiService } from '../services/incident-api.service';
import { IncidentMapper, IncidentDto } from '../../application/mappers/incident.mapper';

/**
 * Repository implementation for Incidents using HTTP transport.
 * Clean Architecture Adapter: Bridges Domain interface and Infrastructure implementation.
 */
@Injectable({
    providedIn: 'root'
})
export class IncidentHttpRepository implements IIncidentRepository {
    private readonly api = inject(IncidentApiService);

    /**
     * Retrieves all incidents via the API and transforms them to Domain Entities.
     */
    async getAll(): Promise<Incident[]> {
        const rawData: IncidentDto[] = await firstValueFrom(this.api.getAll());
        return rawData.map((data: IncidentDto) => IncidentMapper.toDomain(data));
    }

    /**
     * Retrieves a specific incident by ID.
     */
    async getById(id: string): Promise<Incident | null> {
        const data: IncidentDto = await firstValueFrom(this.api.getById(id));
        if (!data) return null;
        return IncidentMapper.toDomain(data);
    }

    /**
     * Persists a new incident.
     */
    async save(incident: Incident): Promise<void> {
        await firstValueFrom(this.api.create(IncidentMapper.toPersistence(incident)));
    }

    /**
     * Updates an existing incident.
     */
    async update(incident: Incident): Promise<void> {
        await firstValueFrom(this.api.update(incident.id, IncidentMapper.toPersistence(incident)));
    }

    /**
     * Removes an incident by ID.
     */
    async delete(id: string): Promise<void> {
        await firstValueFrom(this.api.delete(id));
    }
}
