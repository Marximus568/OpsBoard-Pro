import { DeploymentStatus, DeploymentWorkflowRules } from './deployment-status.model';

export interface DeploymentHistoryEntry {
    status: DeploymentStatus;
    timestamp: Date;
    userId: string;
    comment?: string;
}

export interface DeploymentProps {
    id: string;
    service: string;
    version: string;
    environment: 'PRODUCTION' | 'STAGING' | 'DEVELOPMENT';
    status: DeploymentStatus;
    requestedBy: string;
    reviewedBy?: string;
    approvedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    history: DeploymentHistoryEntry[];
    logs: string[];
}

/**
 * Deployment Entity.
 * Encapsulates the state and business logic of a deployment process.
 */
export class Deployment {
    constructor(private readonly props: DeploymentProps) { }

    get id(): string { return this.props.id; }
    get service(): string { return this.props.service; }
    get version(): string { return this.props.version; }
    get environment(): string { return this.props.environment; }
    get status(): DeploymentStatus { return this.props.status; }
    get requestedBy(): string { return this.props.requestedBy; }
    get reviewedBy(): string | undefined { return this.props.reviewedBy; }
    get approvedBy(): string | undefined { return this.props.approvedBy; }
    get createdAt(): Date { return this.props.createdAt; }
    get updatedAt(): Date { return this.props.updatedAt; }
    get history(): DeploymentHistoryEntry[] { return this.props.history; }
    get logs(): string[] { return this.props.logs; }

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

    addLog(log: string): Deployment {
        return new Deployment({
            ...this.props,
            logs: [...this.props.logs, log],
            updatedAt: new Date()
        });
    }

    addHistory(entry: DeploymentHistoryEntry): Deployment {
        return new Deployment({
            ...this.props,
            history: [...this.props.history, entry],
            updatedAt: new Date()
        });
    }

    toJSON(): DeploymentProps {
        return { ...this.props };
    }
}
