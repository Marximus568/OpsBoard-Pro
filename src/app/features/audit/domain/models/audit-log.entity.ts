export interface AuditLog {
    id: string;
    timestamp: string;
    userId: string;
    action: string;
    resource: string;
    metadata?: Record<string, unknown>;
}

export interface CreateAuditLogInput {
    userId: string;
    action: string;
    resource: string;
    metadata?: Record<string, unknown>;
}
