/**
 * Priority Value Object
 *
 * Framework-agnostic. Defines incident priority levels with ordering.
 */

export enum PriorityLevel {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL',
}

const PRIORITY_WEIGHTS: Record<PriorityLevel, number> = {
    [PriorityLevel.LOW]: 1,
    [PriorityLevel.MEDIUM]: 2,
    [PriorityLevel.HIGH]: 3,
    [PriorityLevel.CRITICAL]: 4,
};

const PRIORITY_LABELS: Record<PriorityLevel, string> = {
    [PriorityLevel.LOW]: 'Low',
    [PriorityLevel.MEDIUM]: 'Medium',
    [PriorityLevel.HIGH]: 'High',
    [PriorityLevel.CRITICAL]: 'Critical',
};

export class Priority {
    private constructor(public readonly value: PriorityLevel) { }

    static create(value: PriorityLevel): Priority {
        if (!Object.values(PriorityLevel).includes(value)) {
            throw new Error(`Invalid priority: ${value}`);
        }
        return new Priority(value);
    }

    static fromString(value: string): Priority {
        return Priority.create(value as PriorityLevel);
    }

    get numericWeight(): number {
        return PRIORITY_WEIGHTS[this.value];
    }

    get label(): string {
        return PRIORITY_LABELS[this.value];
    }

    isHigherThan(other: Priority): boolean {
        return this.numericWeight > other.numericWeight;
    }

    isEscalationRequired(): boolean {
        return this.value === PriorityLevel.CRITICAL || this.value === PriorityLevel.HIGH;
    }

    equals(other: Priority): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
