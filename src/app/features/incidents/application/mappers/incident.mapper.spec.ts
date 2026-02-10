import { IncidentMapper, IncidentDto } from './incident.mapper';
import { IncidentStatusEnum } from '../../domain/value-objects/incident-status.vo';
import { PriorityLevel } from '../../domain/value-objects/priority.vo';
import { SeverityLevel } from '../../domain/value-objects/severity.vo';

describe('IncidentMapper', () => {
    const mockDto: IncidentDto = {
        id: 'INC-123',
        title: 'Test Incident',
        description: 'Test Description',
        status: 'OPEN',
        priority: 'HIGH',
        severity: 'SEV2',
        assigneeId: 'user-1',
        reporterId: 'user-2',
        service: 'test-service',
        slaBreached: true,
        createdAt: '2023-01-01T10:00:00.000Z',
        updatedAt: '2023-01-01T11:00:00.000Z',
        resolvedAt: null,
        closedAt: null,
        tags: ['tag1', 'tag2'],
        timeline: [
            { id: 'EVT-1', type: 'CREATED', timestamp: '2023-01-01T10:00:00.000Z', userId: 'user-2', description: 'Reported' }
        ]
    };

    it('should map DTO to Domain Entity correctly', () => {
        const entity = IncidentMapper.toDomain(mockDto);

        expect(entity.id).toBe('INC-123');
        expect(entity.status.value).toBe(IncidentStatusEnum.OPEN);
        expect(entity.priority.value).toBe(PriorityLevel.HIGH);
        expect(entity.severity.value).toBe(SeverityLevel.SEV2);
        expect(entity.slaBreached).toBe(true);
        expect(entity.tags).toContain('tag1');
        expect(entity.timeline.length).toBe(1);
        expect(entity.timeline[0].id).toBe('EVT-1');
    });

    it('should map Domain Entity to Persistence DTO correctly', () => {
        const entity = IncidentMapper.toDomain(mockDto);
        const dto = IncidentMapper.toPersistence(entity);

        expect(dto.id).toBe(mockDto.id);
        expect(dto.status).toBe(mockDto.status);
        expect(dto.priority).toBe(mockDto.priority);
        expect(dto.severity).toBe(mockDto.severity);
        expect(dto.tags).toEqual(mockDto.tags);
        expect(dto.timeline[0].id).toBe('EVT-1');
    });
});
