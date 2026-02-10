import { Deployment } from '../../domain/models/deployment.entity';
import { DeploymentStatus } from '../../domain/models/deployment-status.model';

export interface DeploymentDto {
    uuid: string;
    service: string;
    version_tag: string;
    env_name: string;
    current_status: DeploymentStatus;
    user_id: string;
    reviewer_id?: string;
    approver_id?: string;
    timestamp: string;
    last_update: string;
    history?: any[];
    logs?: string[];
}

/**
 * Mapper for Deployment data.
 * Adheres to Rule 82: DTO ↔ Domain mapping MUST occur in Application layer.
 */
export class DeploymentMapper {
    static toDomain(dto: any): Deployment {
        // Fallback for ID (uuid vs id)
        const id = dto.uuid || dto.id || Math.random().toString(36).substring(7);

        // Fallback for service
        const service = dto.service || 'unknown-service';

        // Fallback for version (version_tag vs version)
        const version = dto.version_tag || dto.version || 'v0.0.1';

        // Fallback for environment (env_name vs environment)
        const environment = (dto.env_name || dto.environment || 'DEVELOPMENT') as 'PRODUCTION' | 'STAGING' | 'DEVELOPMENT';

        // Fallback for status (current_status vs status)
        const rawStatus = dto.current_status || dto.status || 'REQUESTED';
        const status = (Object.values(DeploymentStatus).includes(rawStatus as DeploymentStatus))
            ? (rawStatus as DeploymentStatus)
            : DeploymentStatus.REQUESTED;

        // Fallback for user (user_id vs requestedBy)
        const requestedBy = dto.user_id || dto.requestedBy || 'system';

        // Fallback for dates
        const createdAt = dto.timestamp || dto.createdAt ? new Date(dto.timestamp || dto.createdAt) : new Date();
        const updatedAt = dto.last_update || dto.updatedAt ? new Date(dto.last_update || dto.updatedAt) : createdAt;

        return new Deployment({
            id,
            service,
            version,
            environment,
            status,
            requestedBy,
            reviewedBy: dto.reviewer_id || dto.reviewedBy,
            approvedBy: dto.approver_id || dto.approvedBy,
            createdAt: isNaN(createdAt.getTime()) ? new Date() : createdAt,
            updatedAt: isNaN(updatedAt.getTime()) ? (isNaN(createdAt.getTime()) ? new Date() : createdAt) : updatedAt,
            history: (dto.history || []).map((h: any) => ({
                status: h.status,
                timestamp: new Date(h.timestamp),
                userId: h.userId,
                comment: h.comment
            })),
            logs: dto.logs || []
        });
    }

    static toPersistence(entity: Deployment): DeploymentDto {
        return {
            uuid: entity.id,
            service: entity.service,
            version_tag: entity.version,
            env_name: entity.environment as any,
            current_status: entity.status,
            user_id: entity.requestedBy,
            reviewer_id: (entity as any).reviewedBy, // reviewedBy not getter yet
            approver_id: (entity as any).approvedBy, // approvedBy not getter yet
            timestamp: entity.createdAt.toISOString(),
            last_update: new Date().toISOString(),
            history: entity.history.map(h => ({
                ...h,
                timestamp: h.timestamp.toISOString()
            })),
            logs: entity.logs
        };
    }
}
