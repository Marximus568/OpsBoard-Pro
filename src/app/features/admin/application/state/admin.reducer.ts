import { createReducer, on } from '@ngrx/store';
import { UserAdmin, Role, FeatureFlag, SystemConfig } from '../../domain/models/admin-entities';
import { AdminActions } from './admin.actions';

export const adminFeatureKey = 'admin';

export interface AdminState {
    users: UserAdmin[];
    roles: Role[];
    featureFlags: FeatureFlag[];
    configurations: SystemConfig[];
    isLoading: boolean;
    error: string | null;
}

export const initialState: AdminState = {
    users: [],
    roles: [],
    featureFlags: [],
    configurations: [],
    isLoading: false,
    error: null,
};

export const adminReducer = createReducer(
    initialState,
    on(AdminActions.loadAllData, (state) => ({ ...state, isLoading: true, error: null })),
    on(AdminActions.loadAllDataSuccess, (state, { users, roles, flags, configs }) => ({
        ...state,
        users,
        roles,
        featureFlags: flags,
        configurations: configs,
        isLoading: false
    })),
    on(AdminActions.loadAllDataFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

    on(AdminActions.createUserSuccess, (state, { user }) => ({
        ...state,
        users: [...state.users, user]
    })),

    on(AdminActions.updateUserSuccess, (state, { user }) => ({
        ...state,
        users: state.users.map(u => u.uuid === user.uuid ? user : u)
    })),

    on(AdminActions.deleteUserSuccess, (state, { uuid }) => ({
        ...state,
        users: state.users.filter(u => u.uuid !== uuid)
    })),

    on(AdminActions.toggleFeatureFlagSuccess, (state, { flag }) => ({
        ...state,
        featureFlags: state.featureFlags.map(f => f.id === flag.id ? flag : f)
    })),

    on(AdminActions.updateConfigSuccess, (state, { config }) => ({
        ...state,
        configurations: state.configurations.map(c => c.id === config.id ? config : c)
    }))
);
