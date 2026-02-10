import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Incident } from '../../domain/models/incident.entity';
import { IncidentState } from './incident.reducer';

export interface CreateIncidentInput {
    title: string;
    description: string;
    priority: string;
    severity: string;
    service: string;
    tags?: string[];
    reporterId: string;
}

export const IncidentActions = createActionGroup({
    source: 'Incident API',
    events: {
        'Load Incidents': emptyProps(),
        'Load Incidents Success': props<{ incidents: Incident[] }>(),
        'Load Incidents Failure': props<{ error: string }>(),

        'Create Incident': props<{ incident: CreateIncidentInput }>(),
        'Create Incident Success': props<{ incident: Incident }>(),
        'Create Incident Failure': props<{ error: string }>(),

        'Update Incident': props<{ incident: Incident }>(),
        'Update Incident Success': props<{ incident: Incident }>(),
        'Update Incident Failure': props<{ error: string }>(),

        'Assign Incident': props<{ incidentId: string; assigneeId: string; userId: string }>(),
        'Assign Incident Success': props<{ incident: Incident }>(),
        'Assign Incident Failure': props<{ error: string }>(),

        'Resolve Incident': props<{ incidentId: string; userId: string; comment: string }>(),
        'Resolve Incident Success': props<{ incident: Incident }>(),
        'Resolve Incident Failure': props<{ error: string }>(),

        'Delete Incident': props<{ id: string }>(),
        'Delete Incident Success': props<{ id: string }>(),
        'Delete Incident Failure': props<{ error: string }>(),

        'Update Filters': props<{ filters: Partial<IncidentState['filters']> }>()
    }
});
