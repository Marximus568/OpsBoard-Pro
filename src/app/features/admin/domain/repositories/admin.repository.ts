import { Observable } from 'rxjs';
import { UserAdmin, Role, FeatureFlag, SystemConfig } from '../models/admin-entities';

export interface IAdminRepository {
    // Users
    getUsers(): Observable<UserAdmin[]>;
    updateUser(user: Partial<UserAdmin>): Observable<UserAdmin>;
    deleteUser(uuid: string): Observable<void>;

    // Roles
    getRoles(): Observable<Role[]>;
    updateRole(role: Role): Observable<Role>;

    // Feature Flags
    getFeatureFlags(): Observable<FeatureFlag[]>;
    toggleFeatureFlag(key: string, enabled: boolean): Observable<FeatureFlag>;

    // Config
    getConfigurations(): Observable<SystemConfig[]>;
    updateConfiguration(key: string, value: string): Observable<SystemConfig>;
}
