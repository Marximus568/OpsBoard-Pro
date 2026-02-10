import { IncidentStatus } from '../value-objects/incident-status.vo';
import { Priority } from '../value-objects/priority.vo';
import { Severity } from '../value-objects/severity.vo';
import { IncidentEvent } from './incident-event.model';

/**
 * Incident Entity
 * 
 * Core business entity following Clean Architecture.
 * Encapsulates properties and business rules.
 */
export interface IncidentProps {
    id: string;
    title: string;
    description: string;
    status: IncidentStatus;
    priority: Priority;
    severity: Severity;
    assigneeId: string | null;
    reporterId: string;
    service: string;
    slaBreached: boolean;
    createdAt: Date;
    updatedAt: Date;
    resolvedAt: Date | null;
    closedAt: Date | null;
    tags: string[];
    timeline: IncidentEvent[];
}

export class Incident {
    public readonly id: string;
    public readonly title: string;
    public readonly description: string;
    public readonly status: IncidentStatus;
    public readonly priority: Priority;
    public readonly severity: Severity;
    public readonly assigneeId: string | null;
    public readonly reporterId: string;
    public readonly service: string;
    public readonly slaBreached: boolean;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;
    public readonly resolvedAt: Date | null;
    public readonly closedAt: Date | null;
    public readonly tags: string[];
    public readonly timeline: IncidentEvent[];

    constructor(props: IncidentProps) {
        this.id = props.id;
        this.title = props.title;
        this.description = props.description;
        this.status = props.status;
        this.priority = props.priority;
        this.severity = props.severity;
        this.assigneeId = props.assigneeId;
        this.reporterId = props.reporterId;
        this.service = props.service;
        this.slaBreached = props.slaBreached;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.resolvedAt = props.resolvedAt;
        this.closedAt = props.closedAt;
        this.tags = [...props.tags];
        this.timeline = [...props.timeline];
    }

    /**
     * Domain Rules
     */
    canBeAssigned(): boolean {
        return this.status.isOpen() || this.status.isInProgress();
    }

    canBeResolved(): boolean {
        return this.status.isInProgress();
    }

    canBeClosed(): boolean {
        return this.status.isResolved();
    }

    requiresEscalation(): boolean {
        return this.priority.isEscalationRequired() && this.severity.isPageWorthy();
    }

    /**
     * State Transitions (Immutability)
     */
    withAssignee(assigneeId: string, event: IncidentEvent): Incident {
        if (!this.canBeAssigned()) {
            throw new Error(`Incident ${this.id} cannot be assigned in status ${this.status.value}`);
        }
        return new Incident({
            ...this.toProps(),
            assigneeId,
            updatedAt: new Date(),
            timeline: [...this.timeline, event]
        });
    }

    withStatus(newStatus: IncidentStatus, event: IncidentEvent): Incident {
        if (!this.status.canTransitionTo(newStatus.value)) {
            throw new Error(`Cannot transition from ${this.status.value} to ${newStatus.value}`);
        }

        return new Incident({
            ...this.toProps(),
            status: newStatus,
            updatedAt: new Date(),
            timeline: [...this.timeline, event],
            resolvedAt: newStatus.isResolved() ? new Date() : this.resolvedAt,
            closedAt: newStatus.isClosed() ? new Date() : this.closedAt
        });
    }

    private toProps(): IncidentProps {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            status: this.status,
            priority: this.priority,
            severity: this.severity,
            assigneeId: this.assigneeId,
            reporterId: this.reporterId,
            service: this.service,
            slaBreached: this.slaBreached,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            resolvedAt: this.resolvedAt,
            closedAt: this.closedAt,
            tags: this.tags,
            timeline: this.timeline
        };
    }

    toJSON(): IncidentProps {
        return this.toProps();
    }
}
