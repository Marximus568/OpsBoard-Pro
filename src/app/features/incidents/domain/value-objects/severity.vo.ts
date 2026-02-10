/**
 * Severity Value Object
 *
 * Framework-agnostic. Defines incident severity levels (SEV1–SEV4).
 */

export enum SeverityLevel {
    SEV1 = 'SEV1',
    SEV2 = 'SEV2',
    SEV3 = 'SEV3',
    SEV4 = 'SEV4',
}

const SEVERITY_LABELS: Record<SeverityLevel, string> = {
    [SeverityLevel.SEV1]: 'SEV-1 (Critical)',
    [SeverityLevel.SEV2]: 'SEV-2 (Major)',
    [SeverityLevel.SEV3]: 'SEV-3 (Minor)',
    [SeverityLevel.SEV4]: 'SEV-4 (Low)',
};

const SEVERITY_WEIGHTS: Record<SeverityLevel, number> = {
    [SeverityLevel.SEV1]: 4,
    [SeverityLevel.SEV2]: 3,
    [SeverityLevel.SEV3]: 2,
    [SeverityLevel.SEV4]: 1,
};

export class Severity {
    private constructor(public readonly value: SeverityLevel) { }

    static create(value: SeverityLevel): Severity {
        if (!Object.values(SeverityLevel).includes(value)) {
            throw new Error(`Invalid severity: ${value}`);
        }
        return new Severity(value);
    }

    static fromString(value: string): Severity {
        return Severity.create(value as SeverityLevel);
    }

    get label(): string {
        return SEVERITY_LABELS[this.value];
    }

    get numericWeight(): number {
        return SEVERITY_WEIGHTS[this.value];
    }

    isPageWorthy(): boolean {
        return this.value === SeverityLevel.SEV1 || this.value === SeverityLevel.SEV2;
    }

    isHigherThan(other: Severity): boolean {
        return this.numericWeight > other.numericWeight;
    }

    equals(other: Severity): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
