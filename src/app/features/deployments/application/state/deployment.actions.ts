import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Deployment } from '../../domain/models/deployment.entity';
import { DeploymentStatus } from '../../domain/models/deployment-status.model';

export const DeploymentActions = createActionGroup({
    source: 'Deployment',
    events: {
        'Load Deployments': emptyProps(),
        'Load Deployments Success': props<{ deployments: Deployment[] }>(),
        'Load Deployments Failure': props<{ error: string }>(),

        'Request Deployment': props<{ version: string; environment: string }>(),
        'Select Deployment': props<{ id: string | null }>(),
        'Update Deployment Status': props<{ id: string; status: DeploymentStatus }>(),

        'Approve Deployment': props<{ id: string; comment: string }>(),
        'Reject Deployment': props<{ id: string; comment: string }>(),

        'Execute Deployment': props<{ id: string }>(),
        'Execute Deployment Success': props<{ deployment: Deployment }>(),
        'Execute Deployment Failure': props<{ error: string }>(),

        'Stream Deployment Logs': props<{ id: string }>(),
        'Stop Logs Stream': emptyProps()
    }
});
