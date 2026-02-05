import { Incident } from '../../domain/models/incident.entity';
import { IncidentStatus } from '../../domain/models/incident-status.enum';
import { IncidentPriority } from '../../domain/models/incident-priority.enum';

/**
 * Data Transfer Object representing an incident in the backend.
 */
export interface IncidentDto {
    id: string;
    title: string;
    description: string;
    status: IncidentStatus;
    priority: IncidentPriority;
    createdAt: string;
    updatedAt: string;
    reportedBy?: string;
}

/**
 * Mapper responsible for transforming Incident data between Domain and DTO formats.
 */
export class IncidentMapper {
    /**
     * Transforms an IncidentDto from the infrastructure into a Domain Entity.
     */
    static toDomain(dto: IncidentDto): Incident {
        return new Incident({
            id: dto.id,
            title: dto.title,
            description: dto.description,
            status: dto.status,
            priority: dto.priority,
            createdAt: new Date(dto.createdAt),
            updatedAt: new Date(dto.updatedAt),
            reportedBy: dto.reportedBy || 'Unknown'
        });
    }

    /**
     * Transforms a Domain Incident Entity into a JSON-compatible format for sending to the API.
     */
    static toPersistence(entity: Incident): IncidentDto {
        const props = entity.toJSON();
        return {
            id: props.id,
            title: props.title,
            description: props.description,
            status: props.status,
            priority: props.priority,
            createdAt: props.createdAt.toISOString(),
            updatedAt: props.updatedAt.toISOString(),
            reportedBy: props.reportedBy
        };
    }
}
