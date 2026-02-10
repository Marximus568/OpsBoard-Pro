import { Deployment } from '../../domain/models/deployment.entity';
import { DeploymentStatus } from '../../domain/models/deployment-status.model';

export interface DeploymentDto {
    uuid: string;
    version_tag: string;
    env_name: string;
    current_status: DeploymentStatus;
    user_id: string;
    reviewer_id?: string;
    approver_id?: string;
    timestamp: string;
    last_update: string;
}

/**
 * Mapper for Deployment data.
 * Adheres to Rule 82: DTO ↔ Domain mapping MUST occur in Application layer.
 */
export class DeploymentMapper {
    static toDomain(dto: any): Deployment {
        // Fallback for ID (uuid vs id)
        const id = dto.uuid || dto.id || Math.random().toString(36).substring(7);

        // Fallback for version (version_tag vs version)
        const version = dto.version_tag || dto.version || 'v0.0.1';

        // Fallback for environment (env_name vs environment)
        const environment = (dto.env_name || dto.environment || 'DEVELOPMENT') as 'PRODUCTION' | 'STAGING' | 'DEVELOPMENT';

        // Fallback for status (current_status vs status)
        // Normalize status to valid DeploymentStatus enum
        const rawStatus = dto.current_status || dto.status || 'REQUESTED';
        const status = (Object.values(DeploymentStatus).includes(rawStatus as DeploymentStatus))
            ? (rawStatus as DeploymentStatus)
            : DeploymentStatus.REQUESTED;

        // Fallback for user (user_id vs requestedBy)
        const requestedBy = dto.user_id || dto.requestedBy || 'system';

        // Fallback for dates (timestamp vs createdAt/updatedAt)
        const createdAt = dto.timestamp || dto.createdAt ? new Date(dto.timestamp || dto.createdAt) : new Date();
        const updatedAt = dto.last_update || dto.updatedAt ? new Date(dto.last_update || dto.updatedAt) : createdAt;

        return new Deployment({
            id,
            version,
            environment,
            status,
            requestedBy,
            reviewedBy: dto.reviewer_id || dto.reviewedBy,
            approvedBy: dto.approver_id || dto.approvedBy,
            createdAt: isNaN(createdAt.getTime()) ? new Date() : createdAt,
            updatedAt: isNaN(updatedAt.getTime()) ? (isNaN(createdAt.getTime()) ? new Date() : createdAt) : updatedAt
        });
    }

    static toPersistence(entity: Deployment): DeploymentDto {
        const props = entity.toJSON();
        return {
            uuid: props.id,
            version_tag: props.version,
            env_name: props.environment,
            current_status: props.status,
            user_id: props.requestedBy,
            reviewer_id: props.reviewedBy,
            approver_id: props.approvedBy,
            timestamp: props.createdAt.toISOString(),
            last_update: props.updatedAt.toISOString()
        };
    }
}
