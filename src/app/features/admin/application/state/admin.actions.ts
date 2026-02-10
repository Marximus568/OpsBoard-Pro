import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { UserAdmin, Role, FeatureFlag, SystemConfig } from '../../domain/models/admin-entities';

export const AdminActions = createActionGroup({
    source: 'Admin',
    events: {
        'Load All Data': emptyProps(),
        'Load All Data Success': props<{ users: UserAdmin[], roles: Role[], flags: FeatureFlag[], configs: SystemConfig[] }>(),
        'Load All Data Failure': props<{ error: string }>(),

        'Update User': props<{ user: Partial<UserAdmin> }>(),
        'Update User Success': props<{ user: UserAdmin }>(),
        'Update User Failure': props<{ error: string }>(),

        'Create User': props<{ user: Omit<UserAdmin, 'uuid'> }>(),
        'Create User Success': props<{ user: UserAdmin }>(),
        'Create User Failure': props<{ error: string }>(),

        'Delete User': props<{ uuid: string }>(),
        'Delete User Success': props<{ uuid: string }>(),
        'Delete User Failure': props<{ error: string }>(),

        'Toggle Feature Flag': props<{ id: string, enabled: boolean }>(),
        'Toggle Feature Flag Success': props<{ flag: FeatureFlag }>(),
        'Toggle Feature Flag Failure': props<{ error: string }>(),

        'Update Config': props<{ id: string, value: string }>(),
        'Update Config Success': props<{ config: SystemConfig }>(),
        'Update Config Failure': props<{ error: string }>(),
    }
});
