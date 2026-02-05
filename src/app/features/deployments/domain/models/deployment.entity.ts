import { DeploymentStatus, DeploymentWorkflowRules } from './deployment-status.model';

export interface DeploymentProps {
    id: string;
    version: string;
    environment: 'PRODUCTION' | 'STAGING' | 'DEVELOPMENT';
    status: DeploymentStatus;
    requestedBy: string;
    reviewedBy?: string;
    approvedBy?: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Deployment Entity.
 * Encapsulates the state and business logic of a deployment process.
 */
export class Deployment {
    constructor(private readonly props: DeploymentProps) { }

    get id(): string { return this.props.id; }
    get version(): string { return this.props.version; }
    get environment(): string { return this.props.environment; }
    get status(): DeploymentStatus { return this.props.status; }
    get requestedBy(): string { return this.props.requestedBy; }
    get createdAt(): Date { return this.props.createdAt; }

    /**
     * Attempts to change the status following the workflow rules.
     */
    transitionTo(newStatus: DeploymentStatus): Deployment {
        if (!DeploymentWorkflowRules.canTransitionTo(this.props.status, newStatus)) {
            throw new Error(`Invalid transition from ${this.props.status} to ${newStatus}`);
        }

        return new Deployment({
            ...this.props,
            status: newStatus,
            updatedAt: new Date()
        });
    }

    toJSON(): DeploymentProps {
        return { ...this.props };
    }
}
