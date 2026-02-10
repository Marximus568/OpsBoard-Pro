import { Incident } from '../models/incident.entity';
import { IIncidentRepository } from '../contracts/incident.repository';
import { v4 as uuidv4 } from 'uuid';
import { IncidentStatus, IncidentStatusEnum } from '../value-objects/incident-status.vo';
import { Priority } from '../value-objects/priority.vo';
import { Severity } from '../value-objects/severity.vo';
import { IncidentEvent } from '../models/incident-event.model';

export interface CreateIncidentParams {
    title: string;
    description: string;
    priority: string;
    severity: string;
    reporterId: string;
    service: string;
    tags?: string[];
}

export class CreateIncidentUseCase {
    constructor(private readonly repository: IIncidentRepository) { }

    async execute(params: CreateIncidentParams): Promise<Incident> {
        const id = `INC-${uuidv4().substring(0, 8).toUpperCase()}`;

        const creationEvent = new IncidentEvent(
            `EVT-${uuidv4().substring(0, 8).toUpperCase()}`,
            'CREATED',
            new Date(),
            params.reporterId,
            'Incident reported'
        );

        const incident = new Incident({
            id,
            title: params.title,
            description: params.description,
            status: IncidentStatus.create(IncidentStatusEnum.OPEN),
            priority: Priority.fromString(params.priority),
            severity: Severity.fromString(params.severity),
            assigneeId: null,
            reporterId: params.reporterId,
            service: params.service,
            slaBreached: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            resolvedAt: null,
            closedAt: null,
            tags: params.tags || [],
            timeline: [creationEvent]
        });

        await this.repository.save(incident);
        return incident;
    }
}
