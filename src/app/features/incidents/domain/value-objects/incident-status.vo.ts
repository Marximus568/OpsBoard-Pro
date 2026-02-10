/**
 * IncidentStatus Value Object
 *
 * Framework-agnostic. Encapsulates status transitions and guards.
 */

export enum IncidentStatusEnum {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED',
}

const VALID_TRANSITIONS: Record<IncidentStatusEnum, IncidentStatusEnum[]> = {
    [IncidentStatusEnum.OPEN]: [IncidentStatusEnum.IN_PROGRESS, IncidentStatusEnum.CLOSED],
    [IncidentStatusEnum.IN_PROGRESS]: [IncidentStatusEnum.RESOLVED, IncidentStatusEnum.OPEN],
    [IncidentStatusEnum.RESOLVED]: [IncidentStatusEnum.CLOSED, IncidentStatusEnum.IN_PROGRESS],
    [IncidentStatusEnum.CLOSED]: [],
};

export class IncidentStatus {
    private constructor(public readonly value: IncidentStatusEnum) { }

    static create(value: IncidentStatusEnum): IncidentStatus {
        if (!Object.values(IncidentStatusEnum).includes(value)) {
            throw new Error(`Invalid incident status: ${value}`);
        }
        return new IncidentStatus(value);
    }

    static fromString(value: string): IncidentStatus {
        const enumValue = value as IncidentStatusEnum;
        return IncidentStatus.create(enumValue);
    }

    canTransitionTo(target: IncidentStatusEnum): boolean {
        return VALID_TRANSITIONS[this.value].includes(target);
    }

    getAllowedTransitions(): IncidentStatusEnum[] {
        return [...VALID_TRANSITIONS[this.value]];
    }

    isOpen(): boolean {
        return this.value === IncidentStatusEnum.OPEN;
    }

    isInProgress(): boolean {
        return this.value === IncidentStatusEnum.IN_PROGRESS;
    }

    isResolved(): boolean {
        return this.value === IncidentStatusEnum.RESOLVED;
    }

    isClosed(): boolean {
        return this.value === IncidentStatusEnum.CLOSED;
    }

    isActive(): boolean {
        return this.isOpen() || this.isInProgress();
    }

    get label(): string {
        const labels: Record<IncidentStatusEnum, string> = {
            [IncidentStatusEnum.OPEN]: 'Open',
            [IncidentStatusEnum.IN_PROGRESS]: 'In Progress',
            [IncidentStatusEnum.RESOLVED]: 'Resolved',
            [IncidentStatusEnum.CLOSED]: 'Closed',
        };
        return labels[this.value];
    }

    equals(other: IncidentStatus): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
