import { Deployment } from '../../domain/models/deployment.entity';
import { DeploymentStatus } from '../../domain/models/deployment-status.model';

export interface DeploymentDto {
    id: string;
    serviceName: string;
    version: string;
    status: DeploymentStatus;
    environment: string;
    deployedBy: string;
    reviewer_id?: string;
    approver_id?: string;
    createdAt: string;
    updatedAt: string;
    history?: unknown[];
    logs?: string[];
}

/**
 * Mapper for Deployment data.
 * Adheres to Rule 82: DTO ↔ Domain mapping MUST occur in Application layer.
 */
export class DeploymentMapper {
    static toDomain(rawDto: DeploymentDto | Record<string, unknown>): Deployment {
        const dto = rawDto as Record<string, unknown>;
        // Fallback for ID (uuid vs id)
        const id = (dto['uuid'] || dto['id'] || Math.random().toString(36).substring(7)) as string;

        // Fallback for service
        const service = (dto['service'] || dto['serviceName'] || 'unknown-service') as string;

        // Fallback for version (version_tag vs version)
        const version = (dto['version_tag'] || dto['version'] || 'v0.0.1') as string;

        // Fallback for environment (env_name vs environment)
        const environment = (dto['env_name'] || dto['environment'] || 'DEVELOPMENT') as 'PRODUCTION' | 'STAGING' | 'DEVELOPMENT';

        // Fallback for status (current_status vs status)
        const rawStatus = dto['current_status'] || dto['status'] || 'REQUESTED';
        const status = (Object.values(DeploymentStatus).includes(rawStatus as DeploymentStatus))
            ? (rawStatus as DeploymentStatus)
            : DeploymentStatus.REQUESTED;

        // Fallback for user (user_id vs requestedBy)
        const requestedBy = (dto['user_id'] || dto['requestedBy'] || dto['deployedBy'] || 'system') as string;

        // Fallback for dates
        const createdAt = dto['timestamp'] || dto['createdAt'] ? new Date((dto['timestamp'] || dto['createdAt']) as string) : new Date();
        const updatedAt = dto['last_update'] || dto['updatedAt'] ? new Date((dto['last_update'] || dto['updatedAt']) as string) : createdAt;

        return new Deployment({
            id,
            service,
            version,
            environment,
            status,
            requestedBy,
            reviewedBy: (dto['reviewer_id'] || dto['reviewedBy']) as string,
            approvedBy: (dto['approver_id'] || dto['approvedBy']) as string,
            createdAt: isNaN(createdAt.getTime()) ? new Date() : createdAt,
            updatedAt: isNaN(updatedAt.getTime()) ? (isNaN(createdAt.getTime()) ? new Date() : createdAt) : updatedAt,
            history: ((dto['history'] as Record<string, unknown>[]) || []).map((h: Record<string, unknown>) => ({
                status: (h['status'] as string) as DeploymentStatus,
                timestamp: new Date(h['timestamp'] as string),
                userId: h['userId'] as string,
                comment: h['comment'] as string
            })),
            logs: (dto['logs'] as string[]) || []
        });
    }

    static toPersistence(entity: Deployment): DeploymentDto {
        return {
            id: entity.id,
            serviceName: entity.service,
            version: entity.version,
            environment: entity.environment,
            status: entity.status,
            deployedBy: entity.requestedBy,
            reviewer_id: entity.reviewedBy,
            approver_id: entity.approvedBy,
            createdAt: entity.createdAt.toISOString(),
            updatedAt: entity.updatedAt.toISOString(),
            history: entity.history.map(h => ({
                status: h.status,
                timestamp: h.timestamp.toISOString(),
                userId: h.userId,
                comment: h.comment
            })),
            logs: entity.logs
        };
    }
}
