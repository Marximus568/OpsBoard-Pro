import { AuditLog } from '../../domain/models/audit-log.entity';

export interface AuditLogDto {
    id: string;
    timestamp: string;
    userId: string;
    action: string;
    resource: string;
    metadata?: Record<string, unknown>;
}

export class AuditMapper {
    static toDomain(dto: AuditLogDto): AuditLog {
        return {
            id: dto.id,
            timestamp: dto.timestamp,
            userId: dto.userId,
            action: dto.action,
            resource: dto.resource,
            metadata: dto.metadata
        };
    }
}
