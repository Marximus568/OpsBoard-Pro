/**
 * Enum for the strictly defined Deployment Workflow.
 */
export enum DeploymentStatus {
    REQUESTED = 'REQUESTED',
    REVIEW = 'REVIEW',
    APPROVED = 'APPROVED',
    RUNNING = 'RUNNING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED'
}

/**
 * Validation rules for deployment status transitions.
 * DESIGN: Pure domain logic ensuring the workflow integrity.
 */
export class DeploymentWorkflowRules {
    private static readonly ALLOWED_TRANSITIONS: Record<DeploymentStatus, DeploymentStatus[]> = {
        [DeploymentStatus.REQUESTED]: [DeploymentStatus.REVIEW, DeploymentStatus.APPROVED, DeploymentStatus.FAILED],
        [DeploymentStatus.REVIEW]: [DeploymentStatus.APPROVED, DeploymentStatus.FAILED],
        [DeploymentStatus.APPROVED]: [DeploymentStatus.RUNNING, DeploymentStatus.FAILED],
        [DeploymentStatus.RUNNING]: [DeploymentStatus.SUCCESS, DeploymentStatus.FAILED],
        [DeploymentStatus.SUCCESS]: [],
        [DeploymentStatus.FAILED]: [DeploymentStatus.REQUESTED] // Can retry
    };

    static canTransitionTo(current: DeploymentStatus, target: DeploymentStatus): boolean {
        return this.ALLOWED_TRANSITIONS[current].includes(target);
    }

    static isTerminalState(status: DeploymentStatus): boolean {
        return status === DeploymentStatus.SUCCESS || status === DeploymentStatus.FAILED;
    }
}
