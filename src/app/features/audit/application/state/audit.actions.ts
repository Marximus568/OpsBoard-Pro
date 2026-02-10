import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AuditLog } from '../../domain/models/audit-log.entity';

export const AuditActions = createActionGroup({
    source: 'Audit',
    events: {
        'Load Logs': emptyProps(),
        'Load Logs Success': props<{ logs: AuditLog[] }>(),
        'Load Logs Failure': props<{ error: string }>(),
    }
});
