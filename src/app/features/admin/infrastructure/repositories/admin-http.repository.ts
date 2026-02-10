import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { IAdminRepository } from '../../domain/repositories/admin.repository';
import { UserAdmin, Role, FeatureFlag, SystemConfig } from '../../domain/models/admin-entities';
import { AdminMapper, UserAdminDto, RoleDto, FeatureFlagDto, SystemConfigDto } from '../../application/mappers/admin.mapper';

@Injectable({
    providedIn: 'root'
})
export class AdminHttpRepository implements IAdminRepository {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:3000'; // Hardcoded for demo, normally environment.apiUrl

    getUsers(): Observable<UserAdmin[]> {
        return this.http.get<UserAdminDto[]>(`${this.apiUrl}/users`).pipe(
            map(dtos => dtos.map(dto => AdminMapper.toDomainUser(dto)))
        );
    }

    createUser(user: Omit<UserAdmin, 'uuid'>): Observable<UserAdmin> {
        return this.http.post<UserAdminDto>(`${this.apiUrl}/users`, user).pipe(
            map(dto => AdminMapper.toDomainUser(dto))
        );
    }

    updateUser(user: Partial<UserAdmin>): Observable<UserAdmin> {
        return this.http.patch<UserAdminDto>(`${this.apiUrl}/users/${user.uuid}`, user).pipe(
            map(dto => AdminMapper.toDomainUser(dto))
        );
    }

    deleteUser(uuid: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/users/${uuid}`);
    }

    getRoles(): Observable<Role[]> {
        return this.http.get<RoleDto[]>(`${this.apiUrl}/roles`).pipe(
            map(dtos => dtos.map(dto => AdminMapper.toDomainRole(dto)))
        );
    }

    updateRole(role: Role): Observable<Role> {
        return this.http.put<RoleDto>(`${this.apiUrl}/roles/${role.id}`, role).pipe(
            map(dto => AdminMapper.toDomainRole(dto))
        );
    }

    getFeatureFlags(): Observable<FeatureFlag[]> {
        return this.http.get<FeatureFlagDto[]>(`${this.apiUrl}/featureFlags`).pipe(
            map(dtos => dtos.map(dto => AdminMapper.toDomainFlag(dto)))
        );
    }

    toggleFeatureFlag(key: string, enabled: boolean): Observable<FeatureFlag> {
        return this.http.patch<FeatureFlagDto>(`${this.apiUrl}/featureFlags/${key}`, { enabled }).pipe(
            map(dto => AdminMapper.toDomainFlag(dto))
        );
    }

    getConfigurations(): Observable<SystemConfig[]> {
        return this.http.get<SystemConfigDto[]>(`${this.apiUrl}/configurations`).pipe(
            map(dtos => dtos.map(dto => AdminMapper.toDomainConfig(dto)))
        );
    }

    updateConfiguration(key: string, value: string): Observable<SystemConfig> {
        return this.http.patch<SystemConfigDto>(`${this.apiUrl}/configurations/${key}`, { value }).pipe(
            map(dto => AdminMapper.toDomainConfig(dto))
        );
    }
}
