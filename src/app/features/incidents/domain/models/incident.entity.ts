import { IncidentStatus } from './incident-status.enum';
import { IncidentPriority } from './incident-priority.enum';

export interface IncidentProps {
    id: string;
    title: string;
    description: string;
    status: IncidentStatus;
    priority: IncidentPriority;
    createdAt: Date;
    updatedAt: Date;
    reportedBy: string;
    assignedTo?: string;
}

export class Incident {
    constructor(private readonly props: IncidentProps) { }

    get id(): string { return this.props.id; }
    get title(): string { return this.props.title; }
    get description(): string { return this.props.description; }
    get status(): IncidentStatus { return this.props.status; }
    get priority(): IncidentPriority { return this.props.priority; }
    get createdAt(): Date { return this.props.createdAt; }
    get updatedAt(): Date { return this.props.updatedAt; }
    get reportedBy(): string { return this.props.reportedBy; }
    get assignedTo(): string | undefined { return this.props.assignedTo; }

    // Business logic methods
    canBeResolved(): boolean {
        return this.props.status === IncidentStatus.IN_PROGRESS;
    }

    toJSON(): IncidentProps {
        return { ...this.props };
    }
}
