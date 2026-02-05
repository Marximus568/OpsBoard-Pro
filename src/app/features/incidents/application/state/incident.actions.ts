import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Incident } from '../../domain/models/incident.entity';

export const IncidentActions = createActionGroup({
    source: 'Incident API',
    events: {
        'Load Incidents': emptyProps(),
        'Load Incidents Success': props<{ incidents: Incident[] }>(),
        'Load Incidents Failure': props<{ error: string }>(),

        'Create Incident': props<{ incident: Partial<Incident> }>(),
        'Create Incident Success': props<{ incident: Incident }>(),
        'Create Incident Failure': props<{ error: string }>(),

        'Update Incident': props<{ incident: Incident }>(),
        'Update Incident Success': props<{ incident: Incident }>(),
        'Update Incident Failure': props<{ error: string }>(),

        'Delete Incident': props<{ id: string }>(),
        'Delete Incident Success': props<{ id: string }>(),
        'Delete Incident Failure': props<{ error: string }>(),
    }
});
