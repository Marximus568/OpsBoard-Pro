import { Incident } from '../../domain/models/incident.entity';
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
    timeline: unknown[]; // Raw objects from DB
}

/**
 * Mapper responsible for transforming Incident data between Domain and DTO formats.
 */
export class IncidentMapper {
    /**
     * Transforms an IncidentDto from the infrastructure into a Domain Entity.
     */
    static toDomain(rawDto: IncidentDto | Record<string, unknown>): Incident {
        const safeStatus = (rawDto['status'] as IncidentStatusEnum) || IncidentStatusEnum.OPEN;
        const safePriority = (rawDto['priority'] as PriorityLevel) || PriorityLevel.LOW;
        const safeSeverity = (rawDto['severity'] as SeverityLevel) || SeverityLevel.SEV4;

        return new Incident({
            id: rawDto['id'] as string,
            title: rawDto['title'] as string,
            description: (rawDto['description'] as string) || '',
            status: IncidentStatus.create(safeStatus),
            priority: Priority.create(safePriority),
            severity: Severity.create(safeSeverity),
            assigneeId: (rawDto['assigneeId'] as string) || null,
            reporterId: (rawDto['reporterId'] as string) || (rawDto as Record<string, unknown>)['reportedBy'] as string || 'system',
            service: (rawDto['service'] as string) || 'unknown',
            slaBreached: !!rawDto['slaBreached'],
            createdAt: rawDto['createdAt'] ? new Date(rawDto['createdAt'] as string) : new Date(),
            updatedAt: rawDto['updatedAt'] ? new Date(rawDto['updatedAt'] as string) : new Date(),
            resolvedAt: rawDto['resolvedAt'] ? new Date(rawDto['resolvedAt'] as string) : null,
            closedAt: rawDto['closedAt'] ? new Date(rawDto['closedAt'] as string) : null,
            tags: (rawDto['tags'] as string[]) || [],
            timeline: ((rawDto['timeline'] as Record<string, unknown>[]) || []).map((e: Record<string, unknown>) => new IncidentEvent(
                e['id'] as string,
                e['type'] as string,
                new Date(e['timestamp'] as string),
                (e['userId'] || e['performedBy'] || 'system') as string,
                e['description'] as string,
                e['metadata'] as Record<string, unknown>
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
