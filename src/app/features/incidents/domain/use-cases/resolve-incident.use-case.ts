import { Incident } from '../models/incident.entity';
import { IIncidentRepository } from '../contracts/incident.repository';
import { IncidentEvent } from '../models/incident-event.model';
import { v4 as uuidv4 } from 'uuid';
import { IncidentStatus, IncidentStatusEnum } from '../value-objects/incident-status.vo';

export interface ResolveIncidentParams {
    incidentId: string;
    userId: string;
    comment?: string;
}

export class ResolveIncidentUseCase {
    constructor(private readonly repository: IIncidentRepository) { }

    async execute(params: ResolveIncidentParams): Promise<Incident> {
        const incident = await this.repository.getById(params.incidentId);
        if (!incident) throw new Error('Incident not found');

        const event = new IncidentEvent(
            `EVT-${uuidv4().substring(0, 8).toUpperCase()}`,
            'RESOLVED',
            new Date(),
            params.userId,
            params.comment || 'Incident resolved'
        );

        const updatedIncident = incident.withStatus(IncidentStatus.create(IncidentStatusEnum.RESOLVED), event);
        await this.repository.update(updatedIncident);
        return updatedIncident;
    }
}
