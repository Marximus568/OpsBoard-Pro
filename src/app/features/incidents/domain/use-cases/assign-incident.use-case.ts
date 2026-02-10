import { Incident } from '../models/incident.entity';
import { IIncidentRepository } from '../contracts/incident.repository';
import { IncidentEvent } from '../models/incident-event.model';
import { v4 as uuidv4 } from 'uuid';

export interface AssignIncidentParams {
    incidentId: string;
    assigneeId: string;
    userId: string;
}

export class AssignIncidentUseCase {
    constructor(private readonly repository: IIncidentRepository) { }

    async execute(params: AssignIncidentParams): Promise<Incident> {
        const incident = await this.repository.getById(params.incidentId);
        if (!incident) throw new Error('Incident not found');

        const event = new IncidentEvent(
            `EVT-${uuidv4().substring(0, 8).toUpperCase()}`,
            'ASSIGNED',
            new Date(),
            params.userId,
            `Incident assigned to ${params.assigneeId}`
        );

        const updatedIncident = incident.withAssignee(params.assigneeId, event);
        await this.repository.update(updatedIncident);
        return updatedIncident;
    }
}
