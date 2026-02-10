import { Incident, IncidentProps } from '../../domain/models/incident.entity';
import { IncidentStatus, IncidentStatusEnum } from '../../domain/value-objects/incident-status.vo';
import { Priority, PriorityLevel } from '../../domain/value-objects/priority.vo';
import { Severity, SeverityLevel } from '../../domain/value-objects/severity.vo';
import { IncidentEvent } from '../../domain/models/incident-event.model';

/**
 * Data Transfer Object representing an incident in the backend.
 * Matches server/db.json schema.
 */
export interface IncidentDto {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    severity: string;
    assigneeId: string | null;
    reporterId: string;
    service: string;
    slaBreached: boolean;
    createdAt: string;
    updatedAt: string;
    resolvedAt: string | null;
    closedAt: string | null;
    tags: string[];
    timeline: any[]; // Raw objects from DB
}

/**
 * Mapper responsible for transforming Incident data between Domain and DTO formats.
 */
export class IncidentMapper {
    /**
     * Transforms an IncidentDto from the infrastructure into a Domain Entity.
     */
    static toDomain(dto: any): Incident {
        const safeStatus = (dto.status as IncidentStatusEnum) || IncidentStatusEnum.OPEN;
        const safePriority = (dto.priority as PriorityLevel) || PriorityLevel.LOW;
        const safeSeverity = (dto.severity as SeverityLevel) || SeverityLevel.SEV4;

        return new Incident({
            id: dto.id,
            title: dto.title,
            description: dto.description || '',
            status: IncidentStatus.create(safeStatus),
            priority: Priority.create(safePriority),
            severity: Severity.create(safeSeverity),
            assigneeId: dto.assigneeId || null,
            reporterId: dto.reporterId || dto.reportedBy || 'system',
            service: dto.service || 'unknown',
            slaBreached: !!dto.slaBreached,
            createdAt: dto.createdAt ? new Date(dto.createdAt) : new Date(),
            updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : new Date(),
            resolvedAt: dto.resolvedAt ? new Date(dto.resolvedAt) : null,
            closedAt: dto.closedAt ? new Date(dto.closedAt) : null,
            tags: dto.tags || [],
            timeline: (dto.timeline || []).map((e: any) => new IncidentEvent(
                e.id,
                e.type,
                new Date(e.timestamp),
                e.userId || e.performedBy || 'system',
                e.description,
                e.metadata
            ))
        });
    }

    /**
     * Transforms a Domain Incident Entity into a JSON-compatible format for sending to the API.
     */
    static toPersistence(entity: Incident): IncidentDto {
        return {
            id: entity.id,
            title: entity.title,
            description: entity.description,
            status: entity.status.value,
            priority: entity.priority.value,
            severity: entity.severity.value,
            assigneeId: entity.assigneeId,
            reporterId: entity.reporterId,
            service: entity.service,
            slaBreached: entity.slaBreached,
            createdAt: entity.createdAt.toISOString(),
            updatedAt: entity.updatedAt.toISOString(),
            resolvedAt: entity.resolvedAt?.toISOString() || null,
            closedAt: entity.closedAt?.toISOString() || null,
            tags: entity.tags,
            timeline: entity.timeline.map(e => ({
                id: e.id,
                type: e.type,
                timestamp: e.timestamp.toISOString(),
                userId: e.userId,
                description: e.description,
                metadata: e.metadata
            }))
        };
    }
}
