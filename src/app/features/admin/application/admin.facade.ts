import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserAdmin } from '../domain/models/admin-entities';
import { AdminActions } from './state/admin.actions';
import { selectUsers, selectRoles, selectFeatureFlags, selectConfigurations, selectIsLoading, selectError } from './state/admin.selectors';

@Injectable({
    providedIn: 'root'
})
export class AdminFacade {
    private readonly store = inject(Store);

    // Selectors
    readonly users = this.store.selectSignal(selectUsers);
    readonly roles = this.store.selectSignal(selectRoles);
    readonly featureFlags = this.store.selectSignal(selectFeatureFlags);
    readonly configurations = this.store.selectSignal(selectConfigurations);

    readonly isLoading = this.store.selectSignal(selectIsLoading);
    readonly error = this.store.selectSignal(selectError);

    // Actions
    loadAll(): void {
        this.store.dispatch(AdminActions.loadAllData());
    }

    updateUser(user: Partial<UserAdmin>): void {
        this.store.dispatch(AdminActions.updateUser({ user }));
    }

    createUser(user: Omit<UserAdmin, 'uuid'>): void {
        this.store.dispatch(AdminActions.createUser({ user }));
    }

    deleteUser(uuid: string): void {
        this.store.dispatch(AdminActions.deleteUser({ uuid }));
    }

    toggleFeatureFlag(id: string, enabled: boolean): void {
        this.store.dispatch(AdminActions.toggleFeatureFlag({ id, enabled }));
    }

    updateConfig(id: string, value: string): void {
        this.store.dispatch(AdminActions.updateConfig({ id, value }));
    }
}
