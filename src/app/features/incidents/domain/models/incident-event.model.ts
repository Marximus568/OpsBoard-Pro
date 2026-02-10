export class IncidentEvent {
    constructor(
        public readonly id: string,
        public readonly type: string,
        public readonly timestamp: Date,
        public readonly userId: string,
        public readonly description: string,
        public readonly metadata: Record<string, unknown> = {}
    ) { }
}
