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
    static toDomain(dto: DeploymentDto): Deployment {
        return new Deployment({
            id: dto.uuid,
            version: dto.version_tag,
            environment: dto.env_name as 'PRODUCTION' | 'STAGING' | 'DEVELOPMENT',
            status: dto.current_status,
            requestedBy: dto.user_id,
            reviewedBy: dto.reviewer_id,
            approvedBy: dto.approver_id,
            createdAt: new Date(dto.timestamp),
            updatedAt: new Date(dto.last_update)
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
