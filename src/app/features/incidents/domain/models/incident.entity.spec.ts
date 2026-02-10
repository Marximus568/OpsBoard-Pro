import { Incident } from './incident.entity';
import { IncidentStatus, IncidentStatusEnum } from '../value-objects/incident-status.vo';
import { Priority, PriorityLevel } from '../value-objects/priority.vo';
import { Severity, SeverityLevel } from '../value-objects/severity.vo';
import { IncidentEvent } from './incident-event.model';

describe('Incident Entity', () => {
    const createIncident = (status: IncidentStatusEnum) => new Incident({
        id: '1',
        title: 'T',
        description: 'D',
        status: IncidentStatus.create(status),
        priority: Priority.create(PriorityLevel.LOW),
        severity: Severity.create(SeverityLevel.SEV4),
        assigneeId: null,
        reporterId: 'r',
        service: 's',
        slaBreached: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        resolvedAt: null,
        closedAt: null,
        tags: [],
        timeline: []
    });

    it('should allow assignment only when open or in progress', () => {
        const open = createIncident(IncidentStatusEnum.OPEN);
        expect(open.canBeAssigned()).toBe(true);

        const progress = createIncident(IncidentStatusEnum.IN_PROGRESS);
        expect(progress.canBeAssigned()).toBe(true);

        const resolved = createIncident(IncidentStatusEnum.RESOLVED);
        expect(resolved.canBeAssigned()).toBe(false);
    });

    it('should allow resolution only when in progress', () => {
        const open = createIncident(IncidentStatusEnum.OPEN);
        expect(open.canBeResolved()).toBe(false);

        const progress = createIncident(IncidentStatusEnum.IN_PROGRESS);
        expect(progress.canBeResolved()).toBe(true);
    });

    it('should create new instance with updated status and timeline', () => {
        const incident = createIncident(IncidentStatusEnum.OPEN);
        const event = new IncidentEvent('e1', 'STATUS_CHANGED', new Date(), 'u1', 'Started');

        const updated = incident.withStatus(IncidentStatus.create(IncidentStatusEnum.IN_PROGRESS), event);

        expect(updated.status.value).toBe(IncidentStatusEnum.IN_PROGRESS);
        expect(updated.timeline.length).toBe(1);
        expect(updated).not.toBe(incident); // Immutability
    });
});
